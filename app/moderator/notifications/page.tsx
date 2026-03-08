"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  Send,
  Users,
  Truck,
  CheckCircle,
  AlertTriangle,
  Package,
  Clock,
  MessageSquare,
  Plus,
} from "lucide-react"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { useLanguage } from "@/lib/i18n/context"

export default function ModeratorNotificationsPage() {
  const { t } = useLanguage()
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()

  const typeConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    request: { icon: Package, color: "text-primary", bgColor: "bg-primary/10" },
    dispute: { icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
    mission: { icon: Truck, color: "text-success", bgColor: "bg-success/10" },
    user: { icon: Users, color: "text-accent", bgColor: "bg-accent/10" },
    NEW_TRANSPORTEUR: { icon: Users, color: "text-accent", bgColor: "bg-accent/10" },
    SYSTEM: { icon: Bell, color: "text-warning", bgColor: "bg-warning/10" },
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [messageTarget, setMessageTarget] = useState("")
  const [messageContent, setMessageContent] = useState("")

  const filteredNotifications = notifications.filter(
    (n: any) =>
      !searchQuery ||
      (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.message || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${t("common.ago")} ${days} ${t("common.day")}${days > 1 ? "s" : ""}`
    if (hours > 0) return `${t("common.ago")} ${hours}h`
    if (minutes > 0) return `${t("common.ago")} ${minutes}m`
    return t("common.just_now")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("moderator_notifications.title")}</h1>
          <p className="text-muted-foreground">{t("moderator_notifications.subtitle")}</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={() => setShowSendDialog(true)}
        >
          <Plus className="h-4 w-4" />
          {t("moderator_notifications.send")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_notifications.unread")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                <p className="text-xs text-muted-foreground">{t("common.total")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter((n: any) => n.type === "sent").length}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_notifications.sent")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Send className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter((n: any) => n.type === "SYSTEM" || n.type === "dispute").length}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_notifications.system_alerts")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t("moderator_notifications.all")}
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t("moderator_notifications.unread")} ({unreadCount})
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t("moderator_notifications.sent")}
            </TabsTrigger>
          </TabsList>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("moderator_notifications.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">{t("moderator_notifications.all_notifications")}</CardTitle>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {t("moderator_notifications.mark_all_read")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredNotifications.map((notif: any) => {
                  const config = typeConfig[notif.type || notif.notification_type] || typeConfig.SYSTEM
                  const Icon = config.icon
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-muted/30 transition-colors ${!notif.is_read ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">{notif.title}</h4>
                                {!notif.is_read && (
                                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                    {t("moderator_notifications.new")}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notif.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">{t("moderator_notifications.unread")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredNotifications
                  .filter((n: any) => !n.is_read)
                  .map((notif: any) => {
                    const config = typeConfig[notif.type || notif.notification_type] || typeConfig.SYSTEM
                    const Icon = config.icon
                    return (
                      <div key={notif.id} className="p-4 hover:bg-muted/30 transition-colors bg-primary/5">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{notif.title}</h4>
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{t("moderator_notifications.new")}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notif.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                {filteredNotifications.filter((n) => !n.read).length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                    <p className="text-muted-foreground">{t("moderator_notifications.all_read")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="mt-0">
          <Card className="border-border bg-card">
            <CardContent className="py-12">
              <div className="text-center">
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t("moderator_notifications.no_recent_messages")}</p>
                <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setShowSendDialog(true)}
                >
                  {t("moderator_notifications.send")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_notifications.send")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_notifications.target")}</Label>
              <Select value={messageTarget} onValueChange={setMessageTarget}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t("moderator_notifications.select_target")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_clients">{t("moderator_notifications.all_clients")}</SelectItem>
                  <SelectItem value="all_transporters">{t("moderator_notifications.all_transporters")}</SelectItem>
                  <SelectItem value="all">{t("moderator_notifications.all_users")}</SelectItem>
                  <SelectItem value="specific">{t("moderator_notifications.specific_user")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_notifications.message")}</Label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder={t("moderator_notifications.message_placeholder")}
                className="bg-background border-border min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)} className="bg-transparent border-border">
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={() => {
                setShowSendDialog(false)
                setMessageTarget("")
                setMessageContent("")
              }}
              disabled={!messageTarget || !messageContent}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {t("moderator_notifications.send_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
