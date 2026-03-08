"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Truck,
  MapPin,
  Wifi,
  WifiOff,
  Search,
  RefreshCw,
  MoreVertical,
  Navigation,
  Battery,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTrackerDevices } from "@/lib/hooks/use-tracker"
import { useState } from "react"
import type { IOPGPSDevice } from "@/lib/services/a-tracker"

interface TrackerDevicesListProps {
  onSelectDevice?: (device: IOPGPSDevice) => void
  selectedDeviceId?: string
}

export function TrackerDevicesList({
  onSelectDevice,
  selectedDeviceId,
}: TrackerDevicesListProps) {
  const { data: devices, error, isLoading, mutate } = useTrackerDevices()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDevices = devices?.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.imei.includes(searchTerm)
  )

  const getStatusBadge = (status: IOPGPSDevice["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <Wifi className="h-3 w-3 mr-1" />
            En ligne
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <WifiOff className="h-3 w-3 mr-1" />
            Hors ligne
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Inactif
          </Badge>
        )
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Dispositifs A-TRACKER
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => mutate()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou IMEI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8 text-destructive">
            <WifiOff className="h-8 w-8 mx-auto mb-2" />
            <p>Erreur de connexion au service A-TRACKER</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => mutate()}>
              Réessayer
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-secondary/50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredDevices?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Truck className="h-8 w-8 mx-auto mb-2" />
            <p>Aucun dispositif trouvé</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredDevices?.map((device) => (
              <div
                key={device.id}
                onClick={() => onSelectDevice?.(device)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedDeviceId === device.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        device.status === "online"
                          ? "bg-success/10"
                          : "bg-muted"
                      }`}
                    >
                      <Truck
                        className={`h-5 w-5 ${
                          device.status === "online"
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        IMEI: {device.imei}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(device.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MapPin className="h-4 w-4 mr-2" />
                          Voir sur la carte
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Navigation className="h-4 w-4 mr-2" />
                          Historique des trajets
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          Configurer les alertes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {device.position && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {device.position.lat.toFixed(4)}, {device.position.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="h-3 w-3" />
                      <span>{device.position.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(device.lastUpdate).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        {devices && devices.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{devices.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {devices.filter((d) => d.status === "online").length}
                </p>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">
                  {devices.filter((d) => d.status !== "online").length}
                </p>
                <p className="text-xs text-muted-foreground">Hors ligne</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
