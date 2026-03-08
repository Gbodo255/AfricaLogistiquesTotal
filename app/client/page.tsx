"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Wallet,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Truck,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useClientRequests } from "@/lib/hooks/use-transport-requests"
import { useWallet } from "@/lib/hooks/use-wallet"

export default function ClientDashboard() {
  const { user } = useAuth()
  const { data: requests, isLoading: requestsLoading } = useClientRequests(user?.id)
  const { data: wallet } = useWallet(user?.id)

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "En attente", variant: "secondary" },
    assigned: { label: "Assigné", variant: "default" },
    picked_up: { label: "Enlevé", variant: "default" },
    in_transit: { label: "En transit", variant: "default" },
    delivered: { label: "Livré", variant: "default" },
    cancelled: { label: "Annulé", variant: "destructive" },
  }

  const firstName = user?.firstname || "Client"
  const balance = wallet?.balance || 0

  // Calculate stats
  const pendingRequests = requests?.filter((r: any) => ["PENDING", "pending"].includes(r.status)).length || 0
  const inTransitRequests =
    requests?.filter((r: any) => ["assigned", "picked_up", "in_transit", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "IN_PROGRESS"].includes(r.status)).length || 0
  const deliveredRequests = requests?.filter((r: any) => ["delivered", "DELIVERED"].includes(r.status)).length || 0

  const recentRequests = requests?.slice(0, 3) || []

  const stats = [
    {
      label: "Demandes en cours",
      value: pendingRequests.toString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Solde portefeuille",
      value: `${balance.toLocaleString()} FCFA`,
      icon: Wallet,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Livraisons réussies",
      value: deliveredRequests.toString(),
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "En transit",
      value: inTransitRequests.toString(),
      icon: Truck,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenue, {firstName}</h1>
          <p className="text-muted-foreground">Voici un aperçu de vos opérations logistiques</p>
        </div>
        <Link href="/client/requests/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Alert for low balance */}
      {balance < 10000 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Solde faible</p>
              <p className="text-xs text-muted-foreground">
                Votre solde est faible. Rechargez votre portefeuille pour continuer à utiliser nos services.
              </p>
            </div>
            <Link href="/client/wallet">
              <Button
                size="sm"
                variant="outline"
                className="border-warning text-warning hover:bg-warning/10 bg-transparent"
              >
                Recharger
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent requests */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-foreground">Demandes récentes</CardTitle>
              <Link href="/client/requests">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {requestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune demande</p>
                  <Link href="/client/requests/new">
                    <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Créez une demande de transport
                    </Button>
                  </Link>
                </div>
              ) : (
                recentRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {request.reference_number || request.id.slice(0, 8)}
                          </span>
                          <Badge
                            variant={statusConfig[request.status]?.variant || "secondary"}
                            className={
                              request.status === "in_transit"
                                ? "bg-warning/20 text-warning border-warning/30"
                                : request.status === "assigned"
                                  ? "bg-primary/20 text-primary border-primary/30"
                                  : ""
                            }
                          >
                            {statusConfig[request.status]?.label || request.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {request.pickup_address} → {request.delivery_address}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {request.estimated_cost?.toLocaleString() || 0} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    {request.status !== "pending" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progression</span>
                          <span>
                            {request.status === "delivered"
                              ? "100%"
                              : request.status === "in_transit"
                                ? "75%"
                                : request.status === "picked_up"
                                  ? "50%"
                                  : "25%"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{
                              width:
                                request.status === "delivered"
                                  ? "100%"
                                  : request.status === "in_transit"
                                    ? "75%"
                                    : request.status === "picked_up"
                                      ? "50%"
                                      : "25%",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions & Active tracking */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/client/requests/new" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Package className="h-4 w-4 text-primary" />
                  Nouvelle demande de transport
                </Button>
              </Link>
              <Link href="/client/wallet" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Wallet className="h-4 w-4 text-success" />
                  Recharger mon portefeuille
                </Button>
              </Link>
              <Link href="/client/tracking" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <MapPin className="h-4 w-4 text-warning" />
                  Suivre mes livraisons
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active tracking */}
          {inTransitRequests > 0 && (
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  Suivi en direct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-secondary/50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/map-tracking-delivery-truck-gps.jpg"
                    alt="Suivi en direct"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Livraisons actives</span>
                    <span className="text-foreground font-medium">{inTransitRequests}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="text-success font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      En cours
                    </span>
                  </div>
                </div>
                <Link href="/client/tracking">
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Voir sur la carte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
