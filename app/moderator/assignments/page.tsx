"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Package, MapPin, Clock, Truck, CheckCircle, ArrowRight, Car } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useModeratorRequests, useAvailableTransporters, assignTransporter } from "@/lib/hooks/use-moderator"
import { useAuth } from "@/lib/auth/context"
import { mutate } from "swr"

export default function ModeratorAssignmentsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const { data: validatedRequests, isLoading: loadingRequests } = useModeratorRequests("VALIDATED")
  const { data: activeRequests } = useModeratorRequests("IN_PROGRESS")
  const { data: transporters, isLoading: loadingTransporters } = useAvailableTransporters()

  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [selectedTransporter, setSelectedTransporter] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [finalPrice, setFinalPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const availableTransporters = transporters?.filter((t: any) =>
    t.vehicles?.some((v: any) => v.is_available)
  ) || []

  const selectedTransporterData = availableTransporters.find((t: any) => t.id === selectedTransporter)

  const openAssignDialog = (request: any) => {
    setSelectedRequest(request)
    setFinalPrice(request.estimated_price?.toString() || "")
    setShowAssignDialog(true)
  }

  const handleAssign = async () => {
    if (!selectedRequest || !user?.id || !selectedTransporter || !selectedVehicle || !finalPrice) return
    setLoading(true)
    try {
      const price = Number.parseFloat(finalPrice)
      const commission = price * 0.15
      await assignTransporter(selectedRequest.id, selectedTransporter, selectedVehicle, user.id, price, commission)
      mutate(["moderator-requests", "VALIDATED"])
      mutate(["moderator-requests", "IN_PROGRESS"])
      setShowAssignDialog(false)
      setSelectedTransporter("")
      setSelectedVehicle("")
      setFinalPrice("")
    } catch (error) {
      console.error("Error assigning transporter:", error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("moderator_assignments.title")}</h1>
        <p className="text-muted-foreground">{t("moderator_assignments.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{validatedRequests?.length || 0}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_assignments.to_assign")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{activeRequests?.length || 0}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_assignments.active_missions")}</p>
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
                <p className="text-2xl font-bold text-foreground">{availableTransporters.length}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_assignments.available_transporters")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {(validatedRequests?.length || 0) + (activeRequests?.length || 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t("moderator_assignments.today")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Validated requests to assign */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-warning" />
              {t("moderator_assignments.to_assign")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingRequests ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : !validatedRequests || validatedRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">{t("moderator_assignments.all_assigned")}</p>
              </div>
            ) : (
              validatedRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">{request.id?.slice(0, 8)}</span>
                        <Badge variant="outline" className="text-xs border-border">
                          {request.transport_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">
                        {request.client?.first_name} {request.client?.last_name}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {(request.estimated_price || 0).toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {request.pickup_city}
                    <ArrowRight className="h-3 w-3" />
                    {request.delivery_city}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{request.cargo_description}</span>
                    <span>{request.cargo_weight_kg || "N/A"} kg</span>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => openAssignDialog(request)}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {t("moderator_requests.assign")} {t("auth.transporter").toLowerCase()}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active missions */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {t("moderator_assignments.assigned_missions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!activeRequests || activeRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">{t("moderator_assignments.no_active_missions")}</p>
              </div>
            ) : (
              activeRequests.map((mission: any) => (
                <div key={mission.id} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{mission.id?.slice(0, 8)}</span>
                        <Badge className="bg-primary/20 text-primary text-xs">{t("moderator_assignments.in_transit")}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(mission.updated_at || mission.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {mission.pickup_city}
                    <ArrowRight className="h-3 w-3" />
                    {mission.delivery_city}
                  </div>

                  {mission.transporter && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-accent/10 text-accent text-xs">
                            {mission.transporter?.first_name?.[0]}
                            {mission.transporter?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {mission.transporter?.first_name} {mission.transporter?.last_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_requests.assign_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary">{selectedRequest.id?.slice(0, 8)}</span>
                  <span className="font-bold text-foreground">
                    {(selectedRequest.estimated_price || 0).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {selectedRequest.pickup_city} → {selectedRequest.delivery_city}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_requests.transporter_label")} *</Label>
              <Select value={selectedTransporter} onValueChange={(val) => { setSelectedTransporter(val); setSelectedVehicle("") }}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t("moderator_requests.select_transporter")} />
                </SelectTrigger>
                <SelectContent>
                  {loadingTransporters ? (
                    <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
                  ) : availableTransporters.length === 0 ? (
                    <SelectItem value="none" disabled>{t("moderator_assignments.no_transporters")}</SelectItem>
                  ) : (
                    availableTransporters.map((transporter: any) => (
                      <SelectItem key={transporter.id} value={transporter.id}>
                        <div className="flex items-center gap-2">
                          <span>{transporter.first_name} {transporter.last_name}</span>
                          <span className="text-muted-foreground">({transporter.vehicles?.length || 0} {t("moderator_requests.vehicles_count")})</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedTransporterData && (
              <div className="space-y-2">
                <Label className="text-foreground">{t("moderator_requests.vehicle_label")} *</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder={t("moderator_requests.select_vehicle")} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTransporterData.vehicles
                      ?.filter((v: any) => v.is_available)
                      .map((vehicle: any) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex items-center gap-2">
                            <Car className="h-3 w-3" />
                            <span>{vehicle.brand} {vehicle.model} - {vehicle.plate_number} ({vehicle.type})</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_requests.final_price")} *</Label>
              <Input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Ex: 150000"
                className="bg-background border-border"
              />
              {finalPrice && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{t("moderator_requests.platform_commission")}: {(Number.parseFloat(finalPrice) * 0.15).toLocaleString()} FCFA</p>
                  <p>{t("moderator_requests.transporter_earnings")}: {(Number.parseFloat(finalPrice) * 0.85).toLocaleString()} FCFA</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
              className="bg-transparent border-border"
            >
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={loading || !selectedTransporter || !selectedVehicle || !finalPrice}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? t("moderator_requests.assigning") : t("moderator_requests.confirm_assignment")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
