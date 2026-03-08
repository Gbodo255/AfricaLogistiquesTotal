"use client"

import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

async function fetchWallet() {
  const res = await djangoApi.getMyWallet()
  if (res.error) throw new Error(res.error)
  return res.wallet
}

async function fetchTransactions() {
  const res = await djangoApi.getMyWalletTransactions()
  if (res.error) throw new Error(res.error)
  return res.transactions || []
}

export function useWallet(userId: string | undefined) {
  // userId is kept only to keep existing call sites stable
  return useSWR(userId ? ["wallet", userId] : null, () => fetchWallet(), {
    refreshInterval: 30000,
  })
}

export function useTransactions(walletId: string | undefined) {
  // walletId is kept only to keep existing call sites stable
  return useSWR(walletId ? ["transactions", walletId] : null, () => fetchTransactions(), {
    refreshInterval: 30000,
  })
}

export async function topupWallet(amount: number, description?: string, reference?: string) {
  const res = await djangoApi.topupWallet({ amount, description, reference })
  if (res.error) throw new Error(res.error)
  return res.wallet
}
