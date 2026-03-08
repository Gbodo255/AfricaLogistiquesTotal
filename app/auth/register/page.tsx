"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  Plus,
  X,
  ArrowRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { djangoApi } from "@/lib/api/django"
import { FileUpload } from "@/components/ui/file-upload"
import { useLanguage } from "@/lib/i18n/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { VehicleFormStep, DocumentFormStep } from "./components"

function RegisterForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "client"

  const [showPassword, setShowPassword] = useState(false)
  const [userRole, setUserRole] = useState(defaultRole)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [companyName, setCompanyName] = useState("")

  // Pour transporteur : véhicules et documents
  const [vehicles, setVehicles] = useState<Array<{
    type: string
    brand: string
    model: string
    plate_number: string
    capacity_kg: string
    insurance_expiry: string
    inspection_expiry: string
    description: string
    photo: string
  }>>([])
  const [documents, setDocuments] = useState<Array<{
    type_doc: string
    file: string
    description: string
  }>>([])
  const [currentStep, setCurrentStep] = useState<"info" | "vehicles" | "documents">("info")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    // Simplified password validation: 5+ characters, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{5,}$/
    if (!passwordRegex.test(password)) {
      setError(t("auth.error.password_length"))
      setIsLoading(false)
      return
    }

    // Si transporteur et qu'on n'est pas à l'étape finale, passer à l'étape suivante
    if (userRole === "transporter") {
      if (currentStep === "info") {
        // Vérifier les champs obligatoires
        if (!firstName || !lastName || !email || !password) {
          setError("Veuillez remplir tous les champs obligatoires")
          setIsLoading(false)
          return
        }
        setCurrentStep("vehicles")
        setIsLoading(false)
        return
      } else if (currentStep === "vehicles") {
        setCurrentStep("documents")
        setIsLoading(false)
        return
      }
      // currentStep === "documents" : on peut maintenant s'inscrire
    }

    const role = userRole === "transporter" ? "TRANSPORTEUR" : (userRole === "client" ? "PARTICULIER" : "PARTICULIER")

    // Utiliser l'API Django pour l'inscription
    try {
      const registerData: any = {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        role,
        telephone: phone || undefined,
        address: undefined,
      }

      // Si transporteur, ajouter véhicules et documents
      if (userRole === "transporter") {
        registerData.vehicles = vehicles.map(v => ({
          type: v.type,
          brand: v.brand,
          model: v.model,
          plate_number: v.plate_number,
          capacity_kg: parseFloat(v.capacity_kg),
          insurance_expiry: v.insurance_expiry || undefined,
          inspection_expiry: v.inspection_expiry || undefined,
          description: v.description || undefined,
          photo: v.photo || undefined,
          ext: v.photo?.split('.').pop()?.split('?')[0] || 'jpg',
        }))

        registerData.documents = documents.map(d => ({
          type_doc: d.type_doc,
          file: d.file,
          description: d.description || undefined,
          ext: d.file?.split('.').pop()?.split('?')[0] || 'pdf',
        }))
      }

      const response = await djangoApi.register(registerData)

      if (response.error) {
        setError(response.error)
        setIsLoading(false)
        return
      }

      // Succès
      if (userRole === "transporter") {
        setSuccess("Votre demande a été soumise. Un administrateur va vérifier vos documents. Vous devez d'abord vérifier votre email.")
        setTimeout(() => {
          router.push(`/auth/verify?slug=${response.user.slug}`)
        }, 2000)
      } else {
        setSuccess("Compte créé avec succès ! Redirection vers la page de vérification...")
        setTimeout(() => {
          router.push(`/auth/verify?slug=${response.user.slug}`)
        }, 2000)
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Erreur lors de l'inscription")
      setIsLoading(false)
      return
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Link>

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <div className="mb-2 lg:hidden">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Créer un compte</CardTitle>
          <CardDescription className="text-muted-foreground">
            Remplissez le formulaire pour créer votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role selection */}
            <div className="space-y-3">
              <Label className="text-foreground">Je suis</Label>
              <RadioGroup value={userRole} onValueChange={setUserRole} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="client" id="client" className="peer sr-only" />
                  <Label
                    htmlFor="client"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-border bg-card p-4 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <User className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">Client</span>
                    <span className="text-xs text-muted-foreground mt-1">Expédier des marchandises</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="transporter" id="transporter" className="peer sr-only" />
                  <Label
                    htmlFor="transporter"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-border bg-card p-4 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <Building2 className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">Transporteur</span>
                    <span className="text-xs text-muted-foreground mt-1">Effectuer des livraisons</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jean"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {userRole === "transporter" && (
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">
                  Nom de l'entreprise (optionnel)
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Transport Express SARL"
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{t("profile.password_requirements")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Étape 1 : Informations de base */}
            {currentStep === "info" && (
              <>
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-xs text-muted-foreground">
                    J'accepte les{" "}
                    <Link href="/legal/cgu" className="text-primary hover:underline">
                      Conditions d'utilisation
                    </Link>{" "}
                    et les{" "}
                    <Link href="/legal/cgv" className="text-primary hover:underline">
                      CGV
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || !!success}
                >
                  {isLoading ? "Vérification..." : userRole === "transporter" ? "Suivant" : "Créer mon compte"}
                </Button>
              </>
            )}

            {/* Étape 2 : Véhicules (Transporteur uniquement) */}
            {currentStep === "vehicles" && userRole === "transporter" && (
              <VehicleFormStep
                vehicles={vehicles}
                setVehicles={setVehicles}
                onBack={() => setCurrentStep("info")}
                onSubmit={() => setCurrentStep("documents")}
                isLoading={isLoading}
              />
            )}

            {/* Étape 3 : Documents (Transporteur uniquement) */}
            {currentStep === "documents" && userRole === "transporter" && (
              <DocumentFormStep
                documents={documents}
                setDocuments={setDocuments}
                onBack={() => setCurrentStep("vehicles")}
                onSubmit={handleRegister}
                isLoading={isLoading}
              />
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
          <p className="text-sm text-center text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Rejoignez la révolution logistique africaine
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Créez votre compte en quelques minutes et commencez à utiliser la plateforme dès aujourd'hui.
            </p>
            <div className="space-y-4">
              {[
                "Inscription gratuite et rapide",
                "Accès immédiat à la plateforme",
                "Support disponible 24/7",
                "Paiements sécurisés",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Africa Logistics. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <Suspense fallback={<div className="text-muted-foreground">Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
