"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  TrendingUp,
  Package,
  MapPin,
  ArrowRight,
  Eye,
  Check,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import {
  useModeratorStats,
  usePendingRequests,
  useModeratorDisputes,
  useAvailableTransporters,
} from "@/lib/hooks/use-moderator"
import { useLanguage } from "@/lib/i18n/context"

export default function ModeratorDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: stats, isLoading: statsLoading } = useModeratorStats(user?.id)
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests()
  const { data: disputes } = useModeratorDisputes("open")
  const { data: transporters } = useAvailableTransporters()

  const firstName = user?.firstname || user?.profile?.first_name || t("admin_roles.moderator")

  const kpis = [
    {
      title: t("moderator.pending"),
      value: stats?.pending_requests?.toString() || "0",
      subtitle: t("moderator.my_requests"),
      icon: Clock,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: t("moderator.processed_today"),
      value: stats?.validated_today?.toString() || "0",
      icon: CheckCircle,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: t("moderator.missions_in_progress"),
      value: stats?.in_progress?.toString() || "0",
      icon: Truck,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: t("moderator.open_disputes"),
      value: stats?.open_disputes?.toString() || "0",
      subtitle: `${stats?.my_disputes || 0} ${t("moderator.assigned")}`,
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ]

  const recentPending = pendingRequests?.slice(0, 4) || []
  const recentDisputes = disputes?.slice(0, 3) || []
  const availableTransporters = transporters?.filter((t) => t.vehicles?.some((v) => v.is_available)).slice(0, 4) || []

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("moderator.hello")}, {firstName}</h1>
          <p className="text-muted-foreground">{t("moderator.manage")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/moderator/requests">
            <Button variant="outline" className="gap-2 border-border bg-transparent">
              <Package className="h-4 w-4" />
              {t("moderator.requests")}
            </Button>
          </Link>
          <Link href="/moderator/disputes">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <AlertTriangle className="h-4 w-4" />
              {t("moderator.disputes")}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
                {index === 1 && <TrendingUp className="h-4 w-4 text-success" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{statsLoading ? "..." : kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending requests */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-foreground">{t("moderator.pending_requests_title")}</CardTitle>
                <p className="text-sm text-muted-foreground">{pendingRequests?.length || 0} {t("moderator.requests_to_process")}</p>
              </div>
              <Link href="/moderator/requests">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                  {t("common.see_all")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {requestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recentPending.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("moderator.all_processed")}</p>
                </div>
              ) : (
                recentPending.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{request.id.slice(0, 8)}</span>
                            <Badge variant="outline" className="text-xs border-border">
                              {request.transport_type}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {request.client?.first_name} {request.client?.last_name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {request.pickup_city} → {request.delivery_city}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {request.estimated_price?.toLocaleString() || t("moderator_requests.to_estimate")} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString("fr-FR")}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="h-7 px-2 bg-success hover:bg-success/90 text-success-foreground">
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Open disputes */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-foreground text-base">{t("moderator_disputes.open")} {t("moderator.disputes")}</CardTitle>
              <Link href="/moderator/disputes">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  {t("common.see_all")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDisputes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("moderator_disputes.no_disputes")}</p>
              ) : (
                recentDisputes.map((dispute) => (
                  <div key={dispute.id} className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-sm text-foreground">{dispute.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{dispute.description}</p>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                        {dispute.status === "open" ? t("moderator_disputes.open") : t("in_progress")}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Available transporters */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-foreground text-base">{t("moderator.available_transporters")}</CardTitle>
              <Badge className="bg-success/10 text-success border-success/20">{availableTransporters.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTransporters.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("moderator_assignments.no_transporters")}</p>
              ) : (
                availableTransporters.map((transporter) => (
                  <div
                    key={transporter.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {transporter.first_name?.[0]}
                          {transporter.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {transporter.first_name} {transporter.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{transporter.vehicles?.length || 0} {transporter.vehicles?.length !== 1 ? t("fleet.vehicles") : t("fleet.vehicle_singular")}</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">{t("status.available")}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
