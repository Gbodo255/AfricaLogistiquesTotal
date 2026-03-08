"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, AlertTriangle, Phone, MessageSquare } from "lucide-react"

const activeMissions = [
  {
    id: "MS-2024-045",
    transporter: "Express Cargo",
    driver: "Paul Mbarga",
    phone: "+237 6XX XXX XXX",
    origin: "Douala Port",
    destination: "Yaoundé",
    currentLocation: "Edéa",
    progress: 45,
    eta: "2h 30min",
    status: "on_track",
    lastUpdate: "Il y a 3 min",
  },
  {
    id: "MS-2024-046",
    transporter: "Trans Rapide",
    driver: "Alain Nkeng",
    phone: "+237 6XX XXX XXX",
    origin: "Bafoussam",
    destination: "Douala",
    currentLocation: "Nkongsamba",
    progress: 68,
    eta: "1h 15min",
    status: "on_track",
    lastUpdate: "Il y a 5 min",
  },
  {
    id: "MS-2024-047",
    transporter: "Logistic Pro",
    driver: "Samuel Fotso",
    phone: "+237 6XX XXX XXX",
    origin: "Yaoundé",
    destination: "Maroua",
    currentLocation: "Ngaoundéré",
    progress: 55,
    eta: "5h 45min",
    status: "delayed",
    delay: "45 min",
    lastUpdate: "Il y a 8 min",
  },
]

export function LiveTracking() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Suivi en temps réel - A-TRACKER</h3>
          <p className="text-sm text-muted-foreground">{activeMissions.length} missions en cours</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground bg-transparent"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Voir carte
        </Button>
      </div>
      <div className="divide-y divide-border">
        {activeMissions.map((mission) => (
          <div key={mission.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{mission.id}</span>
                  {mission.status === "delayed" && (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Retard {mission.delay}
                    </Badge>
                  )}
                  {mission.status === "on_track" && (
                    <Badge className="bg-success/10 text-success border-success/20">En temps</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground mt-1">{mission.transporter}</p>
                <p className="text-xs text-muted-foreground">Chauffeur: {mission.driver}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{mission.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Navigation className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">{mission.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{mission.destination}</span>
                </div>
              </div>

              <div className="relative h-2 w-full rounded-full bg-muted">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all ${mission.status === "delayed" ? "bg-warning" : "bg-primary"
                    }`}
                  style={{ width: `${mission.progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-background shadow-lg"
                  style={{ left: `${mission.progress}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{mission.progress}% complété</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>ETA: {mission.eta}</span>
                </div>
                <span>Màj: {mission.lastUpdate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
