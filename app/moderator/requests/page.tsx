"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Package, MapPin, Clock, Eye, Check, X, ChevronDown, ChevronUp, Truck } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import {
  useModeratorRequests,
  useAvailableTransporters,
  validateRequest,
  rejectRequest,
  assignTransporter,
} from "@/lib/hooks/use-moderator"
import { mutate } from "swr"
import { useLanguage } from "@/lib/i18n/context"

export default function ModeratorRequestsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: t("moderator_requests.pending"), color: "bg-warning/10 text-warning border-warning/20" },
    validated: { label: t("moderator_requests.validated"), color: "bg-primary/10 text-primary border-primary/20" },
    assigned: { label: t("assigned"), color: "bg-accent/10 text-accent border-accent/20" },
    in_progress: { label: t("in_progress"), color: "bg-primary/10 text-primary border-primary/20" },
    completed: { label: t("common.completed"), color: "bg-success/10 text-success border-success/20" },
    cancelled: { label: t("cancelled"), color: "bg-destructive/10 text-destructive border-destructive/20" },
    disputed: { label: t("moderator.disputes"), color: "bg-destructive/10 text-destructive border-destructive/20" },
  }
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showValidateDialog, setShowValidateDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedTransporter, setSelectedTransporter] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [finalPrice, setFinalPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const { data: requests, isLoading } = useModeratorRequests(statusFilter)
  const { data: transporters } = useAvailableTransporters()

  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      request.id.toLowerCase().includes(search) ||
      request.pickup_city?.toLowerCase().includes(search) ||
      request.delivery_city?.toLowerCase().includes(search) ||
      request.client?.first_name?.toLowerCase().includes(search) ||
      request.client?.last_name?.toLowerCase().includes(search)
    )
  })

  const handleValidate = async () => {
    if (!selectedRequest || !user?.id) return
    setLoading(true)
    try {
      await validateRequest(selectedRequest.id, user.id, Number.parseFloat(estimatedPrice) || undefined)
      mutate(["moderator-requests", statusFilter])
      mutate("moderator-pending-requests")
      setShowValidateDialog(false)
      setEstimatedPrice("")
    } catch (error) {
      console.error("Error validating request:", error)
    }
    setLoading(false)
  }

  const handleReject = async () => {
    if (!selectedRequest || !user?.id || !rejectionReason) return
    setLoading(true)
    try {
      await rejectRequest(selectedRequest.id, user.id, rejectionReason)
      mutate(["moderator-requests", statusFilter])
      mutate("moderator-pending-requests")
      setShowRejectDialog(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Error rejecting request:", error)
    }
    setLoading(false)
  }

  const handleAssign = async () => {
    if (!selectedRequest || !user?.id || !selectedTransporter || !selectedVehicle || !finalPrice) return
    setLoading(true)
    try {
      const price = Number.parseFloat(finalPrice)
      const commission = price * 0.15 // 15% commission
      await assignTransporter(selectedRequest.id, selectedTransporter, selectedVehicle, user.id, price, commission)
      mutate(["moderator-requests", statusFilter])
      setShowAssignDialog(false)
      setSelectedTransporter("")
      setSelectedVehicle("")
      setFinalPrice("")
    } catch (error) {
      console.error("Error assigning transporter:", error)
    }
    setLoading(false)
  }

  const selectedTransporterData = transporters?.find((t) => t.id === selectedTransporter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("moderator_requests.title")}</h1>
        <p className="text-muted-foreground">{t("moderator_requests.subtitle")}</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("moderator_requests.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("moderator_requests.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("moderator_requests.all_statuses")}</SelectItem>
                <SelectItem value="pending">{t("moderator_requests.pending")}</SelectItem>
                <SelectItem value="validated">{t("moderator_requests.validated_plural")}</SelectItem>
                <SelectItem value="assigned">{t("moderator_requests.assigned_plural")}</SelectItem>
                <SelectItem value="in_progress">{t("in_progress")}</SelectItem>
                <SelectItem value="completed">{t("moderator_requests.completed_plural")}</SelectItem>
                <SelectItem value="cancelled">{t("moderator_requests.cancelled_plural")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests list */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground">{filteredRequests?.length || 0} {t("moderator.requests")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredRequests?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t("moderator_requests.no_requests")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredRequests?.map((request) => (
                <div key={request.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-lg p-2 ${request.status === "pending"
                            ? "bg-warning/10"
                            : request.status === "validated"
                              ? "bg-primary/10"
                              : "bg-muted"
                          }`}
                      >
                        <Package
                          className={`h-5 w-5 ${request.status === "pending"
                              ? "text-warning"
                              : request.status === "validated"
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-primary">{request.id.slice(0, 8)}</span>
                          <Badge className={statusConfig[request.status]?.color || "bg-muted"}>
                            {statusConfig[request.status]?.label || request.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-border">
                            {request.transport_type}
                          </Badge>
                        </div>
                        <p className="font-medium text-foreground">
                          {request.client?.first_name} {request.client?.last_name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.pickup_city} → {request.delivery_city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(request.created_at).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {(request.final_price || request.estimated_price)?.toLocaleString() || "N/A"} FCFA
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                      >
                        {expandedId === request.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedId === request.id && (
                    <div className="mt-4 ml-14 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-muted/50 p-4">
                        <div>
                          <p className="text-xs text-muted-foreground">{t("moderator_requests.cargo")}</p>
                          <p className="text-sm font-medium text-foreground">{request.cargo_description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t("moderator_requests.weight")}</p>
                          <p className="text-sm font-medium text-foreground">{request.cargo_weight_kg || "N/A"} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t("moderator_requests.volume")}</p>
                          <p className="text-sm font-medium text-foreground">{request.cargo_volume_m3 || "N/A"} m³</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t("moderator_requests.desired_date")}</p>
                          <p className="text-sm font-medium text-foreground">
                            {request.pickup_date ? new Date(request.pickup_date).toLocaleDateString("fr-FR") : "N/A"}
                          </p>
                        </div>
                      </div>

                      {request.transporter && (
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {request.transporter.first_name?.[0]}
                              {request.transporter.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {t("moderator_requests.assigned_to")}: {request.transporter.first_name} {request.transporter.last_name}
                            </p>
                            {request.vehicle && (
                              <p className="text-xs text-muted-foreground">
                                {request.vehicle.brand} {request.vehicle.model} - {request.vehicle.plate_number}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("moderator_requests.details")} {t("admin_requests.complete")}
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowRejectDialog(true)
                              }}
                            >
                              <X className="mr-2 h-4 w-4" />
                              {t("moderator_requests.reject")}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => {
                                setSelectedRequest(request)
                                setEstimatedPrice(request.estimated_price?.toString() || "")
                                setShowValidateDialog(true)
                              }}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              {t("moderator_requests.validate")}
                            </Button>
                          </>
                        )}
                        {request.status === "validated" && (
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                              setSelectedRequest(request)
                              setFinalPrice(request.estimated_price?.toString() || "")
                              setShowAssignDialog(true)
                            }}
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            {t("moderator_requests.assign")}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validate Dialog */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_requests.validate_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_requests.price_label")}</Label>
              <Input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="Ex: 150000"
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">{t("moderator_requests.keep_estimate")}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowValidateDialog(false)}
              className="bg-transparent border-border"
            >
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={handleValidate}
              disabled={loading}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {loading ? t("moderator_requests.validating") : t("moderator_requests.validate_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_requests.reject_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_requests.reason")} *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t("moderator_requests.reject_placeholder")}
                className="bg-background border-border min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="bg-transparent border-border"
            >
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading || !rejectionReason}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? t("moderator_requests.rejecting") : t("moderator_requests.confirm_reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("moderator_requests.assign_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("moderator_requests.transporter_label")} *</Label>
              <Select value={selectedTransporter} onValueChange={setSelectedTransporter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t("moderator_requests.select_transporter")} />
                </SelectTrigger>
                <SelectContent>
                  {transporters?.map((transporter) => (
                    <SelectItem key={transporter.id} value={transporter.id}>
                      <div className="flex items-center gap-2">
                        <span>
                          {transporter.first_name} {transporter.last_name}
                        </span>
                        <span className="text-muted-foreground">({transporter.vehicles?.length || 0} {t("moderator_requests.vehicles_count")})</span>
                      </div>
                    </SelectItem>
                  ))}
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
                      ?.filter((v) => v.is_available)
                      .map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.plate_number} ({vehicle.type})
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
