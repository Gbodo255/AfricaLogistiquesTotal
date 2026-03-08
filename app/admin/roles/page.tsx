"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Wallet,
  Package,
  Truck,
  MapPin,
  FileText,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function AdminRolesPage() {
  const { t } = useLanguage()
  const [showDialog, setShowDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(null)

  const roles = [
    {
      id: "1",
      name: t("admin_roles.admin"),
      description: t("admin_roles.full_access"),
      users: 2,
      color: "bg-destructive/10 text-destructive border-destructive/20",
      permissions: ["all"],
    },
    {
      id: "2",
      name: t("admin_roles.moderator"),
      description: t("moderator.manage"),
      users: 5,
      color: "bg-warning/10 text-warning border-warning/20",
      permissions: ["requests", "disputes", "users_read", "tracking"],
    },
    {
      id: "3",
      name: t("admin_roles.transporter"),
      description: t("transporter_profile.subtitle"),
      users: 45,
      color: "bg-accent/10 text-accent border-accent/20",
      permissions: ["missions", "wallet", "profile"],
    },
    {
      id: "4",
      name: t("admin_roles.client"),
      description: t("requests.manage"),
      users: 120,
      color: "bg-primary/10 text-primary border-primary/20",
      permissions: ["requests_create", "tracking", "wallet", "profile"],
    },
  ]

  const allPermissions = [
    { id: "users", label: t("permission.users"), icon: Users },
    { id: "users_read", label: t("permission.users_read"), icon: Users },
    { id: "requests", label: t("permission.requests"), icon: Package },
    { id: "requests_create", label: t("permission.requests_create"), icon: Package },
    { id: "transporters", label: t("permission.transporters"), icon: Truck },
    { id: "tracking", label: t("permission.tracking"), icon: MapPin },
    { id: "wallet", label: t("permission.wallet"), icon: Wallet },
    { id: "reports", label: t("permission.reports"), icon: FileText },
    { id: "settings", label: t("permission.settings"), icon: Settings },
    { id: "profile", label: t("permission.profile"), icon: Users },
    { id: "disputes", label: t("permission.disputes"), icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_roles.title")}</h1>
          <p className="text-muted-foreground">{t("admin_roles.subtitle")}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" />
          {t("admin_roles.new_role")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{roles.length}</p>
                <p className="text-xs text-muted-foreground">{t("admin_roles.defined_roles")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{allPermissions.length}</p>
                <p className="text-xs text-muted-foreground">{t("admin_roles.permissions")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{roles.reduce((acc, r) => acc + r.users, 0)}</p>
                <p className="text-xs text-muted-foreground">{t("admin_roles.total_users")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">{t("admin_roles.active_admins")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">{t("admin_roles.existing_roles")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{role.name}</h3>
                          <Badge className={role.color}>{role.users} {t("admin_roles.users_label")}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setSelectedRole(role)
                          setShowDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.name !== t("admin_roles.admin") && role.name !== t("admin_roles.client") && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.includes("all") ? (
                      <Badge variant="outline" className="border-success/50 text-success text-xs">
                        {t("admin_roles.full_access")}
                      </Badge>
                    ) : (
                      role.permissions.slice(0, 4).map((perm) => {
                        const permLabel = allPermissions.find((p) => p.id === perm)?.label || perm
                        return (
                          <Badge key={perm} variant="outline" className="border-border text-xs">
                            {permLabel}
                          </Badge>
                        )
                      })
                    )}
                    {role.permissions.length > 4 && !role.permissions.includes("all") && (
                      <Badge variant="outline" className="border-border text-xs">
                        +{role.permissions.length - 4} {t("admin_roles.other_permissions")}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_roles.available_permissions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allPermissions.map((perm) => (
              <div key={perm.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <perm.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{perm.label}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("admin_roles.role_details")}</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedRole.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground">{t("admin_roles.permissions")}</Label>
                <div className="space-y-2">
                  {allPermissions.map((perm) => (
                    <div key={perm.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        checked={selectedRole.permissions.includes("all") || selectedRole.permissions.includes(perm.id)}
                        disabled
                      />
                      <perm.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{perm.label}</span>
                    </div>
                  ))}
                </div>
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
