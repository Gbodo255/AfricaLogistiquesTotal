"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Car,
  Plus,
  Truck,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
  File,
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useAuth } from "@/lib/auth/context"
import {
  useVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  addVehicleDocument,
  updateVehicleDocument,
  removeVehicleDocument,
} from "@/lib/hooks/use-vehicles"
import { FileUpload } from "@/components/ui/file-upload"
import { getFileUrl } from "@/lib/utils/storage"
import { useLanguage } from "@/lib/i18n/context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function FleetPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const { data: vehicles, isLoading, mutate } = useVehicles(user?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<{ slug: string; [key: string]: any } | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<{ slug: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [selectedVehicleForDocument, setSelectedVehicleForDocument] = useState<{ slug: string } | null>(null)
  const [editingDocument, setEditingDocument] = useState<{ url: string; vehicleSlug: string; docSlug?: string } | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [documentFile, setDocumentFile] = useState<{ url: string; name: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    brand: "",
    model: "",
    plate_number: "",
    capacity_kg: "",
    insurance_expiry: "",
    inspection_expiry: "",
    photo_url: "",
  })

  const resetForm = () => {
    setFormData({
      type: "",
      brand: "",
      model: "",
      plate_number: "",
      capacity_kg: "",
      insurance_expiry: "",
      inspection_expiry: "",
      photo_url: "",
    })
    setEditingVehicle(null)
  }

  // Charger les données du véhicule en cours d'édition
  useEffect(() => {
    if (editingVehicle && vehicles) {
      const vehicle = vehicles.find((v: any) => v.slug === editingVehicle.slug)
      if (vehicle) {
        setFormData({
          type: vehicle.type || "",
          brand: vehicle.brand || "",
          model: vehicle.model || "",
          plate_number: vehicle.plate_number || "",
          capacity_kg: vehicle.capacity_kg?.toString() || "",
          insurance_expiry: vehicle.insurance_expiry || "",
          inspection_expiry: vehicle.inspection_expiry || "",
          photo_url: vehicle.photo || "",
        })
      }
    }
  }, [editingVehicle, vehicles])

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    console.log("FleetPage: Starting handleSubmit", { editingVehicle, formData })
    
    try {
      const vehicleData: any = {
        type: formData.type as any,
        brand: formData.brand,
        model: formData.model,
        plate_number: formData.plate_number,
        capacity_kg: formData.capacity_kg ? Number.parseFloat(formData.capacity_kg) : null,
        insurance_expiry: formData.insurance_expiry || null,
        inspection_expiry: formData.inspection_expiry || null,
        photo_url: formData.photo_url || null,
      }

      if (editingVehicle) {
        console.log("FleetPage: Updating vehicle", editingVehicle.slug, vehicleData)
        await updateVehicle(editingVehicle.slug, vehicleData)
        toast({
          title: "Succès",
          description: "Véhicule mis à jour avec succès",
        })
      } else {
        console.log("FleetPage: Creating new vehicle", vehicleData)
        await createVehicle(vehicleData)
        toast({
          title: "Succès",
          description: "Véhicule ajouté avec succès",
        })
      }
      
      console.log("FleetPage: Mutating vehicles list")
      await mutate()
      setDialogOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("FleetPage: Error saving vehicle:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (vehicle: any) => {
    console.log("FleetPage: Editing vehicle", vehicle)
    setEditingVehicle({ slug: vehicle.slug, ...vehicle })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedVehicle) {
      console.log("FleetPage: No vehicle selected for deletion")
      return
    }

    console.log("FleetPage: Deleting vehicle", selectedVehicle)
    try {
      await deleteVehicle(selectedVehicle)
      console.log("FleetPage: Delete successful, mutating list")
      await mutate()
      toast({
        title: "Succès",
        description: "Véhicule supprimé avec succès",
      })
      setDeleteDialogOpen(false)
      setSelectedVehicle(null)
    } catch (error) {
      console.error("FleetPage: Error deleting vehicle:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive",
      })
    }
  }

  const handleAddDocument = async () => {
    if (!selectedVehicleForDocument || !documentType || !documentFile) return

    try {
      if (editingDocument && editingDocument.docSlug) {
        await updateVehicleDocument(selectedVehicleForDocument.slug, editingDocument.docSlug, {
          type: documentType,
          name: documentFile.name,
          url: documentFile.url,
          uploadedAt: new Date().toISOString(),
        })
        toast({
          title: "Succès",
          description: "Document mis à jour",
        })
      } else {
        await addVehicleDocument(selectedVehicleForDocument.slug, {
          type: documentType,
          name: documentFile.name,
          url: documentFile.url,
          uploadedAt: new Date().toISOString(),
        })
        toast({
          title: "Succès",
          description: "Document ajouté",
        })
      }
      await mutate()
      setDocumentDialogOpen(false)
      setSelectedVehicleForDocument(null)
      setEditingDocument(null)
      setDocumentType("")
      setDocumentFile(null)
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document",
        variant: "destructive",
      })
    }
  }

  const handleEditDocument = (vehicleSlug: string, document: any) => {
    setSelectedVehicleForDocument({ slug: vehicleSlug })
    setEditingDocument({ url: document.file || document.url, vehicleSlug, docSlug: document.slug })
    setDocumentType(document.document_type || document.type)
    setDocumentFile({ url: document.file || document.url, name: document.name })
    setDocumentDialogOpen(true)
  }

  const handleRemoveDocument = async (vehicleSlug: string, docSlug: string) => {
    try {
      await removeVehicleDocument(vehicleSlug, docSlug)
      await mutate()
      toast({
        title: "Succès",
        description: "Document supprimé",
      })
    } catch (error) {
      console.error("Error removing document:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      })
    }
  }

  // Calculate stats
  const totalVehicles = vehicles?.length || 0
  const activeVehicles = vehicles?.filter((v) => v.status === 'ACTIVE').length || 0
  const maintenanceVehicles = vehicles?.filter((v) => v.status === 'MAINTENANCE').length || 0

  // Check for expiring documents
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const expiringDocuments = vehicles?.filter((v) => {
    const insuranceExpiry = v.insurance_expiry ? new Date(v.insurance_expiry) : null
    const inspectionExpiry = v.inspection_expiry ? new Date(v.inspection_expiry) : null
    return (
      (insuranceExpiry && insuranceExpiry <= thirtyDaysFromNow) ||
      (inspectionExpiry && inspectionExpiry <= thirtyDaysFromNow)
    )
  })

  const documentTypes = [
    { value: "INSURANCE", label: "Assurance" },
    { value: "REGISTRATION", label: "Carte grise" },
    { value: "LICENSE", label: "Permis de conduire" },
    { value: "INSPECTION", label: "Visite technique" },
    { value: "OTHER", label: "Autre" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("fleet.title")}</h1>
          <p className="text-muted-foreground">{t("fleet.subtitle")}</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              {t("fleet.add_vehicle")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingVehicle ? t("fleet.edit_vehicle") : t("fleet.add_vehicle")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("fleet.vehicle_info")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Photo upload */}
              <FileUpload
                accept="image/*"
                maxSize={5}
                label={t("fleet.photo")}
                description={t("fleet.photo_desc")}
                onFileSelect={(url, name) => setFormData({ ...formData, photo_url: url })}
                currentFile={formData.photo_url}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.type")}</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder={t("fleet.select_type")} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="TRUCK">{t("fleet.type_truck")}</SelectItem>
                      <SelectItem value="VAN">{t("fleet.type_van")}</SelectItem>
                      <SelectItem value="CAR">{t("fleet.type_pickup")}</SelectItem>
                      <SelectItem value="MOTORBIKE">Moto</SelectItem>
                      <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.brand")}</Label>
                  <Input
                    className="bg-input border-border text-foreground"
                    placeholder="Ex: Mercedes"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.model")}</Label>
                  <Input
                    className="bg-input border-border text-foreground"
                    placeholder="Ex: Actros"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.plate")}</Label>
                  <Input
                    className="bg-input border-border text-foreground"
                    placeholder="XX-XXXX-XX"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">{t("fleet.capacity")} (kg)</Label>
                <Input
                  type="number"
                  className="bg-input border-border text-foreground"
                  placeholder="Ex: 10000"
                  value={formData.capacity_kg}
                  onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.insurance")}</Label>
                  <Input
                    type="date"
                    className="bg-input border-border text-foreground"
                    value={formData.insurance_expiry}
                    onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("fleet.inspection")}</Label>
                  <Input
                    type="date"
                    className="bg-input border-border text-foreground"
                    value={formData.inspection_expiry}
                    onChange={(e) => setFormData({ ...formData, inspection_expiry: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
                className="border-border text-foreground bg-transparent"
              >
                {t("fleet.cancel")}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.type || !formData.brand || !formData.plate_number}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? t("fleet.saving") : editingVehicle ? t("fleet.save") : t("fleet.add")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{totalVehicles}</p>
            <p className="text-sm text-muted-foreground">{t("fleet.total")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{activeVehicles}</p>
            <p className="text-sm text-muted-foreground">{t("fleet.active")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">{maintenanceVehicles}</p>
            <p className="text-sm text-muted-foreground">{t("fleet.maintenance")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{expiringDocuments?.length || 0}</p>
            <p className="text-sm text-muted-foreground">{t("fleet.alerts")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !vehicles || vehicles.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("fleet.no_vehicles")}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t("fleet.no_vehicles_desc")}
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("fleet.add_vehicle")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => {
            const vehicleDocuments = Array.isArray(vehicle.documents) ? vehicle.documents : []
            const photoUrl = vehicle.photo ? (vehicle.photo.startsWith('http') ? vehicle.photo : `http://localhost:8000${vehicle.photo}`) : null

            return (
              <Card key={vehicle.slug} className="border-border bg-card">
                <CardContent className="p-6">
                  {/* Photo du véhicule */}
                  {photoUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <div className="relative aspect-video w-full">
                        <img
                          src={photoUrl}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {!photoUrl && (
                        <div
                          className={`h-14 w-14 rounded-xl flex items-center justify-center ${vehicle.status === 'ACTIVE' ? "bg-success/10" : "bg-warning/10"}`}
                        >
                          {vehicle.type === "TRUCK" || vehicle.type === "truck" ? (
                            <Truck
                              className={`h-7 w-7 ${vehicle.status === 'ACTIVE' ? "text-success" : "text-warning"}`}
                            />
                          ) : (
                            <Car
                              className={`h-7 w-7 ${vehicle.status === 'ACTIVE' ? "text-success" : "text-warning"}`}
                            />
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">{vehicle.plate_number}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        vehicle.status === 'ACTIVE'
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      }
                    >
                      {vehicle.status === 'ACTIVE' ? t("fleet.available") : t("fleet.unavailable")}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("fleet.type_label")}</span>
                      <span className="text-foreground capitalize">
                        {vehicle.type === "TRUCK" || vehicle.type === "truck" ? t("fleet.type_truck") : 
                         vehicle.type === "VAN" || vehicle.type === "van" ? t("fleet.type_van") : 
                         vehicle.type === "CAR" || vehicle.type === "car" ? t("fleet.type_pickup") : 
                         vehicle.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("fleet.capacity_label")}</span>
                      <span className="text-foreground">
                        {vehicle.capacity_kg ? `${vehicle.capacity_kg} kg` : t("fleet.not_specified")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t("fleet.insurance_label")}
                      </span>
                      <span className="text-foreground">
                        {vehicle.insurance_expiry
                          ? new Date(vehicle.insurance_expiry).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")
                          : t("fleet.not_specified")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("fleet.inspection_label")}
                      </span>
                      <span className="text-foreground">
                        {vehicle.inspection_expiry
                          ? new Date(vehicle.inspection_expiry).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")
                          : t("fleet.not_specified")}
                      </span>
                    </div>
                  </div>

                  {/* Documents section */}
                  <div className="mb-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t("fleet.documents")} ({vehicleDocuments.length})
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 border-border text-foreground bg-transparent"
                        onClick={() => {
                          setSelectedVehicleForDocument({ slug: vehicle.slug })
                          setEditingDocument(null)
                          setDocumentType("")
                          setDocumentFile(null)
                          setDocumentDialogOpen(true)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        {t("fleet.add_document")}
                      </Button>
                    </div>

                    {vehicleDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {vehicleDocuments.map((doc: any, index: number) => {
                          const docUrl = doc.file ? (doc.file.startsWith('http') ? doc.file : `http://localhost:8000${doc.file}`) : null
                          const isPdf = docUrl?.includes("pdf") || doc.document_type === "application/pdf"
                          const docTypeLabel =
                            documentTypes.find((dt) => dt.value === (doc.document_type || doc.type))?.label || (doc.document_type || doc.type)

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {isPdf ? (
                                  <File className="h-4 w-4 text-destructive shrink-0" />
                                ) : (
                                  <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">{doc.name || 'Document'}</p>
                                  <p className="text-xs text-muted-foreground">{docTypeLabel}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditDocument(vehicle.slug, doc)}
                                  title={t("fleet.edit")}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                {docUrl && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const link = document.createElement("a")
                                      link.href = docUrl
                                      link.download = doc.name
                                      link.target = "_blank"
                                      link.click()
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveDocument(vehicle.slug, doc.slug)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        {t("fleet.no_documents")}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 border-border text-foreground bg-transparent"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit2 className="h-4 w-4" />
                      {t("fleet.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 border-primary/50 text-primary bg-transparent hover:bg-primary/10"
                      onClick={() => {
                        setSelectedVehicleForDocument({ slug: vehicle.slug })
                        setEditingDocument(null)
                        setDocumentType("")
                        setDocumentFile(null)
                        setDocumentDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {t("fleet.documents")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-destructive/50 text-destructive bg-transparent hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedVehicle({ slug: vehicle.slug })
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Alerts */}
      {expiringDocuments && expiringDocuments.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {t("fleet.alerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringDocuments.map((vehicle) => (
              <div
                key={vehicle.slug}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("fleet.expiring_docs")}</p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.brand} {vehicle.model} - {vehicle.plate_number}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-warning text-warning bg-transparent hover:bg-warning/10"
                  onClick={() => handleEdit(vehicle)}
                >
                  {t("fleet.update_doc")}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Document Dialog */}
      <Dialog
        open={documentDialogOpen}
        onOpenChange={(open) => {
          setDocumentDialogOpen(open)
          if (!open) {
            setSelectedVehicleForDocument(null)
            setEditingDocument(null)
            setDocumentType("")
            setDocumentFile(null)
          }
        }}
      >
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingDocument ? t("fleet.update_doc") : t("fleet.add_document_title")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("fleet.add_document_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t("fleet.document_type")}</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder={t("fleet.document_type")} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FileUpload
              accept=".pdf,application/pdf,image/*"
              maxSize={10}
              label={t("fleet.document_file")}
              description={t("fleet.document_file_desc")}
              onFileSelect={(url, name) => setDocumentFile({ url, name })}
              currentFile={documentFile?.url}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDocumentDialogOpen(false)
                setSelectedVehicleForDocument(null)
                setEditingDocument(null)
                setDocumentType("")
                setDocumentFile(null)
              }}
              className="border-border text-foreground bg-transparent"
            >
              {t("fleet.cancel")}
            </Button>
            <Button
              onClick={handleAddDocument}
              disabled={!documentType || !documentFile}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {editingDocument ? t("fleet.save") : t("fleet.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t("fleet.delete_confirm")}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t("fleet.delete_desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground bg-transparent">
              {t("fleet.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t("fleet.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
