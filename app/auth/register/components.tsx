"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, ArrowLeft, ArrowRight, Truck, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { djangoApi } from "@/lib/api/django"

interface VehicleFormStepProps {
  vehicles: Array<{
    type: string
    brand: string
    model: string
    plate_number: string
    capacity_kg: string
    insurance_expiry: string
    inspection_expiry: string
    description: string
    photo: string
  }>
  setVehicles: (vehicles: any) => void
  onBack: () => void
  onSubmit: () => void
  isLoading: boolean
}

export function VehicleFormStep({ vehicles, setVehicles, onBack, onSubmit, isLoading }: VehicleFormStepProps) {
  const [currentVehicle, setCurrentVehicle] = useState({
    type: "",
    brand: "",
    model: "",
    plate_number: "",
    capacity_kg: "",
    insurance_expiry: "",
    inspection_expiry: "",
    description: "",
    photo: "",
  })

  const addVehicle = () => {
    if (!currentVehicle.type || !currentVehicle.brand || !currentVehicle.model || !currentVehicle.plate_number || !currentVehicle.capacity_kg) {
      return
    }
    setVehicles([...vehicles, currentVehicle])
    setCurrentVehicle({
      type: "",
      brand: "",
      model: "",
      plate_number: "",
      capacity_kg: "",
      insurance_expiry: "",
      inspection_expiry: "",
      description: "",
      photo: "",
    })
  }

  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Véhicules ({vehicles.length})
        </h3>
        <Badge variant="outline">Étape 2/3</Badge>
      </div>

      {/* Liste des véhicules ajoutés */}
      {vehicles.length > 0 && (
        <div className="space-y-2">
          {vehicles.map((vehicle, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-sm text-muted-foreground">Plaque: {vehicle.plate_number}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVehicle(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout de véhicule */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de véhicule *</Label>
              <Select value={currentVehicle.type} onValueChange={(v) => setCurrentVehicle({ ...currentVehicle, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUCK">Camion</SelectItem>
                  <SelectItem value="VAN">Fourgon</SelectItem>
                  <SelectItem value="CAR">Voiture</SelectItem>
                  <SelectItem value="MOTORBIKE">Moto</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marque *</Label>
              <Input
                value={currentVehicle.brand}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, brand: e.target.value })}
                placeholder="Ex: Mercedes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modèle *</Label>
              <Input
                value={currentVehicle.model}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                placeholder="Ex: Actros"
              />
            </div>
            <div className="space-y-2">
              <Label>Numéro de plaque *</Label>
              <Input
                value={currentVehicle.plate_number}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, plate_number: e.target.value })}
                placeholder="Ex: AB-1234-CD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Capacité (kg) *</Label>
            <Input
              type="number"
              value={currentVehicle.capacity_kg}
              onChange={(e) => setCurrentVehicle({ ...currentVehicle, capacity_kg: e.target.value })}
              placeholder="Ex: 5000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiration assurance</Label>
              <Input
                type="date"
                value={currentVehicle.insurance_expiry}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, insurance_expiry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Expiration inspection</Label>
              <Input
                type="date"
                value={currentVehicle.inspection_expiry}
                onChange={(e) => setCurrentVehicle({ ...currentVehicle, inspection_expiry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photo du véhicule</Label>
            <FileUpload
              accept="image/*"
              maxSize={5}
              onFileSelect={(url) => setCurrentVehicle({ ...currentVehicle, photo: url })}
              currentFile={currentVehicle.photo}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={currentVehicle.description}
              onChange={(e) => setCurrentVehicle({ ...currentVehicle, description: e.target.value })}
              placeholder="Description du véhicule..."
              rows={2}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addVehicle}
            className="w-full"
            disabled={!currentVehicle.type || !currentVehicle.brand || !currentVehicle.model || !currentVehicle.plate_number || !currentVehicle.capacity_kg}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter ce véhicule
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button type="button" onClick={onSubmit} className="flex-1" disabled={isLoading}>
          Suivant
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

interface DocumentFormStepProps {
  documents: Array<{
    type_doc: string
    file: string
    description: string
  }>
  setDocuments: (documents: any) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function DocumentFormStep({ documents, setDocuments, onBack, onSubmit, isLoading }: DocumentFormStepProps) {
  const [documentTypes, setDocumentTypes] = useState<any[]>([])
  const [currentDocument, setCurrentDocument] = useState({
    type_doc: "",
    file: "",
    description: "",
  })

  // Charger les types de documents
  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const response = await djangoApi.getPublicDocumentTypes()
        if (response.types) {
          setDocumentTypes(response.types)
        } else {
          // Valeurs par défaut si l'endpoint ne fonctionne pas
          setDocumentTypes([
            { slug: "permis", name: "Permis de conduire" },
            { slug: "carte-grise", name: "Carte grise" },
            { slug: "assurance", name: "Assurance" },
            { slug: "autre", name: "Autre" },
          ])
        }
      } catch (error) {
        console.error("Error loading document types:", error)
        // Valeurs par défaut en cas d'erreur
        setDocumentTypes([
          { slug: "permis", name: "Permis de conduire" },
          { slug: "carte-grise", name: "Carte grise" },
          { slug: "assurance", name: "Assurance" },
          { slug: "autre", name: "Autre" },
        ])
      }
    }
    loadDocumentTypes()
  }, [])

  const addDocument = () => {
    if (!currentDocument.type_doc || !currentDocument.file) {
      return
    }
    setDocuments([...documents, currentDocument])
    setCurrentDocument({
      type_doc: "",
      file: "",
      description: "",
    })
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents légaux ({documents.length})
        </h3>
        <Badge variant="outline">Étape 3/3</Badge>
      </div>

      {/* Liste des documents ajoutés */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{doc.type_doc}</p>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout de document */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Type de document *</Label>
            <Select value={currentDocument.type_doc} onValueChange={(v) => setCurrentDocument({ ...currentDocument, type_doc: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permis">Permis de conduire</SelectItem>
                <SelectItem value="carte-grise">Carte grise</SelectItem>
                <SelectItem value="assurance">Assurance</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fichier *</Label>
            <FileUpload
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
              onFileSelect={(url) => setCurrentDocument({ ...currentDocument, file: url })}
              currentFile={currentDocument.file}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={currentDocument.description}
              onChange={(e) => setCurrentDocument({ ...currentDocument, description: e.target.value })}
              placeholder="Description du document..."
              rows={2}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addDocument}
            className="w-full"
            disabled={!currentDocument.type_doc || !currentDocument.file}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter ce document
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button type="submit" onClick={onSubmit} className="flex-1" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer mon compte"}
        </Button>
      </div>
    </div>
  )
}
