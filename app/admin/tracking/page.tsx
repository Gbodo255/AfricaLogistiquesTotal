"use client"

import { useEffect, useState } from "react"
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
  Eye,
  RefreshCw,
  Filter,
  Wifi,
  AlertTriangle,
  Settings,
} from "lucide-react"
import { TrackingMap } from "@/components/tracking/tracking-map"
import { TrackerDevicesList } from "@/components/tracking/tracker-devices-list"
import { LeafletMap } from "@/components/tracking/leaflet-map"
import { useTrackerDevices, useTrackerAlerts } from "@/lib/hooks/use-tracker"
import type { IOPGPSDevice } from "@/lib/services/a-tracker"
import { useLanguage } from "@/lib/i18n/context"
import { djangoApi } from "@/lib/api/django"

export default function AdminTrackingPage() {
  const { t } = useLanguage()

  const [requests, setRequests] = useState<any[]>([])
  const [kpis, setKpis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMission, setSelectedMission] = useState<any | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<IOPGPSDevice | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchData = async () => {
    try {
      setLoading(true)
      const [requestsRes, kpisRes] = await Promise.all([
        djangoApi.getAdminRequests(),
        djangoApi.getAdminKPIs()
      ])

      if (requestsRes.requests) {
        setRequests(requestsRes.requests)
      }
      if (kpisRes) {
        setKpis(kpisRes)
      }
    } catch (error) {
      console.error("Error fetching admin tracking data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const statusConfig: Record<string, { label: string; color: string }> = {
    "PENDING": { label: t("status.pending"), color: "bg-secondary text-secondary-foreground" },
    "ASSIGNED": { label: t("status.assigned"), color: "bg-primary text-primary-foreground" },
    "IN_PROGRESS": { label: t("status.in_progress"), color: "bg-warning text-warning-foreground" },
    "DELIVERED": { label: t("status.delivered"), color: "bg-success text-success-foreground" },
    "CANCELLED": { label: t("status.cancelled"), color: "bg-destructive text-destructive-foreground" },
  }

  // Hooks A-TRACKER
  const { data: devices, isLoading: devicesLoading } = useTrackerDevices()
  const { data: alerts } = useTrackerAlerts()

  const filteredMissions = requests.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.pickup_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.delivery_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.assigned_transporter_info?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || m.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Préparer les positions pour la carte globale
  const mapPositions = devices?.map(device => ({
    id: device.imei,
    lat: device.position?.lat || 0,
    lng: device.position?.lng || 0,
    label: device.name,
    type: "vehicle" as const,
    speed: device.position?.speed,
    heading: device.position?.course
  })).filter(p => p.lat !== 0) || []

  const onlineDevicesCount = devices?.filter((d) => d.status === "online").length || 0
  const totalDevicesCount = devices?.length || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_tracking.title")}</h1>
          <p className="text-muted-foreground">{t("admin_tracking.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Wifi className="h-3 w-3 text-success" />
            {onlineDevicesCount}/{totalDevicesCount} {t("admin_tracking.online_trackers")}
          </Badge>
          <Button variant="outline" className="gap-2 border-border bg-transparent" onClick={fetchData}>
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
                <p className="text-2xl font-bold text-foreground">{kpis?.total_requests || 0}</p>
                <p className="text-xs text-muted-foreground">{t("admin_tracking.total_missions")}</p>
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
                  {kpis?.in_progress_requests || 0}
                </p>
                <p className="text-xs text-muted-foreground">{t("status.in_progress")}</p>
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
                <p className="text-xs text-muted-foreground">{t("admin_tracking.online_trackers")}</p>
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
                <p className="text-2xl font-bold text-foreground">{kpis?.pending_requests || 0}</p>
                <p className="text-xs text-muted-foreground">{t("status.pending")}</p>
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
                <p className="text-xs text-muted-foreground">{t("admin_tracking.alerts")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <MapPin className="h-4 w-4" />
            {t("admin_tracking.overview")}
          </TabsTrigger>
          <TabsTrigger value="missions" className="gap-2">
            <Truck className="h-4 w-4" />
            {t("admin_tracking.missions")}
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <Wifi className="h-4 w-4" />
            {t("admin_tracking.devices")}
          </TabsTrigger>
        </TabsList>

        {/* Vue globale - Tous les véhicules sur la carte */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    {t("admin_tracking.global_map")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeafletMap
                    positions={mapPositions}
                    center={mapPositions.length > 0 ? { lat: mapPositions[0].lat, lng: mapPositions[0].lng } : { lat: 7.5, lng: -2.0 }}
                    zoom={mapPositions.length > 0 ? 8 : 5}
                    onMarkerClick={(id) => {
                      const mission = requests.find((m) => m.assigned_transporter_info?.tracker_imei === id)
                      if (mission) {
                        setSelectedMission(mission)
                        setActiveTab("missions")
                      }
                    }}
                    selectedMarkerId={selectedMission?.assigned_transporter_info?.tracker_imei}
                    height="500px"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Résumé des missions actives */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-base">{t("admin_tracking.missions_summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requests.filter(m => ["ASSIGNED", "IN_PROGRESS"].includes(m.status)).slice(0, 5).map((mission) => (
                    <div
                      key={mission.slug}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedMission(mission)
                        setActiveTab("missions")
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm truncate max-w-[150px]">{mission.title}</span>
                        <Badge className={statusConfig[mission.status]?.color || ""} variant="outline">
                          {statusConfig[mission.status]?.label || mission.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {mission.pickup_city} → {mission.delivery_city}
                      </div>
                    </div>
                  ))}
                  {requests.filter(m => ["ASSIGNED", "IN_PROGRESS"].includes(m.status)).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">{t("admin_tracking.no_missions")}</p>
                  )}
                </CardContent>
              </Card>

              {/* Alertes récentes */}
              {alerts && alerts.length > 0 && (
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-foreground text-base">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      {t("moderator_tracking.recent_alerts")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-2 rounded bg-warning/10 text-sm">
                        <p className="font-medium text-warning">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Vue détaillée des missions */}
        <TabsContent value="missions" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrackingMap
                imei={selectedMission?.assigned_transporter_info?.tracker_imei}
                vehicleLabel={selectedMission ? `${selectedMission.assigned_transporter_info?.firstname} - ${selectedMission.title}` : undefined}
              />
            </div>

            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("admin_tracking.search")}
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
                        <SelectItem value="ASSIGNED">{t("status.assigned")}</SelectItem>
                        <SelectItem value="IN_PROGRESS">{t("status.in_progress")}</SelectItem>
                        <SelectItem value="DELIVERED">{t("status.delivered")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-base">{t("admin_tracking.active_missions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredMissions.map((mission) => (
                    <div
                      key={mission.slug}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${selectedMission?.slug === mission.slug
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary/70"
                        }`}
                      onClick={() => setSelectedMission(mission)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{mission.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {mission.assigned_transporter_info ?
                              `${mission.assigned_transporter_info.firstname} ${mission.assigned_transporter_info.lastname}` :
                              t("history.not_assigned")}
                          </p>
                        </div>
                        <Badge className={statusConfig[mission.status]?.color || ""}>
                          {statusConfig[mission.status]?.label || mission.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {mission.pickup_city} → {mission.delivery_city}
                      </div>
                    </div>
                  ))}
                  {filteredMissions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">{t("admin_tracking.no_missions")}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Vue Dispositifs */}
        <TabsContent value="devices" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrackingMap
                imei={selectedDevice?.imei}
                showControls={true}
              />
            </div>
            <div>
              <TrackerDevicesList
                onSelectDevice={(device) => {
                  setSelectedDevice(device)
                }}
                selectedDeviceId={selectedDevice?.imei}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
