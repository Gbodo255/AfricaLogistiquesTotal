"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

async function fetchPlatformStats() {
  const { data, error } = await supabase.rpc("get_platform_stats")

  if (error) throw error
  return data
}

async function fetchModeratorStats(moderatorId: string) {
  // Count requests processed today
  const today = new Date().toISOString().split("T")[0]

  const [pendingResult, processedResult, disputesResult] = await Promise.all([
    supabase.from("transport_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("transport_requests")
      .select("*", { count: "exact", head: true })
      .eq("moderator_id", moderatorId)
      .gte("assigned_at", today),
    supabase.from("disputes").select("*", { count: "exact", head: true }).eq("status", "open"),
  ])

  return {
    pending_requests: pendingResult.count || 0,
    processed_today: processedResult.count || 0,
    open_disputes: disputesResult.count || 0,
  }
}

async function fetchTransporterStats(transporterId: string) {
  const [completedResult, earningsResult, ratingResult] = await Promise.all([
    supabase
      .from("transport_requests")
      .select("*", { count: "exact", head: true })
      .eq("transporter_id", transporterId)
      .eq("status", "delivered"),
    supabase.from("wallets").select("balance").eq("user_id", transporterId).single(),
    supabase.from("ratings").select("rating").eq("rated_user_id", transporterId),
  ])

  const avgRating =
    ratingResult.data && ratingResult.data.length > 0
      ? ratingResult.data.reduce((acc, r) => acc + r.rating, 0) / ratingResult.data.length
      : 0

  return {
    completed_missions: completedResult.count || 0,
    balance: earningsResult.data?.balance || 0,
    average_rating: avgRating,
    total_ratings: ratingResult.data?.length || 0,
  }
}

export function usePlatformStats() {
  return useSWR("platform-stats", fetchPlatformStats, {
    refreshInterval: 60000,
  })
}

export function useModeratorStats(moderatorId: string | undefined) {
  return useSWR(moderatorId ? ["moderator-stats", moderatorId] : null, () => fetchModeratorStats(moderatorId!), {
    refreshInterval: 30000,
  })
}

export function useTransporterStats(transporterId: string | undefined) {
  return useSWR(
    transporterId ? ["transporter-stats", transporterId] : null,
    () => fetchTransporterStats(transporterId!),
    {
      refreshInterval: 60000,
    },
  )
}
