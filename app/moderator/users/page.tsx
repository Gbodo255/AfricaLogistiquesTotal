"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Users, Truck, Eye, Phone, Mail, MapPin, Star, Package, Wallet, Loader2, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useModeratorUsers } from "@/lib/hooks/use-moderator"
import { verifyTransporter } from "@/lib/hooks/use-admin"
import { mutate } from "swr"

export default function ModeratorUsersPage() {
  const { t } = useLanguage()
  const { data: allUsers, isLoading } = useModeratorUsers()

  const roleConfig: Record<string, { label: string; color: string }> = {
    client: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    transporter: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
    // Handle uppercase versions from API
    PME: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    PARTICULIER: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    AGRICULTEUR: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    TRANSPORTEUR: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
  }

  // Filter to only clients and transporters for moderator view
  const users = allUsers?.filter((u: any) =>
    ["PME", "PARTICULIER", "AGRICULTEUR", "TRANSPORTEUR", "client", "transporter"].includes(u.role)
  ) || []

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [validating, setValidating] = useState<string | null>(null)

  const filteredUsers = users.filter((u: any) => {
    const name = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      name.includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())

    const isClient = ["PME", "PARTICULIER", "AGRICULTEUR", "client"].includes(u.role)
    const isTransporter = ["TRANSPORTEUR", "transporter"].includes(u.role)
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "client" && isClient) ||
      (roleFilter === "transporter" && isTransporter)

    return matchesSearch && matchesRole
  })

  const handleVerify = async (userId: string) => {
    setValidating(userId)
    try {
      await verifyTransporter(userId)
      mutate("moderator-users")
    } catch (error) {
      console.error("Error verifying transporter:", error)
    }
    setValidating(null)
  }

  const totalClients = users.filter((u: any) =>
    ["PME", "PARTICULIER", "AGRICULTEUR", "client"].includes(u.role)
  ).length
  const totalTransporters = users.filter((u: any) =>
    ["TRANSPORTEUR", "transporter"].includes(u.role)
  ).length

  const getRoleLabel = (role: string) => {
    return roleConfig[role]?.label || role
  }

  const getRoleColor = (role: string) => {
    return roleConfig[role]?.color || "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("moderator_users.title")}</h1>
        <p className="text-muted-foreground">{t("moderator_users.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : users.length}</p>
                <p className="text-xs text-muted-foreground">{t("common.total")} {t("moderator_users.title").toLowerCase()}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : totalClients}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_users.clients")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : totalTransporters}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_users.transporters")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : filteredUsers.filter((u: any) => u.is_active).length}</p>
                <p className="text-xs text-muted-foreground">{t("admin_transporters.active_label")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-warning fill-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("moderator_users.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("moderator_users.role_label")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("requests.all")}</SelectItem>
                <SelectItem value="client">{t("moderator_users.clients")}</SelectItem>
                <SelectItem value="transporter">{t("moderator_users.transporters")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground">
            {isLoading ? "..." : filteredUsers.length} {filteredUsers.length === 1 ? t("moderator_users.utilisateur_singular") : t("moderator_users.utilisateur_plural")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t("admin_users.no_data")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("moderator_users.utilisateur")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("moderator_users.role_label")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("common.location")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin_transporters.status_label")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.firstname?.[0] || "?"}
                              {user.lastname?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.firstname} {user.lastname}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {(user as any).city || "-"}, {(user as any).country || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            user.is_active
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {user.is_active ? t("admin_transporters.active_label") : t("admin_transporters.inactive_label")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border bg-transparent"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t("moderator_users.view")}
                        </Button>
                        {user.role === "TRANSPORTEUR" && !user.is_verified && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-success hover:bg-success/90 text-success-foreground ml-2"
                            onClick={() => handleVerify(user.id)}
                            disabled={validating === user.id}
                          >
                            {validating === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                            {t("admin_users.verify_transporter")}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_users.user_profile")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedUser.firstname?.[0] || "?"}
                    {selectedUser.lastname?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </h3>
                  <Badge className={getRoleColor(selectedUser.role)}>{getRoleLabel(selectedUser.role)}</Badge>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedUser.email}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-success">
                    {((selectedUser.wallet as any)?.[0]?.balance || 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {t("admin_transporters.status_label")}: {selectedUser.is_active ? t("admin_transporters.active_label") : t("admin_transporters.inactive_label")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border bg-transparent"
                  onClick={() => window.location.href = `tel:${selectedUser.phone}`}
                  disabled={!selectedUser.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t("moderator_users.call")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border bg-transparent"
                  onClick={() => window.location.href = `mailto:${selectedUser.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t("common.email")}
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-transparent border-border">
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
