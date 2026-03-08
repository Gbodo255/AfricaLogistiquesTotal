"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { useNotifications } from "@/lib/hooks/use-notifications"

interface HeaderProps {
  title: string
  role: "admin" | "moderator"
}

export function Header({ title, role }: HeaderProps) {
  const { t } = useLanguage()
  const { user, signOut } = useAuth()
  const { notifications, unreadCount, markAsRead } = useNotifications()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 pl-16 lg:pl-6 lg:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg lg:text-xl font-semibold text-foreground">{title}</h1>
        <Badge
          variant="outline"
          className={`hidden sm:inline-flex ${role === "admin" ? "border-primary text-primary" : "border-accent text-accent"}`}
        >
          {role === "admin" ? t("features.for_admins") : t("features.for_moderators")}
        </Badge>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Search - Hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t("nav.dashboard")}...`}
            className="w-48 lg:w-64 bg-muted border-0 pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
        </div>

        <LanguageToggle />
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground animate-in zoom-in">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border-border max-h-[400px] overflow-y-auto">
            <DropdownMenuLabel className="text-foreground">{t("nav.notifications")}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                {t("moderator_notifications.no_data")}
              </div>
            ) : (
              notifications.map((notif: any) => (
                <DropdownMenuItem
                  key={notif.id}
                  className={`text-muted-foreground hover:text-foreground focus:text-foreground cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}
                  onClick={() => !notif.is_read && markAsRead(notif.slug)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`font-medium ${!notif.is_read ? 'text-primary' : 'text-foreground'}`}>
                        {notif.title || "Notification"}
                      </span>
                      {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />}
                    </div>
                    <span className="text-xs line-clamp-2">{notif.message}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline-block text-sm font-medium text-foreground">
                {user?.firstname} {user?.lastname}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuLabel className="text-foreground">{t("nav.profile")}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
              <User className="mr-2 h-4 w-4" />
              {t("nav.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
              {t("nav.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => signOut()}
            >
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
