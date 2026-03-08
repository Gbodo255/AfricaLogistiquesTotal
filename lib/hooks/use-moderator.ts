"use client"

import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

// ==================== REQUESTS ====================

// Fetch all requests for moderators — uses the dedicated moderator endpoint
export function useModeratorRequests(status?: string) {
  return useSWR(
    ["moderator-requests", status],
    async () => {
      const res = await djangoApi.getModeratorRequests(status !== "all" ? status : undefined)
      if (res.error) throw new Error(res.error)
      return res.requests || []
    },
    { revalidateOnFocus: false }
  )
}

// Fetch only pending requests
export function usePendingRequests() {
  return useSWR(
    "moderator-pending-requests",
    async () => {
      const res = await djangoApi.getModeratorRequests("PENDING")
      if (res.error) throw new Error(res.error)
      return res.requests || []
    },
    { revalidateOnFocus: false }
  )
}

// Fetch available transporters (approved + active)
export function useAvailableTransporters() {
  return useSWR(
    "available-transporters",
    async () => {
      const res = await djangoApi.getAvailableTransporters()
      if (res.error) throw new Error(res.error)
      return res.transporters || []
    },
    { revalidateOnFocus: false }
  )
}

// Fetch moderator stats from the dedicated endpoint
export function useModeratorStats() {
  return useSWR(
    "moderator-stats",
    async () => {
      const res = await djangoApi.getModeratorStats()
      if (res.error) throw new Error(res.error)
      return res
    },
    { revalidateOnFocus: false, refreshInterval: 30000 } // Refresh every 30s
  )
}

export function useModeratorUsers() {
  return useSWR(
    "moderator-users",
    async () => {
      const res = await djangoApi.getModeratorUsers()
      if (res.error) throw new Error(res.error)
      return res.users || []
    },
    { revalidateOnFocus: false }
  )
}

// ==================== DISPUTES ====================

// Fetch disputes for moderator (real data from backend)
export function useModeratorDisputes(status?: string) {
  return useSWR(
    ["moderator-disputes", status],
    async () => {
      const res = await djangoApi.getDisputes(status !== "all" ? status : undefined)
      if (res.error) throw new Error(res.error)
      return res.disputes || []
    },
    { revalidateOnFocus: false }
  )
}

// Fetch dispute detail with messages
export function useDisputeDetail(disputeSlug?: string) {
  return useSWR(
    disputeSlug ? ["dispute-detail", disputeSlug] : null,
    async () => {
      const res = await djangoApi.getDisputeDetail(disputeSlug!)
      if (res.error) throw new Error(res.error)
      return res.dispute
    },
    { revalidateOnFocus: false }
  )
}

// Legacy: Fetch dispute messages only
export function useDisputeMessages(disputeSlug?: string) {
  return useSWR(
    disputeSlug ? ["dispute-messages", disputeSlug] : null,
    async () => {
      const res = await djangoApi.getDisputeDetail(disputeSlug!)
      if (res.error) throw new Error(res.error)
      return res.dispute?.messages || []
    },
    { revalidateOnFocus: false }
  )
}

// Take a dispute (moderator assigns himself)
export async function takeDispute(disputeSlug: string) {
  const res = await djangoApi.takeDispute(disputeSlug)
  if (res.error) throw new Error(res.error)
  return res.dispute
}

// Resolve a dispute
export async function resolveDispute(disputeSlug: string, resolution: string) {
  const res = await djangoApi.updateDispute(disputeSlug, {
    status: "RESOLVED",
    resolution,
  })
  if (res.error) throw new Error(res.error)
  return res.dispute
}

// Update dispute status
export async function updateDisputeStatus(
  disputeSlug: string,
  status: string,
  resolution?: string
) {
  const res = await djangoApi.updateDispute(disputeSlug, { status, resolution })
  if (res.error) throw new Error(res.error)
  return res.dispute
}

// Send dispute message
export async function sendDisputeMessage(disputeSlug: string, content: string, isModeratorNote = false) {
  const res = await djangoApi.addDisputeMessage(disputeSlug, content, isModeratorNote)
  if (res.error) throw new Error(res.error)
  return res.message
}

// ==================== REQUESTS ACTIONS ====================

// Validate a request
export async function validateRequest(requestSlug: string, finalPrice?: number, comment?: string) {
  const res = await djangoApi.moderatorValidateRequest(requestSlug, finalPrice, comment)
  if (res.error) throw new Error(res.error)
  return res.transport_request
}

// Reject a request
export async function rejectRequest(requestSlug: string, reason: string) {
  const res = await djangoApi.moderatorRejectRequest(requestSlug, reason)
  if (res.error) throw new Error(res.error)
  return res.transport_request
}

// Assign transporter to request
export async function assignTransporter(requestSlug: string, transporterSlug: string) {
  const res = await djangoApi.moderatorAssignTransporter(requestSlug, transporterSlug)
  if (res.error) throw new Error(res.error)
  return res.transport_request
}
