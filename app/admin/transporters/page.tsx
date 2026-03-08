"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { djangoApi } from "@/lib/api/django"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"

export default function PendingTransportersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [transporters, setTransporters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransporter, setSelectedTransporter] = useState<any | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (user && (user.role?.toUpperCase() === "ADMIN" || user.role?.toUpperCase() === "MODERATOR")) {
      loadPendingTransporters()
    } else {
      router.push("/auth/login")
    }
  }, [user, router])

  const loadPendingTransporters = async () => {
    try {
      setLoading(true)
      const token = djangoApi.getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await djangoApi.getPendingTransporters()
      setTransporters(response.transporters || [])
    } catch (error: any) {
      console.error("Error loading transporters:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les transporteurs en attente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (transporter: any) => {
    try {
      const response = await djangoApi.getTransporterDetails(transporter.slug)
      setSelectedTransporter(response.transporter)
      setDetailDialogOpen(true)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (transporterSlug: string) => {
    try {
      await djangoApi.approveTransporter(transporterSlug)
      toast({
        title: t("common.success"),
        description: t("admin_transporters.approved_success"),
      })
      await loadPendingTransporters()
      setDetailDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver le transporteur",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!selectedTransporter) return

    try {
      await djangoApi.rejectTransporter(selectedTransporter.slug, rejectReason)
      toast({
        title: t("common.success"),
        description: t("admin_transporters.rejected_success"),
      })
      await loadPendingTransporters()
      setRejectDialogOpen(false)
      setDetailDialogOpen(false)
      setRejectReason("")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter la demande",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_transporters.pending_title")}</h1>
          <p className="text-muted-foreground">
            {transporters.length} {transporters.length > 1 ? t("admin_transporters.transporters_plural") : t("admin_transporters.transporter_singular")} {t("admin_transporters.pending_validation")}
          </p>
        </div>
      </div>

      {transporters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("admin_transporters.none_pending")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {transporters.map((transporter) => (
            <Card key={transporter.slug} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {transporter.firstname} {transporter.lastname}
                        </h3>
                        <p className="text-sm text-muted-foreground">{transporter.email}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        {t("moderator_requests.pending")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{transporter.telephone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{transporter.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {transporter.vehicles?.length || 0} {(transporter.vehicles?.length || 0) > 1 ? t("fleet.vehicles") : t("fleet.vehicle_singular")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {transporter.legal_documents?.length || 0} {(transporter.legal_documents?.length || 0) > 1 ? t("admin_transporters.documents_plural") : t("admin_transporters.document_singular")}
                        </span>
                      </div>
                    </div>

                    {transporter.address && (
                      <div className="flex items-start gap-2 text-sm mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{transporter.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(transporter)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("admin_transporters.view_details")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Détails */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin_transporters.transporter_details")}</DialogTitle>
            <DialogDescription>
              {t("admin_transporters.verify_before_approve")}
            </DialogDescription>
          </DialogHeader>

          {selectedTransporter && (
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h3 className="font-semibold mb-3">{t("admin_transporters.personal_info")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("admin_transporters.full_name")}</Label>
                    <p className="text-sm">{selectedTransporter.firstname} {selectedTransporter.lastname}</p>
                  </div>
                  <div>
                    <Label>{t("common.email")}</Label>
                    <p className="text-sm">{selectedTransporter.email}</p>
                  </div>
                  <div>
                    <Label>{t("admin_transporters.phone")}</Label>
                    <p className="text-sm">{selectedTransporter.telephone || "N/A"}</p>
                  </div>
                  <div>
                    <Label>{t("admin_transporters.address")}</Label>
                    <p className="text-sm">{selectedTransporter.address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Véhicules */}
              {selectedTransporter.vehicles && selectedTransporter.vehicles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">{t("fleet.vehicles")} ({selectedTransporter.vehicles.length})</h3>
                  <div className="space-y-3">
                    {selectedTransporter.vehicles.map((vehicle: any, idx: number) => (
                      <Card key={idx} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Truck className="h-5 w-5 text-primary" />
                                <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                                <Badge variant="outline">{vehicle.type}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <span>Plaque: {vehicle.plate_number}</span>
                                <span>Capacité: {vehicle.capacity_kg} kg</span>
                                {vehicle.insurance_expiry && (
                                  <span>Assurance: {new Date(vehicle.insurance_expiry).toLocaleDateString()}</span>
                                )}
                                {vehicle.inspection_expiry && (
                                  <span>Inspection: {new Date(vehicle.inspection_expiry).toLocaleDateString()}</span>
                                )}
                              </div>
                              {vehicle.photo && (
                                <div className="mt-2">
                                  <img
                                    src={vehicle.photo.startsWith('http') ? vehicle.photo : `http://localhost:8000${vehicle.photo}`}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="h-32 w-auto rounded-lg object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents légaux */}
              {selectedTransporter.legal_documents && selectedTransporter.legal_documents.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">{t("admin_transporters.legal_docs")} ({selectedTransporter.legal_documents.length})</h3>
                  <div className="space-y-2">
                    {selectedTransporter.legal_documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{doc.type_doc?.name || "Document"}</p>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        {doc.file && (
                          <a
                            href={doc.file.startsWith('http') ? doc.file : `http://localhost:8000${doc.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {t("admin_transporters.view_doc")}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedTransporter.vehicles || selectedTransporter.vehicles.length === 0) &&
                (!selectedTransporter.legal_documents || selectedTransporter.legal_documents.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{t("admin_transporters.no_docs")}</p>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTransporter(null)
                setRejectReason("")
                setRejectDialogOpen(true)
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t("admin_transporters.reject")}
            </Button>
            <Button
              onClick={() => selectedTransporter && handleApprove(selectedTransporter.slug)}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t("admin_transporters.approve")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin_transporters.reject_title")}</DialogTitle>
            <DialogDescription>
              {t("admin_transporters.reject_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">{t("admin_transporters.reject_reason")}</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Documents incomplets, informations manquantes..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false)
              setRejectReason("")
            }}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={!rejectReason.trim()}
            >
              {t("admin_transporters.send_reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
