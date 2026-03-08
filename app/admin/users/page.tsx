"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Eye, Ban, CheckCircle, UserCheck, Wallet, Users, Truck, Download } from "lucide-react"
import { useAdminUsers, suspendUser, activateUser, verifyTransporter } from "@/lib/hooks/use-admin"
import { mutate } from "swr"
import { useLanguage } from "@/lib/i18n/context"

export default function AdminUsersPage() {
  const { t } = useLanguage()
  const [roleFilter, setRoleFilter] = useState("all")

  const roleConfig: Record<string, { label: string; color: string }> = {
    client: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    CLIENT: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    PARTICULIER: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    PME: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    AGRICULTEUR: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    transporter: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
    TRANSPORTEUR: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
    moderator: { label: t("admin_roles.moderator"), color: "bg-warning/10 text-warning border-warning/20" },
    MODERATEUR: { label: t("admin_roles.moderator"), color: "bg-warning/10 text-warning border-warning/20" },
    MODERATOR: { label: t("admin_roles.moderator"), color: "bg-warning/10 text-warning border-warning/20" },
    admin: { label: t("admin_roles.admin"), color: "bg-destructive/10 text-destructive border-destructive/20" },
    ADMIN: { label: t("admin_roles.admin"), color: "bg-destructive/10 text-destructive border-destructive/20" },
    "DATA ADMIN": { label: t("admin_roles.admin"), color: "bg-destructive/10 text-destructive border-destructive/20" },
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: users, isLoading } = useAdminUsers(roleFilter)

  const handleExport = async () => {
    try {
      const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api/africa_logistic'
      const token = sessionStorage.getItem('django_token')

      const response = await fetch(`${DJANGO_API_URL}/reports/admin/users.csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Export error')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Erreur lors de l\'export des utilisateurs.')
    }
  }

  const filteredUsers = users?.filter((user) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      user.firstname?.toLowerCase().includes(search) ||
      user.lastname?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    )
  })

  const handleSuspend = async (userId: string) => {
    setLoading(true)
    try {
      await suspendUser(userId)
      mutate(["admin-users", roleFilter])
    } catch (error) {
      console.error("Error suspending user:", error)
    }
    setLoading(false)
  }

  const handleActivate = async (userId: string) => {
    setLoading(true)
    try {
      await activateUser(userId)
      mutate(["admin-users", roleFilter])
    } catch (error) {
      console.error("Error activating user:", error)
    }
    setLoading(false)
  }

  const handleVerify = async (userId: string) => {
    setLoading(true)
    try {
      await verifyTransporter(userId)
      mutate(["admin-users", roleFilter])
    } catch (error) {
      console.error("Error verifying user:", error)
    }
    setLoading(false)
  }

  // Stats (Mise à jour pour correspondre aux rôles réels de la DB)
  const clientRoles = ["client", "CLIENT", "PARTICULIER", "PME", "AGRICULTEUR"]
  const totalClients = users?.filter((u: any) => clientRoles.includes(u.role?.toUpperCase()) || clientRoles.includes(u.role?.toLowerCase())).length || 0
  const totalTransporters = users?.filter((u: any) => u.role?.toUpperCase() === "TRANSPORTEUR").length || 0
  const pendingVerification = users?.filter((u: any) => u.role?.toUpperCase() === "TRANSPORTEUR" && !u.is_verified).length || 0
  const suspendedUsers = users?.filter((u: any) => !u.is_active).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_users.title")}</h1>
          <p className="text-muted-foreground">{t("admin_users.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground"
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("admin_finance.export")} CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{totalClients}</p>
                <p className="text-xs text-muted-foreground">{t("admin_users.clients")}</p>
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
                <p className="text-2xl font-bold text-foreground">{totalTransporters}</p>
                <p className="text-xs text-muted-foreground">{t("admin_users.transporters")}</p>
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
                <p className="text-2xl font-bold text-foreground">{pendingVerification}</p>
                <p className="text-xs text-muted-foreground">{t("admin_users.pending_verification")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{suspendedUsers}</p>
                <p className="text-xs text-muted-foreground">{t("admin_users.suspended")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Ban className="h-5 w-5 text-destructive" />
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
                placeholder={t("admin_users.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("admin_users.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin_users.all_roles")}</SelectItem>
                <SelectItem value="client">{t("admin_users.clients")}</SelectItem>
                <SelectItem value="transporter">{t("admin_users.transporters")}</SelectItem>
                <SelectItem value="moderator">{t("admin_roles.moderator")}</SelectItem>
                <SelectItem value="admin">{t("admin_roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground">
            {filteredUsers?.length || 0} {
              roleFilter === "all" ? t("admin_users.title") :
                roleFilter === "transporter" ? t("admin_transporters.transporter_plural") :
                  roleFilter === "client" ? t("admin_users.clients") :
                    roleFilter === "moderator" ? t("admin_roles.moderator") :
                      t("admin_users.user_column")
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers?.length === 0 ? (
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
                      {t("admin_users.user_column")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin_users.role")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin.page.portefeuille")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin_users.status")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin_users.registered")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("admin_users.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers?.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.firstname?.[0]}
                              {user.lastname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.firstname} {user.lastname}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={roleConfig[user.role]?.color || "bg-muted"}>
                          {roleConfig[user.role]?.label || user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {((user.wallet as any)?.[0]?.balance || 0).toLocaleString()} FCFA
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={
                              user.is_active
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }
                          >
                            {user.is_active ? t("admin_users.active") : t("admin_users.suspended")}
                          </Badge>
                          {user.role === "transporter" && !user.is_verified && (
                            <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">{t("admin_users.not_verified")}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem
                              className="text-muted-foreground hover:text-foreground focus:text-foreground"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUserDialog(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("admin_users.view_profile")}
                            </DropdownMenuItem>
                            {user.role === "transporter" && !user.is_verified && (
                              <DropdownMenuItem
                                className="text-success focus:text-success"
                                onClick={() => handleVerify(user.slug)}
                                disabled={loading}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                {t("admin_users.verify_transporter")}
                              </DropdownMenuItem>
                            )}
                            {user.is_active ? (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleSuspend(user.id)}
                                disabled={loading}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {t("admin_users.suspend")}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-success focus:text-success"
                                onClick={() => handleActivate(user.id)}
                                disabled={loading}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t("admin_users.activate")}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("admin_users.user_profile")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedUser.firstname?.[0]}
                    {selectedUser.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </h3>
                  <Badge className={roleConfig[selectedUser.role]?.color}>{roleConfig[selectedUser.role]?.label}</Badge>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm text-foreground">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Téléphone</span>
                  <span className="text-sm text-foreground">{selectedUser.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ville</span>
                  <span className="text-sm text-foreground">{selectedUser.city || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pays</span>
                  <span className="text-sm text-foreground">{selectedUser.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Portefeuille</span>
                  <span className="text-sm font-semibold text-success">
                    {((selectedUser.wallet as any)?.[0]?.balance || 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inscrit le</span>
                  <span className="text-sm text-foreground">
                    {new Date(selectedUser.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)} className="bg-transparent border-border">
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
