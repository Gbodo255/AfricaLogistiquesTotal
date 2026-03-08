"use client"

import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

async function fetchClientRequests() {
  const res = await djangoApi.getMyRequests()
  if (res.error) throw new Error(res.error)
  return res.transport_requests || []
}

async function fetchTransporterMissions() {
  const res = await djangoApi.getMyAssignedRequests()
  if (res.error) throw new Error(res.error)
  return res.transport_requests || []
}

async function fetchAllRequests(status?: string) {
  const res = await djangoApi.getTransportRequests(status ? { status } : undefined)
  if (res.error) throw new Error(res.error)
  return res.transport_requests || []
}

export function useClientRequests(userId: string | undefined) {
  return useSWR(userId ? ["client-requests", userId] : null, () => fetchClientRequests(), {
    refreshInterval: 30000,
  })
}

export function useTransporterMissions(userId: string | undefined) {
  return useSWR(userId ? ["transporter-missions", userId] : null, () => fetchTransporterMissions(), {
    refreshInterval: 30000,
  })
}

export function useAllRequests(status?: string) {
  return useSWR(["all-requests", status], () => fetchAllRequests(status), {
    refreshInterval: 15000,
  })
}

export async function createTransportRequest(payload: {
  title: string
  merchandise_type?: string
  merchandise_description: string
  weight: number
  volume: number
  pickup_address: string
  pickup_city: string
  pickup_coordinates?: string
  delivery_address: string
  delivery_city: string
  delivery_coordinates?: string
  preferred_pickup_date: string
  preferred_delivery_date?: string | null
  priority?: string
  recipient_name: string
  recipient_phone: string
  recipient_email?: string | null
  estimated_price?: number
}) {
  const res = await djangoApi.createTransportRequest(payload)
  if (res.error) throw new Error(res.error)
  return res.transport_request
}

export async function updateTransportRequest(requestSlug: string, payload: { status: string; comment?: string }) {
  // Si le client veut annuler sa demande → endpoint client /demandes/{slug}/annuler/
  if (payload.status === "CANCELLED") {
    const res = await djangoApi.cancelRequest(requestSlug)
    if (res.error) throw new Error(res.error)
    return res.transport_request
  }
  // Pour les autres mises à jour (ex: transporteur ou admin) → endpoint update standard
  const res = await djangoApi.updateTransportRequest(requestSlug, { status: payload.status })
  if (res.error) throw new Error(res.error)
  return res.transport_request
}
