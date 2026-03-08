"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Calendar, CheckCircle2, Truck, ArrowDownLeft } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useCompletedMissions, useTransporterEarnings } from "@/lib/hooks/use-missions"
import { useLanguage } from "@/lib/i18n/context"

export default function EarningsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: earnings, isLoading: earningsLoading } = useTransporterEarnings(user?.id)
  const { data: completedMissions, isLoading: missionsLoading } = useCompletedMissions(user?.id)

  // Group missions by month
  const missionsByMonth =
    completedMissions?.reduce(
      (acc, mission) => {
        const date = new Date(mission.delivered_at || mission.updated_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (!acc[monthKey]) {
          acc[monthKey] = []
        }
        acc[monthKey].push(mission)
        return acc
      },
      {} as Record<string, typeof completedMissions>,
    ) || {}

  const monthNames = t("common.months") ? t("common.months").split(",") : [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ]

  const formatMonthKey = (key: string) => {
    const [year, month] = key.split("-")
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  const PLATFORM_COMMISSION = 0.15

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("earnings.title")}</h1>
        <p className="text-muted-foreground">{t("earnings.subtitle")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("earnings.total_earnings")}</p>
                <p className="text-4xl font-bold text-success">
                  {earningsLoading ? "..." : `${(earnings?.totalEarnings || 0).toLocaleString()} FCFA`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{t("earnings.platform_commission")}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center">
                <Wallet className="h-7 w-7 text-success" />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("transporter_wallet.this_month")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {(earnings?.monthlyEarnings || 0).toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("transporter.completed_missions")}</p>
                <p className="text-2xl font-bold text-foreground">{earnings?.completedCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{t("earnings.performance")}</p>
              <Badge variant="outline" className="border-success text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                {t("earnings.good")}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">Taux de réussite</span>
                </div>
                <span className="font-semibold text-foreground">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("transporter.total_missions")}</span>
                </div>
                <span className="font-semibold text-foreground">{earnings?.completedCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings history */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("transporter_wallet.recent_transactions")}</CardTitle>
          <CardDescription className="text-muted-foreground">{t("transporter_earnings.history_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("requests.all")}
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("earnings.by_month")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-0">
              {missionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : !completedMissions || completedMissions.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("missions.no_completed")}</p>
                </div>
              ) : (
                completedMissions.map((mission) => {
                  const grossAmount = mission.final_cost || mission.estimated_cost || 0
                  const netAmount = Math.round(grossAmount * (1 - PLATFORM_COMMISSION))
                  const commission = grossAmount - netAmount

                  return (
                    <div
                      key={mission.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                          <ArrowDownLeft className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {mission.reference_number || `MIS-${mission.id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mission.pickup_address} → {mission.delivery_address}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(mission.delivered_at || mission.updated_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success">+{netAmount.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">-{commission.toLocaleString()} {t("earnings.commission_label")}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </TabsContent>

            <TabsContent value="month" className="space-y-6 mt-0">
              {Object.entries(missionsByMonth)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([monthKey, missions]) => {
                  const monthTotal = missions.reduce((sum, m) => {
                    const amount = m.final_cost || m.estimated_cost || 0
                    return sum + Math.round(amount * (1 - PLATFORM_COMMISSION))
                  }, 0)

                  return (
                    <div key={monthKey}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatMonthKey(monthKey)}
                        </h3>
                        <Badge variant="outline" className="border-success text-success">
                          +{monthTotal.toLocaleString()} FCFA
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {missions.map((mission) => {
                          const netAmount = Math.round(
                            (mission.final_cost || mission.estimated_cost || 0) * (1 - PLATFORM_COMMISSION),
                          )

                          return (
                            <div
                              key={mission.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-success" />
                                <span className="text-sm text-foreground">
                                  {mission.pickup_address} → {mission.delivery_address}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-success">
                                +{netAmount.toLocaleString()} FCFA
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Commission info */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Commission plateforme</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("earnings.commission_info")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
