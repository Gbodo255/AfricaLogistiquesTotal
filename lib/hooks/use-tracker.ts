"use client"

import useSWR from "swr"
import { useState, useEffect, useCallback } from "react"
import aTrackerService, {
  type IOPGPSDevice,
  type IOPGPSPosition,
  type IOPGPSTrackPoint,
  type IOPGPSAlert,
} from "@/lib/services/a-tracker"

/**
 * Hook pour récupérer tous les dispositifs GPS
 */
export function useTrackerDevices() {
  return useSWR<IOPGPSDevice[]>("tracker-devices", () => aTrackerService.getDevices(), {
    refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
    revalidateOnFocus: true,
  })
}

/**
 * Hook pour récupérer un dispositif par IMEI
 */
export function useTrackerDevice(imei: string | undefined) {
  return useSWR<IOPGPSDevice | null>(
    imei ? `tracker-device-${imei}` : null,
    () => (imei ? aTrackerService.getDeviceByImei(imei) : null),
    {
      refreshInterval: 10000,
    }
  )
}

/**
 * Hook pour le suivi en temps réel d'une position
 */
export function useTrackerPosition(imei: string | undefined, refreshInterval: number = 5000) {
  const { data, error, isLoading, mutate } = useSWR<IOPGPSPosition | null>(
    imei ? `tracker-position-${imei}` : null,
    () => (imei ? aTrackerService.getLastPosition(imei) : null),
    {
      refreshInterval,
      revalidateOnFocus: true,
    }
  )

  return {
    position: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook pour toutes les positions en temps réel
 */
export function useAllTrackerPositions(refreshInterval: number = 10000) {
  return useSWR<{ imei: string; position: IOPGPSPosition }[]>(
    "tracker-all-positions",
    () => aTrackerService.getAllPositions(),
    {
      refreshInterval,
      revalidateOnFocus: true,
    }
  )
}

/**
 * Hook pour l'historique des trajets
 */
export function useTrackerHistory(
  imei: string | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  return useSWR<IOPGPSTrackPoint[]>(
    imei && startDate && endDate
      ? `tracker-history-${imei}-${startDate.toISOString()}-${endDate.toISOString()}`
      : null,
    () =>
      imei && startDate && endDate
        ? aTrackerService.getTrackHistory(imei, startDate, endDate)
        : [],
    {
      revalidateOnFocus: false,
    }
  )
}

/**
 * Hook pour les alertes
 */
export function useTrackerAlerts(imei?: string, limit: number = 50) {
  return useSWR<IOPGPSAlert[]>(
    `tracker-alerts-${imei || "all"}-${limit}`,
    () => aTrackerService.getAlerts(imei, limit),
    {
      refreshInterval: 30000,
    }
  )
}

/**
 * Hook pour le suivi en temps réel d'une livraison
 */
export function useDeliveryTracking(
  imei: string | undefined,
  destinationLat: number | undefined,
  destinationLng: number | undefined
) {
  const { position, error, isLoading } = useTrackerPosition(imei, 5000)
  const [eta, setEta] = useState<{ distance: number; estimatedMinutes: number } | null>(null)

  useEffect(() => {
    if (position && destinationLat && destinationLng) {
      const estimation = aTrackerService.estimateArrivalTime(
        position,
        destinationLat,
        destinationLng
      )
      setEta(estimation)
    }
  }, [position, destinationLat, destinationLng])

  return {
    position,
    eta,
    error,
    isLoading,
    isMoving: position ? position.speed > 0 : false,
    speed: position?.speed || 0,
    heading: position?.course || 0,
  }
}

/**
 * Hook pour envoyer des commandes au tracker
 */
export function useTrackerCommands(imei: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendCommand = useCallback(
    async (command: "engine_off" | "engine_on" | "lock" | "unlock" | "locate") => {
      setIsLoading(true)
      setError(null)

      try {
        const success = await aTrackerService.sendCommand(imei, command)
        if (!success) {
          throw new Error("Échec de l'envoi de la commande")
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [imei]
  )

  return {
    sendCommand,
    isLoading,
    error,
    engineOff: () => sendCommand("engine_off"),
    engineOn: () => sendCommand("engine_on"),
    lock: () => sendCommand("lock"),
    unlock: () => sendCommand("unlock"),
    locate: () => sendCommand("locate"),
  }
}

/**
 * Hook pour calculer les statistiques d'un trajet
 */
export function useTrackStats(track: IOPGPSTrackPoint[]) {
  return useSWR(
    track.length > 0 ? `track-stats-${track[0]?.timestamp}` : null,
    () => {
      if (track.length < 2) return null

      let totalDistance = 0
      let maxSpeed = 0
      let totalSpeed = 0

      for (let i = 1; i < track.length; i++) {
        const prev = track[i - 1]
        const curr = track[i]

        totalDistance += aTrackerService.calculateDistance(
          prev.lat,
          prev.lng,
          curr.lat,
          curr.lng
        )

        maxSpeed = Math.max(maxSpeed, curr.speed)
        totalSpeed += curr.speed
      }

      const startTime = new Date(track[0].timestamp).getTime()
      const endTime = new Date(track[track.length - 1].timestamp).getTime()
      const durationMinutes = (endTime - startTime) / 60000

      return {
        totalDistance: Math.round(totalDistance * 100) / 100, // km
        maxSpeed: Math.round(maxSpeed), // km/h
        avgSpeed: Math.round(totalSpeed / track.length), // km/h
        durationMinutes: Math.round(durationMinutes),
        pointCount: track.length,
      }
    },
    { revalidateOnFocus: false }
  )
}
