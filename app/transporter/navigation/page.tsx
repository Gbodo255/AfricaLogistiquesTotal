"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Phone, MessageSquare, CheckCircle2, AlertTriangle, Truck } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function NavigationPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("navigation.title")}</h1>
          <p className="text-muted-foreground">{t("navigation.mission_in_progress")}</p>
        </div>
        <Badge className="bg-primary/20 text-primary w-fit">{"En transit"}</Badge>
      </div>

      {/* Map */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="relative h-[400px] bg-secondary/50">
          <img
            src="/map-navigation-gps-route-west-africa.jpg"
            alt="Navigation GPS"
            className="w-full h-full object-cover"
          />
          {/* Navigation overlay */}
          <div className="absolute top-4 left-4 right-4 p-4 rounded-xl bg-card/95 backdrop-blur border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Direction: Lomé</p>
                  <p className="text-sm text-muted-foreground">Dans 500m, tournez à droite</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">2h 15</p>
                <p className="text-sm text-muted-foreground">125 km restants</p>
              </div>
            </div>
          </div>
          {/* Current position */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="p-3 rounded-lg bg-card/95 backdrop-blur border border-border">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-foreground">Frontière Bénin-Togo</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-card border border-border text-foreground hover:bg-secondary"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button size="icon" className="h-12 w-12 rounded-full bg-primary text-primary-foreground">
                <Navigation className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mission details */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">Détails de la mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <div className="w-0.5 h-8 bg-border" />
                  <div className="h-4 w-4 rounded-full bg-success" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Départ</p>
                    <p className="font-medium text-foreground">Cotonou, Bénin</p>
                    <p className="text-xs text-muted-foreground">Démarré à 09:30</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium text-foreground">Lomé, Togo</p>
                    <p className="text-xs text-muted-foreground">ETA: 11:45</p>
                  </div>
                </div>
              </div>

              {/* Client info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-2">Client</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      JD
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Jean Dupont</p>
                      <p className="text-sm text-muted-foreground">+229 97 XX XX XX</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="border-border text-foreground bg-transparent">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-border text-foreground bg-transparent">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cargo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-medium text-foreground">Marchandises générales</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Poids</p>
                  <p className="font-medium text-foreground">500 kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Timeline */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">{t("transporter.navigation_actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 bg-success hover:bg-success/90 text-success-foreground">
                <CheckCircle2 className="h-4 w-4" />
                {t("transporter.confirm_delivery")}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 border-warning text-warning bg-transparent hover:bg-warning/10"
              >
                <AlertTriangle className="h-4 w-4" />
                {t("transporter.report_problem")}
              </Button>
              <Button variant="outline" className="w-full gap-2 border-border text-foreground bg-transparent">
                <Phone className="h-4 w-4" />
                {t("transporter.contact_support")}
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">{t("transporter.timeline")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "completed", label: t("transporter.mission_accepted"), time: "08:30" },
                  { status: "completed", label: t("transporter.picked_up_label"), time: "09:30" },
                  { status: "current", label: "En transit", time: "10:00" },
                  { status: "pending", label: t("transporter.arrival_destination"), time: "~11:45" },
                  { status: "pending", label: t("transporter.delivery_confirmed"), time: "-" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-success/20"
                          : item.status === "current"
                            ? "bg-primary/20"
                            : "bg-secondary"
                      }`}
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : item.status === "current" ? (
                        <Truck className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={`text-sm ${item.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
