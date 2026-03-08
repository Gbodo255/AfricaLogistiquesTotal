"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Navigation,
  Truck,
  Clock,
  Gauge,
  RefreshCw,
  Maximize2,
  Minimize2,
  Crosshair,
  Route,
} from "lucide-react"
import { useDeliveryTracking } from "@/lib/hooks/use-tracker"
import { LeafletMap } from "./leaflet-map"

interface TrackingMapProps {
  imei?: string
  pickupLat?: number
  pickupLng?: number
  deliveryLat?: number
  deliveryLng?: number
  vehicleLabel?: string
  showControls?: boolean
  className?: string
}

export function TrackingMap({
  imei,
  pickupLat,
  pickupLng,
  deliveryLat,
  deliveryLng,
  vehicleLabel,
  showControls = true,
  className,
}: TrackingMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { position, eta, isLoading, isMoving, speed, heading } = useDeliveryTracking(
    imei,
    deliveryLat,
    deliveryLng
  )

  // Position simulée pour la démo si pas de vraie position
  const demoPosition = {
    lat: pickupLat && deliveryLat ? (pickupLat + deliveryLat) / 2 : 6.5244,
    lng: pickupLng && deliveryLng ? (pickupLng + deliveryLng) / 2 : 3.3792,
  }

  const currentPosition = position || {
    lat: demoPosition.lat,
    lng: demoPosition.lng,
    speed: 45,
    course: 90,
  }

  // Construire les positions pour la carte
  const mapPositions = imei ? [{
    id: imei,
    lat: currentPosition.lat,
    lng: currentPosition.lng,
    label: vehicleLabel || "Véhicule",
    type: "vehicle" as const,
    speed: currentPosition.speed,
    heading: currentPosition.course,
  }] : []

  // Centre de la carte
  const mapCenter = {
    lat: currentPosition.lat,
    lng: currentPosition.lng,
  }

  const toggleFullscreen = () => {
    const element = document.getElementById("tracking-map-container")
    if (element) {
      if (!isFullscreen) {
        element.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <Card className={className} id="tracking-map-container">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Suivi A-TRACKER
          </CardTitle>
          <div className="flex items-center gap-2">
            {imei ? (
              isMoving ? (
                <Badge className="bg-success/10 text-success border-success/20">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  En mouvement
                </Badge>
              ) : (
                <Badge variant="outline">À l'arrêt</Badge>
              )
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Aucun tracker
              </Badge>
            )}
            {showControls && (
              <>
                <Button variant="ghost" size="icon" title="Centrer">
                  <Crosshair className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Carte Leaflet */}
        {isLoading ? (
          <div className="w-full h-[400px] bg-secondary/50 rounded-lg flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <LeafletMap
            positions={mapPositions}
            center={mapCenter}
            zoom={imei ? 12 : 6}
            pickupCoords={pickupLat && pickupLng ? { lat: pickupLat, lng: pickupLng } : undefined}
            deliveryCoords={deliveryLat && deliveryLng ? { lat: deliveryLat, lng: deliveryLng } : undefined}
            showRoute={!!(pickupLat && pickupLng && deliveryLat && deliveryLng)}
            height="400px"
          />
        )}

        {/* Informations de suivi */}
        {imei && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gauge className="h-4 w-4" />
                <span className="text-xs">Vitesse</span>
              </div>
              <p className="text-lg font-bold">{speed || currentPosition.speed} km/h</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Navigation className="h-4 w-4" />
                <span className="text-xs">Direction</span>
              </div>
              <p className="text-lg font-bold">{heading || currentPosition.course}°</p>
            </div>

            {eta ? (
              <>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Route className="h-4 w-4" />
                    <span className="text-xs">Distance</span>
                  </div>
                  <p className="text-lg font-bold">{eta.distance.toFixed(1)} km</p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">ETA</span>
                  </div>
                  <p className="text-lg font-bold">
                    {eta.estimatedMinutes < 60
                      ? `${eta.estimatedMinutes} min`
                      : `${Math.floor(eta.estimatedMinutes / 60)}h ${eta.estimatedMinutes % 60}min`}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Route className="h-4 w-4" />
                    <span className="text-xs">Distance</span>
                  </div>
                  <p className="text-lg font-bold text-muted-foreground">--</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">ETA</span>
                  </div>
                  <p className="text-lg font-bold text-muted-foreground">--</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Coordonnées GPS */}
        {imei && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Coordonnées GPS: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground">
                IMEI: {imei}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Temps réel
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
