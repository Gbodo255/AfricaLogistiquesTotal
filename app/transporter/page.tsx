"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  Wallet,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Package,
  Navigation,
  Phone,
  AlertCircle,
  Star,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useActiveMissions, useCompletedMissions, useTransporterEarnings } from "@/lib/hooks/use-missions"
import { useVehicles } from "@/lib/hooks/use-vehicles"
import { useLanguage } from "@/lib/i18n/context"

export default function TransporterDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    assigned: { label: "Assigné", color: "bg-secondary text-secondary-foreground" },
    picked_up: { label: "Enlevé", color: "bg-warning/20 text-warning" },
    in_transit: { label: "En transit", color: "bg-primary/20 text-primary" },
    delivered: { label: "Livré", color: "bg-success/20 text-success" },
  }
  const { data: activeMissions, isLoading: missionsLoading } = useActiveMissions(user?.id)
  const { data: completedMissions } = useCompletedMissions(user?.id)
  const { data: earnings } = useTransporterEarnings(user?.id)
  const { data: vehicles } = useVehicles(user?.id)

  const firstName = user?.firstname || t("transporter.default_name")
  const companyName = (user as any)?.company_name

  const activeVehicles = vehicles?.filter((v: any) => v.status === "active").length || 0
  const recentMissions = activeMissions?.slice(0, 2) || []

  const stats = [
    {
      label: t("transporter.active_missions"),
      value: (activeMissions?.length || 0).toString(),
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: t("transporter.monthly_earnings"),
      value: `${(earnings?.monthlyEarnings || 0).toLocaleString()} FCFA`,
      icon: Wallet,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: t("transporter.completed_missions"),
      value: (earnings?.completedCount || 0).toString(),
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: t("transporter.active_vehicles"),
      value: activeVehicles.toString(),
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("transporter.welcome")}, {firstName}
            {companyName && <span className="text-muted-foreground font-normal text-lg ml-2">({companyName})</span>}
          </h1>
          <p className="text-muted-foreground">{t("transporter.overview")}</p>
        </div>
        <Link href="/transporter/missions">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Navigation className="h-4 w-4" />
            {t("transporter.view_missions")}
          </Button>
        </Link>
      </div>

      {/* Alert for no vehicles */}
      {vehicles && vehicles.length === 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{t("transporter.no_vehicles")}</p>
              <p className="text-xs text-muted-foreground">{t("transporter.no_vehicles_desc")}</p>
            </div>
            <Link href="/transporter/fleet">
              <Button
                size="sm"
                variant="outline"
                className="border-warning text-warning hover:bg-warning/10 bg-transparent"
              >
                {t("transporter.add_vehicle")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active missions */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-foreground">{t("transporter.active_missions")}</CardTitle>
              <Link href="/transporter/missions">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                  {"Voir tout"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {missionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recentMissions.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("missions.no_active")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("transporter.no_vehicles_desc")}
                  </p>
                </div>
              ) : (
                recentMissions.map((mission: any) => (
                  <div
                    key={mission.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {mission.reference_number || mission.id.slice(0, 8)}
                          </span>
                          <Badge className={statusConfig[mission.status]?.color || statusConfig.assigned.color}>
                            {statusConfig[mission.status]?.label || mission.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {mission.pickup_address} → {mission.delivery_address}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success">
                          {Math.round((mission.estimated_cost || 0) * 0.85).toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">Net</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{mission.cargo_type || t("requests.transport_type.general")}</span>
                        <span className="text-foreground">• {mission.weight || 0} kg</span>
                      </div>
                      {mission.client && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t("moderator_requests.client")}:</span>
                          <span className="text-foreground">
                            {mission.client.first_name} {mission.client.last_name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {mission.client?.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-border text-foreground bg-transparent"
                        >
                          <Phone className="h-3 w-3" />
                          {t("moderator_users.call")}
                        </Button>
                      )}
                      <Link href="/transporter/missions" className="flex-1">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          {t("transporter.manage_mission")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions & Earnings */}
        <div className="space-y-6">
          {/* Earnings summary */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="h-5 w-5 text-success" />
                {t("earnings.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-success/10">
                  <p className="text-sm text-muted-foreground mb-1">{t("earnings.total_earnings")}</p>
                  <p className="text-3xl font-bold text-success">
                    {(earnings?.totalEarnings || 0).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("transporter_wallet.this_month")}</span>
                  <span className="text-foreground font-medium">
                    {(earnings?.monthlyEarnings || 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("transporter.missions_completed")}</span>
                  <span className="text-foreground font-medium">{earnings?.completedCount || 0}</span>
                </div>
              </div>
              <Link href="/transporter/earnings">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  {t("transporter.view_details")}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">{t("transporter.quick_actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/transporter/missions" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Truck className="h-4 w-4 text-primary" />
                  {t("transporter.view_missions")}
                </Button>
              </Link>
              <Link href="/transporter/fleet" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Truck className="h-4 w-4 text-success" />
                  {t("fleet.manage_fleet")}
                </Button>
              </Link>
              <Link href="/transporter/earnings" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Wallet className="h-4 w-4 text-warning" />
                  {t("earnings.view_details")}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent completed */}
          {completedMissions && completedMissions.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm">{t("transporter.recent_deliveries")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedMissions.slice(0, 3).map((mission: any) => (
                  <div key={mission.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm text-foreground truncate max-w-[150px]">
                        {mission.pickup_address} → {mission.delivery_address}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < 4 ? "text-warning fill-warning" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
