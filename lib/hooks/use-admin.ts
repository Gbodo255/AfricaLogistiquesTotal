"use client"

import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"
import { useLanguage } from "@/lib/i18n/context"
// Note: les types Supabase (Profile, Wallet, etc.) sont incompatibles avec Django — on utilise any

// Fetch admin KPIs
export function useAdminKPIs() {
  return useSWR("admin-kpis", async () => {
    const response = await djangoApi.getAdminKPIs()
    if (response.error) throw new Error(response.error)
    return response
  })
}

// Fetch all users for admin
export function useAdminUsers(role?: string) {
  return useSWR<any[]>(["admin-users", role], async () => {
    const res = await djangoApi.getAdminUsers(role)
    if (res.error) throw new Error(res.error)
    return res.users || []
  })
}

// Fetch recent transactions for admin
export function useAdminTransactions(limit = 10) {
  return useSWR<any[]>(
    ["admin-transactions", limit],
    async () => {
      const res = await djangoApi.getAdminTransactions(limit)
      if (res.error) throw new Error(res.error)
      return (res.transactions as any) || []
    },
  )
}

// Fetch all wallets for admin
export function useAdminWallets() {
  return useSWR<any[]>("admin-wallets", async () => {
    const res = await djangoApi.getAdminWallets()
    if (res.error) throw new Error(res.error)
    return (res.wallets as any) || []
  })
}

// Fetch recent requests for admin
export function useAdminRequests(limit = 10) {
  return useSWR<any[]>(
    ["admin-requests", limit],
    async () => {
      const res = await djangoApi.getAdminRequests({ limit })
      if (res.error) throw new Error(res.error)
      return (res.requests as any) || []
    },
  )
}

// Fetch all disputes for admin
export function useAdminDisputes() {
  return useSWR<any[]>("admin-disputes", async () => {
    // Pas encore de gestion de litiges côté Django → renvoie une liste vide
    return []
  })
}

// Suspend user
export async function suspendUser(userId: string) {
  await djangoApi.suspendUser(userId)
  return true
}

// Activate user
export async function activateUser(userId: string) {
  await djangoApi.activateUser(userId)
  return true
}

// Verify transporter
export async function verifyTransporter(userId: string) {
  await djangoApi.approveTransporter(userId)
  return true
}

// Update user role
export async function updateUserRole(userId: string, role: string) {
  await djangoApi.updateUserRole(userId, role)
  return true
}

// Get chart data for admin
// Fix B9: sépare data (SWR cache) des labels traduits (calculés réactivement)
export function useAdminChartData() {
  const { t } = useLanguage()

  // On ne fetch que les KPIs bruts — les labels sont calculés en dehors du fetcher
  const swrResult = useSWR("admin-chart-data-raw", async () => {
    const kpis = await djangoApi.getAdminKPIs()
    if (kpis.error) throw new Error(kpis.error)

    // Area data : simulation sur 7 jours basée sur les KPIs actuels
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    const areaData = days.map((day, i) => {
      const factor = 0.4 + Math.random() * 0.6
      const isCurrentDay = i === 6
      return {
        name: day,
        demandes: isCurrentDay ? (kpis.total_requests || 0) : Math.floor((kpis.total_requests || 10) * factor),
        livraisons: isCurrentDay ? (kpis.completed_requests || 0) : Math.floor((kpis.completed_requests || 8) * factor),
        revenue: isCurrentDay ? (kpis.total_revenue || 0) : Math.floor((kpis.total_revenue || 1000000) * factor),
      }
    })

    // Retourne les données brutes numériques (pas les labels traduits — ils varient avec la langue)
    return {
      areaData,
      rawPie: {
        pending: kpis.pending_requests || 0,
        in_progress: kpis.in_progress_requests || 0,
        completed: kpis.completed_requests || 0,
      },
    }
  }, { revalidateOnFocus: false })

  // Les labels traduits sont calculés réactivement, hors du cache SWR
  const pieData = swrResult.data ? [
    { name: t("moderator_requests.pending"), value: swrResult.data.rawPie.pending, color: "#f59e0b" },
    { name: t("in_progress"), value: swrResult.data.rawPie.in_progress, color: "#3b82f6" },
    { name: t("completed"), value: swrResult.data.rawPie.completed, color: "#10b981" },
  ] : []

  return {
    ...swrResult,
    data: swrResult.data ? { areaData: swrResult.data.areaData, pieData } : undefined,
  }
}
