"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Wallet,
  BarChart3,
  Settings,
  Shield,
  MapPin,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useLanguage } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

interface SidebarProps {
  role: "admin" | "moderator"
}

export function Sidebar({ role }: SidebarProps) {
  const { t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const adminLinks = [
    { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/admin/users", label: t("nav.users"), icon: Users },
    { href: "/admin/transporters", label: t("nav.transporters"), icon: Truck },
    { href: "/admin/requests", label: t("nav.requests"), icon: Package },
    { href: "/admin/tracking", label: t("nav.tracking"), icon: MapPin },
    { href: "/admin/wallets", label: t("nav.wallet"), icon: Wallet },
    { href: "/admin/finance", label: t("nav.finance"), icon: BarChart3 },
    { href: "/admin/reports", label: t("nav.reports"), icon: FileText },
    { href: "/admin/roles", label: t("nav.roles"), icon: Shield },
    { href: "/admin/settings", label: t("nav.settings"), icon: Settings },
  ]

  const moderatorLinks = [
    { href: "/moderator", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/moderator/requests", label: t("nav.requests"), icon: Package },
    { href: "/moderator/assignments", label: t("nav.assignments"), icon: Truck },
    { href: "/moderator/tracking", label: t("nav.tracking"), icon: MapPin },
    { href: "/moderator/users", label: t("nav.users"), icon: Users },
    { href: "/moderator/disputes", label: t("nav.disputes"), icon: Shield },
    { href: "/moderator/notifications", label: t("nav.notifications"), icon: Bell },
  ]

  const links = role === "admin" ? adminLinks : moderatorLinks

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      
      // Clear auth cookies used by middleware
      document.cookie = "django_token=; path=/; max-age=0"
      document.cookie = "user_role=; path=/; max-age=0"
      
      // Clear any legacy mock session leftovers
      if (typeof window !== "undefined") {
        localStorage.removeItem("mock_supabase_session")
      }
      
      // Use window.location for a full page reload to ensure proper redirect
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if error
      window.location.href = "/auth/login"
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            {!collapsed && (
              <Link href={`/${role}`} onClick={() => setMobileOpen(false)}>
                <Logo size="sm" showText={true} />
              </Link>
            )}
            {collapsed && (
              <Link href={`/${role}`} className="flex justify-center">
                <Logo size="sm" showText={false} />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <link.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span>{t("sidebar.collapse")}</span>
                </>
              )}
            </button>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 mt-1 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{isLoggingOut ? t("auth.logging_out") : t("nav.logout")}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
