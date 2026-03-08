"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Truck, Phone, MessageSquare, Navigation, CheckCircle2, RefreshCw, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { LeafletMap } from "@/components/tracking/leaflet-map"
import { djangoApi } from "@/lib/api/django"
import { useTrackerDevices, useDeliveryTracking } from "@/lib/hooks/use-tracker"

function DeliveryTrackingCard({ delivery, t }: { delivery: any, t: any }) {
  const pickup = parseCoordinates(delivery.pickup_coordinates)
  const destination = parseCoordinates(delivery.delivery_coordinates)
  
  // On utilise le tracker_imei s'il existe, sinon on peut pas suivre précisément
  const { position, eta, isLoading, isMoving, speed } = useDeliveryTracking(
    delivery.tracker_imei,
    destination?.lat,
    destination?.lng
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-secondary text-secondary-foreground">{t("status.pending")}</Badge>
      case "ASSIGNED":
        return <Badge className="bg-primary text-primary-foreground">{t("status.assigned")}</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-warning text-warning-foreground">{t("status.in_progress")}</Badge>
      case "DELIVERED":
        return <Badge className="bg-success text-success-foreground">{t("status.delivered")}</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">{t("status.cancelled")}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">{delivery.title}</CardTitle>
          {getStatusBadge(delivery.status)}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {delivery.pickup_city} → {delivery.delivery_city}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress simulation or real eta */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {delivery.tracker_imei ? t("tracking.real_time") : t("tracking.progress")}
            </span>
            <span className="text-foreground font-medium">
              {delivery.status === "DELIVERED" ? "100%" : 
               eta ? `${Math.round(eta.distance)} km restants` :
               delivery.status === "IN_PROGRESS" ? "65%" : 
               delivery.status === "ASSIGNED" ? "20%" : "0%"}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: delivery.status === "DELIVERED" ? "100%" : 
                             delivery.status === "IN_PROGRESS" ? "65%" : 
                             delivery.status === "ASSIGNED" ? "20%" : "0%" }}
            />
          </div>
          {eta && (
            <p className="text-xs text-primary mt-1 font-medium">
              Arrivée estimée dans {eta.estimatedMinutes} min
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">{"Vitesse"}</p>
            <p className="text-sm font-semibold text-foreground">
              {speed > 0 ? `${speed} km/h` : "--"}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <Navigation className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">{"Poids"}</p>
            <p className="text-sm font-semibold text-foreground">{delivery.weight} kg</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <MapPin className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">{"Statut"}</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {isMoving ? "En mouvement" : "À l'arrêt"}
            </p>
          </div>
        </div>

        {/* Transporter info if assigned */}
        {delivery.assigned_transporter_info && (
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {delivery.assigned_transporter_info.firstname?.[0] || "T"}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {delivery.assigned_transporter_info.firstname} {delivery.assigned_transporter_info.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">Transporteur</p>
                </div>
              </div>
              <div className="flex gap-2">
                {delivery.assigned_transporter_info.telephone && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-border text-foreground bg-transparent"
                    asChild
                  >
                    <a href={`tel:${delivery.assigned_transporter_info.telephone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const parseCoordinates = (coordString: string) => {
  if (!coordString) return null
  const parts = coordString.split(",")
  if (parts.length !== 2) return null
  return {
    lat: parseFloat(parts[0]),
    lng: parseFloat(parts[1]),
  }
}

export default function TrackingPage() {
  const { t } = useLanguage()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: devices } = useTrackerDevices()

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await djangoApi.getMyRequests()
      if (response.transport_requests) {
        // Filtrer uniquement les demandes en cours ou assignées pour le suivi
        const active = response.transport_requests.filter((r: any) => 
          ["ASSIGNED", "IN_PROGRESS", "DELIVERED"].includes(r.status)
        )
        setRequests(active)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Mapper les positions des dispositifs pour la carte
  const mapPositions = devices?.map(device => ({
    id: device.imei,
    lat: device.position?.lat || 0,
    lng: device.position?.lng || 0,
    label: device.name,
    type: "vehicle" as const,
    speed: device.position?.speed,
    heading: device.position?.course
  })).filter(p => p.lat !== 0) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("tracking.title")}</h1>
        <p className="text-muted-foreground">{t("tracking.subtitle")}</p>
      </div>

      {/* Map */}
      <Card className="border-border bg-card overflow-hidden">
        <LeafletMap 
          positions={mapPositions}
          height="450px"
          center={mapPositions.length > 0 ? { lat: mapPositions[0].lat, lng: mapPositions[0].lng } : { lat: 6.5244, lng: 3.3792 }}
          zoom={mapPositions.length > 0 ? 10 : 6}
        />
      </Card>

      {/* Active deliveries */}
      <div className="grid lg:grid-cols-2 gap-6">
        {requests.length === 0 ? (
          <Card className="col-span-full p-12 text-center border-dashed border-2 border-border">
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground">Aucune livraison active</h3>
              <p className="text-muted-foreground">Vos demandes de transport apparaîtront ici une fois qu'elles seront en cours.</p>
            </div>
          </Card>
        ) : (
          requests.map((delivery) => (
            <DeliveryTrackingCard key={delivery.slug} delivery={delivery} t={t} />
          ))
        )}
      </div>
    </div>
  )
}
