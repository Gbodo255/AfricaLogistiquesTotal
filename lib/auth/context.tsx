"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { djangoApi } from "@/lib/api/django"

interface AuthUser {
  id: string
  slug: string
  email: string
  firstname: string
  lastname: string
  role: string
  is_verified: boolean
  is_active: boolean
  is_approved?: boolean
  telephone?: string
  address?: string
  profile?: any
  wallet?: any
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async () => {
    try {
      const token = djangoApi.getToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await djangoApi.getCurrentUser()
      
      if (response.error) {
        // Token invalide ou expiré
        djangoApi.setToken(null)
        setUser(null)
        setLoading(false)
        return
      }

      if (response.user) {
        setUser(response.user as AuthUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      djangoApi.setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    await fetchUserData()
  }

  useEffect(() => {
    fetchUserData()

    // Vérifier périodiquement si le token est toujours valide
    const interval = setInterval(() => {
      const token = djangoApi.getToken()
      if (token && !user) {
        fetchUserData()
      }
    }, 30000) // Vérifier toutes les 30 secondes

    return () => clearInterval(interval)
  }, [])

  const signOut = async () => {
    try {
      // Appeler logout de l'API si possible
      try {
        await djangoApi.logout()
      } catch (e) {
        console.error("Logout API error:", e)
      }

      djangoApi.setToken(null)
      setUser(null)
      
      // Supprimer les cookies pour le middleware
      if (typeof document !== "undefined") {
        document.cookie = "django_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
      
      // Rediriger vers la page de connexion
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    } catch (error) {
      console.error("Sign out error:", error)
      // Forcer la déconnexion même en cas d'erreur
      djangoApi.setToken(null)
      setUser(null)
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
