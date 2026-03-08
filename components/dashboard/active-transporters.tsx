import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Truck } from "lucide-react"

const transporters = [
  {
    id: 1,
    name: "Express Cargo",
    avatar: "EC",
    vehicle: "Camion 10T",
    location: "Douala - Akwa",
    status: "active",
    rating: 4.8,
    missions: 156,
  },
  {
    id: 2,
    name: "Trans Rapide",
    avatar: "TR",
    vehicle: "Fourgon 3T",
    location: "Yaoundé - Nsimeyong",
    status: "on_mission",
    rating: 4.5,
    missions: 89,
  },
  {
    id: 3,
    name: "Logistic Pro",
    avatar: "LP",
    vehicle: "Semi-remorque",
    location: "Douala - Bonabéri",
    status: "active",
    rating: 4.9,
    missions: 234,
  },
  {
    id: 4,
    name: "Speed Trans",
    avatar: "ST",
    vehicle: "Camionnette 1.5T",
    location: "Bafoussam Centre",
    status: "on_mission",
    rating: 4.6,
    missions: 67,
  },
]

export function ActiveTransporters() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Transporteurs actifs</h3>
      </div>
      <div className="divide-y divide-border">
        {transporters.map((transporter) => (
          <div
            key={transporter.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/.jpg?height=48&width=48&query=${transporter.name} logo`} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {transporter.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{transporter.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-3 w-3" />
                  <span>{transporter.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{transporter.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge
                className={
                  transporter.status === "active"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }
              >
                {transporter.status === "active" ? "Disponible" : "En mission"}
              </Badge>
              <div className="mt-2 flex items-center justify-end gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium text-foreground">{transporter.rating}</span>
                <span className="text-sm text-muted-foreground">({transporter.missions})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
