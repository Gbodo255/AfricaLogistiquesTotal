"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Calendar, Star, Download, CheckCircle2, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { useTransporterMissions } from "@/lib/hooks/use-transport-requests"

export default function TransporterHistoryPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: missions, isLoading } = useTransporterMissions(user?.id)

  const deliveredMissions = missions?.filter((m: any) => m.status === "DELIVERED") || []
  const totalEarned = deliveredMissions.reduce((acc: number, m: any) => acc + (parseFloat(m.estimated_price) || 0) * 0.9, 0) // Supposons 90% pour le transporteur

  const handleExport = () => {
    const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api/africa_logistic'
    window.open(`${DJANGO_API_URL}/reports/transporter/my-missions.csv`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("transporter_history.title")}</h1>
          <p className="text-muted-foreground">{t("transporter_history.subtitle")}</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-border text-foreground bg-transparent"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          {t("transporter_history.export")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{deliveredMissions.length}</p>
            <p className="text-sm text-muted-foreground">{t("transporter_history.total_missions")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">100%</p>
            <p className="text-sm text-muted-foreground">{t("history.success_rate")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">--</p>
            <p className="text-sm text-muted-foreground">{t("history.average_rating")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{totalEarned.toLocaleString()} FCFA</p>
            <p className="text-sm text-muted-foreground">{t("transporter_history.earned")}</p>
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
                placeholder={t("transporter_history.search")}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            <Button variant="outline" className="gap-2 border-border text-foreground bg-transparent">
              <Filter className="h-4 w-4" />
              {t("history.filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : deliveredMissions.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
            {t("transporter_history.no_data")}
          </div>
        ) : (
          deliveredMissions.map((item: any) => (
            <Card key={item.slug} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{item.slug}</span>
                        <Badge className="bg-success/20 text-success">{t(`status.${item.status.toLowerCase()}`)}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.pickup_city} → {item.delivery_city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{t("transporter_history.client")}: {item.client_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="text-lg font-bold text-success">{(parseFloat(item.estimated_price) * 0.9).toLocaleString()} FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
