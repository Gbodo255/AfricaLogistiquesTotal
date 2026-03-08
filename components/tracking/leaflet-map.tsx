"use client"

import { useEffect, useRef, useState } from "react"
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
} from "lucide-react"
import type { IOPGPSPosition } from "@/lib/services/a-tracker"

// Import dynamique de Leaflet pour éviter les erreurs SSR
import dynamic from "next/dynamic"

interface LeafletMapProps {
  positions?: {
    id: string
    lat: number
    lng: number
    label?: string
    type?: "vehicle" | "pickup" | "delivery"
    speed?: number
    heading?: number
  }[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (id: string) => void
  selectedMarkerId?: string
  showRoute?: boolean
  pickupCoords?: { lat: number; lng: number }
  deliveryCoords?: { lat: number; lng: number }
  className?: string
  height?: string
}

// Composant Map sans SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
)

const useMap = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMap),
  { ssr: false }
) as any

export function LeafletMap({
  positions = [],
  center = { lat: 6.5244, lng: 3.3792 }, // Lagos par défaut (Afrique de l'Ouest)
  zoom = 6,
  onMarkerClick,
  selectedMarkerId,
  showRoute = false,
  pickupCoords,
  deliveryCoords,
  className,
  height = "400px",
}: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Import Leaflet côté client uniquement
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      // Fix pour les icônes Leaflet
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })
    })
  }, [])

  // Créer des icônes personnalisées
  const createIcon = (type: string, isSelected: boolean = false) => {
    if (!L) return undefined

    const colors = {
      vehicle: isSelected ? "#22c55e" : "#3b82f6",
      pickup: "#22c55e",
      delivery: "#ef4444",
    }

    const color = colors[type as keyof typeof colors] || colors.vehicle

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: ${isSelected ? "40px" : "32px"};
          height: ${isSelected ? "40px" : "32px"};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          ${isSelected ? "animation: pulse 1s infinite;" : ""}
        ">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
            ${type === "vehicle" 
              ? '<path d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM19 6h-3V3H8v3H5c-1.1 0-2 .9-2 2v9h2a3 3 0 0 0 6 0h2a3 3 0 0 0 6 0h2V8c0-1.1-.9-2-2-2z"/>'
              : '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>'
            }
          </svg>
        </div>
      `,
      iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
      iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
    })
  }

  if (!isClient) {
    return (
      <div 
        className={`bg-secondary/50 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculer les coordonnées de la route
  const routeCoordinates: [number, number][] = []
  if (showRoute && pickupCoords && deliveryCoords) {
    routeCoordinates.push([pickupCoords.lat, pickupCoords.lng])
    // Ajouter les positions des véhicules sur la route
    positions
      .filter((p) => p.type === "vehicle")
      .forEach((p) => {
        routeCoordinates.push([p.lat, p.lng])
      })
    routeCoordinates.push([deliveryCoords.lat, deliveryCoords.lng])
  }

  return (
    <div className={className} style={{ height }}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
        }
        .leaflet-popup-tip {
          background: hsl(var(--card));
        }
      `}</style>
      
      {L && (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%", borderRadius: "8px", zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Route line */}
          {showRoute && routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#3b82f6",
                weight: 4,
                opacity: 0.7,
                dashArray: "10, 10",
              }}
            />
          )}

          {/* Pickup marker */}
          {pickupCoords && (
            <Marker
              position={[pickupCoords.lat, pickupCoords.lng]}
              icon={createIcon("pickup")}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-success">Point de collecte</p>
                  <p className="text-xs text-muted-foreground">
                    {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Delivery marker */}
          {deliveryCoords && (
            <Marker
              position={[deliveryCoords.lat, deliveryCoords.lng]}
              icon={createIcon("delivery")}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-destructive">Point de livraison</p>
                  <p className="text-xs text-muted-foreground">
                    {deliveryCoords.lat.toFixed(4)}, {deliveryCoords.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Vehicle markers */}
          {positions.map((pos) => (
            <Marker
              key={pos.id}
              position={[pos.lat, pos.lng]}
              icon={createIcon(pos.type || "vehicle", selectedMarkerId === pos.id)}
              eventHandlers={{
                click: () => onMarkerClick?.(pos.id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <p className="font-semibold">{pos.label || `Véhicule ${pos.id}`}</p>
                  {pos.speed !== undefined && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Gauge className="h-3 w-3" /> {pos.speed} km/h
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}
