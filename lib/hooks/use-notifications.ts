"use client"

import useSWR, { mutate } from "swr"
import { djangoApi } from "@/lib/api/django"

/**
 * Hook for fetching and managing user notifications
 */
export function useNotifications() {
  const { data, error, isLoading } = useSWR("user-notifications", async () => {
    const res = await djangoApi.getNotifications()
    if (res.error) throw new Error(res.error)
    return res.notifications || []
  }, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  })

  const unreadCount = data?.filter((n: any) => !n.is_read).length || 0

  const markAsRead = async (notifSlug: string) => {
    try {
      await djangoApi.markNotificationRead(notifSlug)
      mutate("user-notifications")
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await djangoApi.markAllNotificationsRead()
      mutate("user-notifications")
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  return {
    notifications: data || [],
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  }
}
