"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Truck,
  Navigation,
  Phone,
  Clock,
  RefreshCw,
  Filter,
  MessageSquare,
  Wifi,
  WifiOff,
  Gauge,
  AlertTriangle,
} from "lucide-react"
import { TrackingMap } from "@/components/tracking/tracking-map"
import { TrackerDevicesList } from "@/components/tracking/tracker-devices-list"
import { useTrackerDevices, useAllTrackerPositions, useTrackerAlerts } from "@/lib/hooks/use-tracker"
import type { IOPGPSDevice } from "@/lib/services/a-tracker"
import { useLanguage } from "@/lib/i18n/context"
import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

// Fin des imports

export default function ModeratorTrackingPage() {
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    ASSIGNED: { label: "Assigné", color: "bg-secondary text-secondary-foreground" },
    IN_PROGRESS: { label: "En transit", color: "bg-primary/20 text-primary" },
    DELIVERED: { label: "Livré", color: "bg-success/20 text-success" },
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Récupération des missions réelles depuis Django
  const { data: requests = [], isLoading: requestsLoading } = useSWR("active-missions", async () => {
    const res = await djangoApi.getAdminRequests()
    if (res.error) throw new Error(res.error)
    // On ne garde que les missions assignées ou en cours
    return (res.requests || []).filter((r: any) =>
      ["ASSIGNED", "IN_PROGRESS"].includes(r.status) && r.tracker_imei
    )
  })

  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [selectedDevice, setSelectedDevice] = useState<IOPGPSDevice | null>(null)
  const [activeTab, setActiveTab] = useState("missions")

  // Hooks A-TRACKER
  const { data: devices, isLoading: devicesLoading } = useTrackerDevices()
  const { data: allPositions } = useAllTrackerPositions()
  const { data: alerts } = useTrackerAlerts()

  const filteredMissions = requests.filter((m: any) => {
    const matchesSearch =
      !searchQuery ||
      (m.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.assigned_transporter?.first_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.pickup_city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.delivery_city || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || m.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeviceSelect = (device: IOPGPSDevice) => {
    setSelectedDevice(device)
    setActiveTab("devices")
  }

  const onlineDevicesCount = devices?.filter((d) => d.status === "online").length || 0
  const totalDevicesCount = devices?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("moderator_tracking.title")}</h1>
          <p className="text-muted-foreground">{t("moderator_tracking.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Wifi className="h-3 w-3 text-success" />
            {onlineDevicesCount}/{totalDevicesCount} {t("moderator_tracking.online")}
          </Badge>
          <Button variant="outline" className="gap-2 border-border bg-transparent">
            <RefreshCw className="h-4 w-4" />
            {t("moderator_tracking.refresh")}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{requests.length}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_tracking.active_missions")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter((m: any) => m.status === "IN_PROGRESS").length}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_requests.in_progress")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{onlineDevicesCount}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_tracking.online_trackers")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">3h 45min</p>
                <p className="text-xs text-muted-foreground">{t("moderator_tracking.avg_eta")}</p>
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
                <p className="text-2xl font-bold text-foreground">{alerts?.length || 0}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_tracking.alerts")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour basculer entre missions et dispositifs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="missions" className="gap-2">
            <Truck className="h-4 w-4" />
            {t("moderator_tracking.missions")}
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <Wifi className="h-4 w-4" />
            {t("moderator_tracking.devices")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Carte */}
            <div className="lg:col-span-2">
              <TrackingMap
                imei={selectedMission?.tracker_imei}
                pickupLat={selectedMission?.pickup_lat}
                pickupLng={selectedMission?.pickup_lng}
                deliveryLat={selectedMission?.delivery_lat}
                deliveryLng={selectedMission?.delivery_lng}
              />
            </div>

            {/* Liste des missions */}
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("moderator_tracking.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-32 bg-background border-border">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("requests.all")}</SelectItem>
                        <SelectItem value="ASSIGNED">{"Assigné"}</SelectItem>
                        <SelectItem value="IN_PROGRESS">{"En transit"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-base">{t("moderator_tracking.ongoing_missions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredMissions.map((mission: any) => (
                    <div
                      key={mission.slug}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${selectedMission?.slug === mission.slug
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary/70"
                        }`}
                      onClick={() => setSelectedMission(mission)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {mission.assigned_transporter?.first_name?.[0] || "T"}
                              {mission.assigned_transporter?.last_name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {mission.assigned_transporter?.first_name} {mission.assigned_transporter?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{mission.vehicle?.brand} {mission.vehicle?.model}</p>
                          </div>
                        </div>
                        <Badge className={statusConfig[mission.status]?.color}>
                          {statusConfig[mission.status]?.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {mission.pickup_city} → {mission.delivery_city}
                      </div>

                      {/* On simule un progrès basé sur le statut pour l'instant */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t("moderator_tracking.progress")}</span>
                          <span className="text-foreground">{mission.status === "IN_PROGRESS" ? 65 : 0}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${mission.status === "IN_PROGRESS" ? 65 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t("client.tracking.eta")}: {mission.status === "IN_PROGRESS" ? "2h 30min" : "N/A"}
                        </span>
                        <span className="text-muted-foreground">{t("moderator_tracking.last_update")}: {new Date(mission.updated_at).toLocaleTimeString()}</span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border text-foreground bg-transparent h-8 text-xs"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {t("moderator_tracking.call")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border text-foreground bg-transparent h-8 text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {t("moderator_tracking.message")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Carte avec le dispositif sélectionné */}
            <div className="lg:col-span-2">
              <TrackingMap
                imei={selectedDevice?.imei}
                showControls={true}
              />
            </div>

            {/* Liste des dispositifs */}
            <div>
              <TrackerDevicesList
                onSelectDevice={handleDeviceSelect}
                selectedDeviceId={selectedDevice?.id}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alertes récentes */}
      {alerts && alerts.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {t("moderator_tracking.recent_alerts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.type}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
