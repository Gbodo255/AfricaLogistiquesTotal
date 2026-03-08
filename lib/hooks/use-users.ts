"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

async function fetchUsers(role?: string) {
  let query = supabase.from("profiles").select(
    `
      *,
      wallet:wallets(balance, currency)
    `,
  )

  if (role) {
    query = query.eq("role", role)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data
}

async function fetchTransporters(verified?: boolean) {
  let query = supabase
    .from("profiles")
    .select(
      `
      *,
      wallet:wallets(balance, currency),
      vehicles(*)
    `,
    )
    .eq("role", "transporteur")

  if (verified !== undefined) {
    query = query.eq("is_verified", verified)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export function useUsers(role?: string) {
  return useSWR(["users", role], () => fetchUsers(role), {
    refreshInterval: 30000,
  })
}

export function useTransporters(verified?: boolean) {
  return useSWR(["transporters", verified], () => fetchTransporters(verified), {
    refreshInterval: 30000,
  })
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function verifyTransporter(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_verified: true })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}
