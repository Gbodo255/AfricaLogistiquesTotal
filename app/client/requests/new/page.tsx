"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Package, Truck, Calendar, Wallet, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useWallet } from "@/lib/hooks/use-wallet"
import { createTransportRequest } from "@/lib/hooks/use-transport-requests"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/i18n/context"

// transportTypes will be defined inside component to use translations

const weightRanges = [
  { value: "50", label: "0 - 50 kg", cost: 15000 },
  { value: "200", label: "50 - 200 kg", cost: 25000 },
  { value: "500", label: "200 - 500 kg", cost: 45000 },
  { value: "1000", label: "500 kg - 1 tonne", cost: 75000 },
  { value: "2000", label: "Plus de 1 tonne", cost: 120000 },
]

export default function NewRequestPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: wallet } = useWallet(user?.id)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    transportType: "",
    from: "",
    to: "",
    weight: "",
    description: "",
    pickupDate: "",
    deliveryDate: "",
    recipientName: "",
    recipientPhone: "",
  })

  const transportTypes = [
    { id: "general", label: t("requests.transport_type.general"), description: t("requests.transport_type.general_desc") },
    { id: "agricultural", label: t("requests.transport_type.agricultural"), description: t("requests.transport_type.agricultural_desc") },
    { id: "construction", label: t("requests.transport_type.construction"), description: t("requests.transport_type.construction_desc") },
    { id: "fragile", label: t("requests.transport_type.fragile"), description: t("requests.transport_type.fragile_desc") },
  ]

  const walletBalance = wallet?.balance || 0
  const selectedWeight = weightRanges.find((w) => w.value === formData.weight)
  const estimatedCost = selectedWeight?.cost || 0

  const handleSubmit = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const pickupIso = formData.pickupDate
        ? new Date(`${formData.pickupDate}T10:00:00`).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await createTransportRequest({
        title: transportTypes.find((t) => t.id === formData.transportType)?.label || "Demande de transport",
        merchandise_type: "GENERAL",
        merchandise_description: formData.description || "Marchandise",
        pickup_address: formData.from,
        pickup_city: formData.from,
        delivery_address: formData.to,
        delivery_city: formData.to,
        weight: Number.parseFloat(formData.weight) || 0,
        volume: 1,
        preferred_pickup_date: pickupIso,
        preferred_delivery_date: formData.deliveryDate ? new Date(`${formData.deliveryDate}T18:00:00`).toISOString() : null,
        priority: "NORMAL",
        recipient_name: formData.recipientName,
        recipient_phone: formData.recipientPhone,
        estimated_price: estimatedCost,
      })

      router.push("/client/requests")
    } catch (err) {
      setError(t("requests.error"))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/client/requests">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{"Nouvelle demande"}</h1>
          <p className="text-muted-foreground">{"Créez une demande de transport"}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`}
          />
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Wallet check */}
      {walletBalance < estimatedCost && estimatedCost > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{"Solde insuffisant"}</p>
              <p className="text-xs text-muted-foreground">
                {t("wallet.insufficient_desc").replace("{balance}", walletBalance.toLocaleString())}
              </p>
            </div>
            <Link href="/client/wallet">
              <Button size="sm" variant="destructive">
                {"Recharger"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Transport type & Route */}
      {step === 1 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t("requests.transport_and_route")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("requests.transport_and_route_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground">{t("requests.transport_type_label")}</Label>
              <RadioGroup
                value={formData.transportType}
                onValueChange={(v) => setFormData({ ...formData, transportType: v })}
                className="grid sm:grid-cols-2 gap-3"
              >
                {transportTypes.map((type) => (
                  <div key={type.id}>
                    <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                    <Label
                      htmlFor={type.id}
                      className="flex flex-col p-4 rounded-xl border-2 border-border bg-card hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <span className="font-medium text-foreground">{type.label}</span>
                      <span className="text-xs text-muted-foreground mt-1">{type.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-foreground">
                  {t("requests.pickup_point")}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="from"
                    placeholder="Ex: Cotonou, Bénin"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to" className="text-foreground">
                  {t("requests.destination")}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="to"
                    placeholder="Ex: Lomé, Togo"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!formData.transportType || !formData.from || !formData.to}
            >
              {t("requests.continue")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {t("requests.cargo_details_title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("requests.cargo_details_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-foreground">
                {t("requests.estimated_weight")}
              </Label>
              <Select onValueChange={(v) => setFormData({ ...formData, weight: v })} value={formData.weight}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder={t("requests.select_weight")} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {weightRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                {t("requests.cargo_description_label")}
              </Label>
              <Textarea
                id="description"
                placeholder={t("requests.cargo_description_label")}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input border-border text-foreground min-h-[100px]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="text-foreground">
                  {"Nom du destinataire"}
                </Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="bg-input border-border text-foreground"
                  placeholder="Ex: Marie Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone" className="text-foreground">
                  {"Téléphone du destinataire"}
                </Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  className="bg-input border-border text-foreground"
                  placeholder="Ex: +229XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate" className="text-foreground">
                  {t("requests.pickup_date_label")}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="text-foreground">
                  {t("requests.delivery_date_label")}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-border text-foreground bg-transparent"
              >
                {t("requests.previous")}
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!formData.weight || !formData.recipientName || !formData.recipientPhone}
              >
                {t("requests.continue")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {t("requests.confirmation")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("requests.confirmation_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("requests.type")}</span>
                <span className="text-foreground font-medium">
                  {transportTypes.find((t) => t.id === formData.transportType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("requests.route")}</span>
                <span className="text-foreground font-medium">
                  {formData.from} → {formData.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("requests.weight_label")}</span>
                <span className="text-foreground font-medium">
                  {weightRanges.find((w) => w.value === formData.weight)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("requests.pickup_date_label_short")}</span>
                <span className="text-foreground font-medium">{formData.pickupDate || "Non spécifié"}</span>
              </div>
              {formData.description && (
                <div className="pt-2 border-t border-border">
                  <span className="text-muted-foreground text-sm">{t("requests.description_label")}:</span>
                  <p className="text-foreground text-sm mt-1">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Cost & Wallet */}
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{t("requests.cost_estimation")}</span>
                </div>
                <span className="text-2xl font-bold text-primary">{estimatedCost.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("requests.available_balance")}</span>
                <span className={walletBalance >= estimatedCost ? "text-success" : "text-destructive"}>
                  {walletBalance.toLocaleString()} FCFA
                </span>
              </div>
              {walletBalance >= estimatedCost && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t("requests.amount_reserved")}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 border-border text-foreground bg-transparent"
              >
                {t("requests.back")}
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || walletBalance < estimatedCost}
              >
                {isLoading ? t("requests.submitting") : t("requests.submit")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
