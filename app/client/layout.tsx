"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Wallet,
  MapPin,
  History,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Star,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { useLanguage } from "@/lib/i18n/context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { data: wallet } = useWallet(user?.id)
  const { unreadCount } = useNotifications()
  const { t } = useLanguage()

  const navigation = [
    { name: "Tableau de bord", href: "/client", icon: LayoutDashboard },
    { name: "Mes demandes", href: "/client/requests", icon: Package },
    { name: "Portefeuille", href: "/client/wallet", icon: Wallet },
    { name: "Suivi A-TRACKER", href: "/client/tracking", icon: MapPin },
    { name: "Historique", href: "/client/history", icon: History },
    { name: "Évaluations", href: "/client/ratings", icon: Star },
    { name: "Mon profil", href: "/client/profile", icon: User },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() || "CL"
  const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Client"
  const balance = wallet?.balance || 0

  const handleSignOut = async () => {
    try {
      await signOut()
      // Force clear cookies (middleware auth)
      document.cookie = "django_token=; path=/; max-age=0"
      document.cookie = "user_role=; path=/; max-age=0"
      // Use window.location for a full page reload to ensure proper redirect
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Sign out error:", error)
      // Force redirect even if error
      window.location.href = "/auth/login"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <Link href="/client">
              <Logo size="sm" showText={true} variant="dark" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{fullName}</p>
                <p className="text-xs text-muted-foreground truncate">Client</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Wallet summary */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="p-4 rounded-xl bg-sidebar-accent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{"Solde portefeuille"}</span>
                <Wallet className="h-4 w-4 text-sidebar-primary" />
              </div>
              <p className="text-xl font-bold text-sidebar-foreground">{balance.toLocaleString()} FCFA</p>
              <Link href="/client/wallet">
                <Button
                  size="sm"
                  className="w-full mt-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
                >
                  {"Recharger"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {"Déconnexion"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:flex-none">
            <div className="lg:hidden">
              <Logo size="sm" showText={true} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card border-border">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">{"Notifications"}</h3>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  <p className="text-sm text-muted-foreground text-center py-4">{t("moderator_notifications.no_notifications")}</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-foreground hover:bg-secondary">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {initials}
                  </div>
                  <span className="hidden sm:inline">{fullName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link href="/client/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {"Mon profil"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/client/wallet" className="cursor-pointer">
                    <Wallet className="h-4 w-4 mr-2" />
                    {"Portefeuille"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  {"Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
