"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Package,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Truck,
  User,
  Star,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useActiveMissions, useCompletedMissions, updateMissionStatus } from "@/lib/hooks/use-missions"
import { useLanguage } from "@/lib/i18n/context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MissionsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    ASSIGNED: { label: "Assigné", color: "bg-secondary text-secondary-foreground" },
    IN_PROGRESS: { label: "En cours", color: "bg-primary/20 text-primary" },
    DELIVERED: { label: "Livré", color: "bg-success/20 text-success" },
  }
  const { data: activeMissions, isLoading: activeLoading, mutate: mutateActive } = useActiveMissions(user?.id)
  const {
    data: completedMissions,
    isLoading: completedLoading,
    mutate: mutateCompleted,
  } = useCompletedMissions(user?.id)
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    missionId: string
    action: "IN_PROGRESS" | "DELIVERED"
  }>({ open: false, missionId: "", action: "IN_PROGRESS" })

  const handleStatusUpdate = async () => {
    try {
      await updateMissionStatus(confirmDialog.missionId, confirmDialog.action)
      mutateActive()
      if (confirmDialog.action === "DELIVERED") {
        mutateCompleted()
      }
      setConfirmDialog({ open: false, missionId: "", action: "IN_PROGRESS" })
    } catch (error) {
      console.error("Error updating mission status:", error)
    }
  }

  const filteredActive = activeMissions?.filter(
    (m) =>
      !searchQuery ||
      m.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.pickup_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getActionText = (action: string) => {
    switch (action) {
      case "IN_PROGRESS":
        return { title: t("missions.start_transport"), description: t("missions.start_transport_desc") }
      case "DELIVERED":
        return {
          title: t("missions.confirm_delivery"),
          description: t("missions.confirm_delivery_desc"),
        }
      default:
        return { title: "", description: "" }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("missions.title")}</h1>
        <p className="text-muted-foreground">{t("missions.subtitle")}</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("missions.search")}
                className="pl-10 bg-input border-border text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 border-border text-foreground bg-transparent">
              <Filter className="h-4 w-4" />
              {t("missions.filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("missions.active")} ({activeMissions?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("missions.completed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !filteredActive || filteredActive.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Truck className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("missions.no_active")}</h3>
                <p className="text-muted-foreground text-center">
                  Les missions assignées par les modérateurs apparaîtront ici
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActive.map((mission: any) => (
              <Card key={mission.slug} className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {mission.slug}
                          </span>
                          <Badge className={statusConfig[mission.status]?.color || statusConfig.ASSIGNED.color}>
                            {statusConfig[mission.status]?.label || mission.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Assigné le {new Date(mission.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-success">
                          {Math.round(Number(mission.estimated_price || 0) * 0.85).toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">(commission déduite)</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-foreground font-medium">{mission.pickup_address}</span>
                      </div>
                      <div className="flex-1 h-px bg-border" />
                      <div className="text-center">
                        <Truck className="h-5 w-5 text-primary mx-auto" />
                      </div>
                      <div className="flex-1 h-px bg-border" />
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-success" />
                        <span className="text-foreground font-medium">{mission.delivery_address}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid sm:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Client</p>
                          <p className="text-sm font-medium text-foreground">
                            {mission.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cargo</p>
                          <p className="text-sm font-medium text-foreground">{mission.merchandise_type || "Marchandises"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Poids</p>
                          <p className="text-sm font-medium text-foreground">{mission.weight || 0} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date prévue</p>
                          <p className="text-sm font-medium text-foreground">
                            {mission.pickup_date
                              ? new Date(mission.pickup_date).toLocaleDateString("fr-FR")
                              : "Non spécifié"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                      {mission.status === "ASSIGNED" && (
                        <Button
                          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => setConfirmDialog({ open: true, missionId: mission.slug, action: "IN_PROGRESS" })}
                        >
                          <Truck className="h-4 w-4" />
                          Démarrer la livraison
                        </Button>
                      )}
                      {mission.status === "IN_PROGRESS" && (
                        <>
                          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Navigation className="h-4 w-4" />
                            Naviguer
                          </Button>
                          <Button
                            className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => setConfirmDialog({ open: true, missionId: mission.slug, action: "DELIVERED" })}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmer livraison
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !completedMissions || completedMissions.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("missions.no_completed")}</h3>
                <p className="text-muted-foreground text-center">Vos missions complétées apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : (
            completedMissions.map((mission: any) => (
              <Card key={mission.slug} className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {mission.slug}
                          </span>
                          <Badge className="bg-success/20 text-success">Livré</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {mission.pickup_address} → {mission.delivery_address} •{" "}
                          {new Date(mission.updated_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        {Math.round(Number(mission.estimated_price || 0) * 0.85).toLocaleString()} FCFA
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < 4 ? "text-warning fill-warning" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{getActionText(confirmDialog.action).title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {getActionText(confirmDialog.action).description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground bg-transparent">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate} className="bg-primary hover:bg-primary/90">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
