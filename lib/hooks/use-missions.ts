import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

// Fetch active missions for a transporter
export function useActiveMissions(transporterId?: string) {
  return useSWR(
    transporterId ? ["active-missions", transporterId] : null,
    async () => {
      const res = await djangoApi.getMyAssignedRequests()
      if (res.error) throw new Error(res.error)
      const missions = (res.transport_requests || []).filter((r: any) => ["ASSIGNED", "IN_PROGRESS"].includes(r.status))
      return missions
    },
    {
      revalidateOnFocus: false,
    },
  )
}

// Fetch completed missions for a transporter
export function useCompletedMissions(transporterId?: string) {
  return useSWR(
    transporterId ? ["completed-missions", transporterId] : null,
    async () => {
      const res = await djangoApi.getMyAssignedRequests()
      if (res.error) throw new Error(res.error)
      const missions = (res.transport_requests || []).filter((r: any) => r.status === "DELIVERED")
      return missions
    },
    {
      revalidateOnFocus: false,
    },
  )
}

// Update mission status
export async function updateMissionStatus(requestSlug: string, status: "IN_PROGRESS" | "DELIVERED", comment?: string) {
  const res = await djangoApi.adminUpdateRequestStatus(requestSlug, status, comment)
  if (res.error) throw new Error(res.error)
  return res.transport_request
}

// Calculate transporter earnings
export function useTransporterEarnings(transporterId?: string) {
  return useSWR(
    transporterId ? ["transporter-earnings", transporterId] : null,
    async () => {
      const res = await djangoApi.getMyAssignedRequests()
      if (res.error) throw new Error(res.error)
      const delivered = (res.transport_requests || []).filter((r: any) => r.status === "DELIVERED")
      const totalEarnings = delivered.reduce((sum: number, r: any) => sum + Number(r.estimated_price || 0), 0)
      return { totalEarnings, monthlyEarnings: totalEarnings, completedCount: delivered.length }
    },
    {
      revalidateOnFocus: false,
    },
  )
}
