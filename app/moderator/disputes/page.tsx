"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Filter,
  AlertTriangle,
  MessageSquare,
  Clock,
  CheckCircle,
  ChevronRight,
  Send,
  User,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import {
  useModeratorDisputes,
  useDisputeMessages,
  takeDispute,
  resolveDispute,
  sendDisputeMessage,
} from "@/lib/hooks/use-moderator"
import { mutate } from "swr"
import { useLanguage } from "@/lib/i18n/context"

export default function ModeratorDisputesPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const statusConfig = {
    open: { label: t("moderator_disputes.open"), color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
    investigating: { label: t("moderator_disputes.investigating"), color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
    resolved: { label: t("moderator_disputes.resolved"), color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    escalated: {
      label: t("moderator_disputes.escalated"),
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
    },
  }
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [resolution, setResolution] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { data: disputes, isLoading } = useModeratorDisputes(statusFilter)
  const { data: messages, mutate: mutateMessages } = useDisputeMessages(selectedDispute?.id)

  const filteredDisputes = disputes?.filter((dispute) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      dispute.id.toLowerCase().includes(search) ||
      dispute.category?.toLowerCase().includes(search) ||
      dispute.description?.toLowerCase().includes(search) ||
      dispute.opener?.first_name?.toLowerCase().includes(search)
    )
  })

  const handleTakeDispute = async (disputeId: string) => {
    if (!user?.id) return
    setLoading(true)
    try {
      await takeDispute(disputeId, user.id)
      mutate(["moderator-disputes", statusFilter])
    } catch (error) {
      console.error("Error taking dispute:", error)
    }
    setLoading(false)
  }

  const handleResolve = async () => {
    if (!selectedDispute || !resolution) return
    setLoading(true)
    try {
      await resolveDispute(selectedDispute.id, resolution)
      mutate(["moderator-disputes", statusFilter])
      setShowResolveDialog(false)
      setShowDisputeDialog(false)
      setResolution("")
    } catch (error) {
      console.error("Error resolving dispute:", error)
    }
    setLoading(false)
  }

  const handleSendMessage = async () => {
    if (!selectedDispute || !user?.id || !newMessage.trim()) return
    setLoading(true)
    try {
      await sendDisputeMessage(selectedDispute.id, user.id, newMessage)
      mutateMessages()
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
    setLoading(false)
  }

  const openDispute = (dispute: any) => {
    setSelectedDispute(dispute)
    setShowDisputeDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("moderator_disputes.title")}</h1>
        <p className="text-muted-foreground">{t("moderator_disputes.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes?.filter((d) => d.status === "open").length || 0}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_disputes.open")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes?.filter((d) => d.status === "investigating").length || 0}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_disputes.investigating")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes?.filter((d) => d.status === "resolved").length || 0}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_disputes.resolved")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {disputes?.filter((d) => d.assigned_moderator === user?.id).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_disputes.my_disputes")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("moderator_disputes.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("moderator_disputes.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("moderator_disputes.all_statuses")}</SelectItem>
                <SelectItem value="open">{t("moderator_disputes.open")}</SelectItem>
                <SelectItem value="investigating">{t("moderator_disputes.investigating")}</SelectItem>
                <SelectItem value="resolved">{t("moderator_disputes.resolved")}</SelectItem>
                <SelectItem value="escalated">{t("moderator_disputes.escalated")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Disputes list */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground">{filteredDisputes?.length || 0} {t("moderator.disputes").toLowerCase()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDisputes?.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">{t("moderator_disputes.no_disputes")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredDisputes?.map((dispute) => {
                const StatusIcon = statusConfig[dispute.status as keyof typeof statusConfig]?.icon || AlertTriangle
                return (
                  <div key={dispute.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`rounded-lg p-2 ${
                            dispute.status === "open"
                              ? "bg-destructive/10"
                              : dispute.status === "investigating"
                                ? "bg-warning/10"
                                : "bg-success/10"
                          }`}
                        >
                          <StatusIcon
                            className={`h-5 w-5 ${
                              dispute.status === "open"
                                ? "text-destructive"
                                : dispute.status === "investigating"
                                  ? "text-warning"
                                  : "text-success"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-primary">{dispute.id.slice(0, 8)}</span>
                            <Badge className={statusConfig[dispute.status as keyof typeof statusConfig]?.color}>
                              {statusConfig[dispute.status as keyof typeof statusConfig]?.label}
                            </Badge>
                          </div>
                          <p className="font-medium text-foreground mt-1">{dispute.category}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dispute.description}</p>

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {dispute.opener?.first_name?.[0]}
                                  {dispute.opener?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {dispute.opener?.first_name} {dispute.opener?.last_name}
                              </span>
                            </div>
                            {dispute.moderator && (
                              <>
                                <span className="text-xs text-muted-foreground">|</span>
                                <span className="text-xs text-muted-foreground">
                                  {t("moderator_disputes.assigned_to")}: {dispute.moderator.first_name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(dispute.created_at).toLocaleDateString("fr-FR")}
                        </span>
                        {dispute.status === "open" && !dispute.assigned_moderator && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                            onClick={() => handleTakeDispute(dispute.id)}
                            disabled={loading}
                          >
                            {t("moderator_disputes.take")}
                          </Button>
                        )}
                        {(dispute.status === "open" || dispute.status === "investigating") && (
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => openDispute(dispute)}
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {t("moderator_disputes.process")}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                        {dispute.status === "resolved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => openDispute(dispute)}
                          >
                            {t("moderator_disputes.view")} {t("moderator_disputes.details")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Detail Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              {t("moderator.disputes")} {selectedDispute?.id?.slice(0, 8)}
              {selectedDispute && (
                <Badge className={statusConfig[selectedDispute.status as keyof typeof statusConfig]?.color}>
                  {statusConfig[selectedDispute.status as keyof typeof statusConfig]?.label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Dispute info */}
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-foreground mb-2">{selectedDispute?.category}</h4>
              <p className="text-sm text-muted-foreground">{selectedDispute?.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>
                  {t("moderator_disputes.opened_by")}: {selectedDispute?.opener?.first_name} {selectedDispute?.opener?.last_name}
                </span>
                <span>|</span>
                <span>{new Date(selectedDispute?.created_at || "").toLocaleDateString("fr-FR")}</span>
              </div>
            </div>

            {/* Messages */}
            <div>
              <h4 className="font-medium text-foreground mb-2">{t("moderator_disputes.messages")}</h4>
              <ScrollArea className="h-48 rounded-lg border border-border p-3">
                {messages?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("moderator_disputes.no_messages")}</p>
                ) : (
                  <div className="space-y-3">
                    {messages?.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.sender_id === user?.id ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground">
                            {msg.sender?.first_name} {msg.sender?.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Send message */}
              {selectedDispute?.status !== "resolved" && (
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("moderator_disputes.message_placeholder")}
                    className="bg-background border-border"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-primary text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Resolution */}
            {selectedDispute?.status === "resolved" && selectedDispute?.resolution && (
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h4 className="font-medium text-success mb-2">{t("moderator_disputes.resolution")}</h4>
                <p className="text-sm text-foreground">{selectedDispute.resolution}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisputeDialog(false)}
              className="bg-transparent border-border"
            >
              {t("moderator_disputes.close")}
            </Button>
            {selectedDispute?.status !== "resolved" && (
              <Button
                onClick={() => setShowResolveDialog(true)}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("moderator_disputes.resolve")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_disputes.resolve_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_disputes.resolution")} *</Label>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder={t("moderator_disputes.resolve_placeholder")}
                className="bg-background border-border min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveDialog(false)}
              className="bg-transparent border-border"
            >
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={handleResolve}
              disabled={loading || !resolution}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {loading ? t("moderator_disputes.resolving") : t("moderator_disputes.confirm_resolution")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
