"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Building2,
  Eye,
  EyeOff,
  Save,
  Camera,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { djangoApi } from "@/lib/api/django"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TransporterProfilePage() {
  const { user, refreshUser } = useAuth()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPrefLoading, setIsPrefLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [firstName, setFirstName] = useState(user?.profile?.firstname || user?.firstname || "")
  const [lastName, setLastName] = useState(user?.profile?.lastname || user?.lastname || "")
  const [email, setEmail] = useState(user?.profile?.email || user?.email || "")
  const [phone, setPhone] = useState(user?.profile?.telephone || user?.telephone || "")
  const [address, setAddress] = useState(user?.profile?.address || user?.address || "")

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification Preferences
  const [prefs, setPrefs] = useState({
    new_missions: true,
    sms_notifications: true,
    mission_updates: true,
    vehicle_reminders: true
  })

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const response = await djangoApi.getNotificationPreferences()
        if (response.preferences) {
          setPrefs(response.preferences)
        }
      } catch (error) {
        console.error("Error fetching preferences:", error)
      }
    }
    if (user?.id) fetchPrefs()
  }, [user?.id])

  const handleUpdatePrefs = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value }
    setPrefs(newPrefs)
    setIsPrefLoading(true)
    try {
      await djangoApi.updateNotificationPreferences(newPrefs)
    } catch (error) {
      console.error("Error updating preferences:", error)
    } finally {
      setIsPrefLoading(false)
    }
  }

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "TR"
  const fullName = `${firstName} ${lastName}`.trim() || "Transporteur"

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await djangoApi.updateProfile({
        firstname: firstName,
        lastname: lastName,
        telephone: phone,
        address,
      })

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Profil mis à jour avec succès")
        refreshUser()
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await djangoApi.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      })

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Mot de passe mis à jour avec succès")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("transporter_profile.title")}</h1>
        <p className="text-muted-foreground">{t("transporter_profile.subtitle")}</p>
      </div>

      {/* Profile header */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                {initials}
              </div>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80 text-foreground"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                <Badge className="bg-success/20 text-success">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              </div>
              <p className="text-muted-foreground">Transporteur depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="text-sm font-medium text-foreground">4.9</span>
                  <span className="text-sm text-muted-foreground">(156 avis)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">156 missions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {success && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start bg-secondary overflow-x-auto">
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Informations
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Entreprise
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sécurité
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Prénom</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Nom</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-input border-border text-foreground opacity-60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informations entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-foreground">Nom de l'entreprise</Label>
                <Input defaultValue="Transport Express" className="bg-input border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Numéro RCCM</Label>
                <Input defaultValue="RB-COT-01-XXXX-XXXX" className="bg-input border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Adresse du siège</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    defaultValue="123 Boulevard de la Marina, Cotonou"
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sécurité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-foreground">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10 bg-input border-border text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Nouveau mot de passe</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Confirmer</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Préférences de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "new_missions", label: "Nouvelles missions", description: "Être notifié des nouvelles missions disponibles" },
                { id: "sms_notifications", label: "Notifications SMS", description: "Recevoir les alertes par SMS" },
                { id: "mission_updates", label: "Mises à jour missions", description: "Changements de statut de vos missions" },
                { id: "vehicle_reminders", label: "Rappels véhicules", description: "Alertes assurance et visite technique" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch 
                    checked={(prefs as any)[item.id]} 
                    onCheckedChange={(checked) => handleUpdatePrefs(item.id, checked)}
                    disabled={isPrefLoading}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
