"use client"

import useSWR from "swr"

/**
 * use-disputes.ts
 * La gestion des litiges n'est pas encore implémentée côté backend Django.
 * Ce hook retourne une liste vide en attendant l'implémentation.
 * 
 * ⚠️ Le fichier précédent utilisait Supabase (système d'auth abandonné) — supprimé.
 */

export function useDisputes(status?: string) {
  return useSWR(["disputes", status], async () => {
    // Non implémenté côté backend Django → liste vide
    return [] as any[]
  })
}

export async function createDispute(data: any) {
  throw new Error("La gestion des litiges n'est pas encore disponible.")
}

export async function resolveDispute(id: string, resolution: string, resolverId: string) {
  throw new Error("La gestion des litiges n'est pas encore disponible.")
}
