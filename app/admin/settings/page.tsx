"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Bell, Shield, CreditCard, Mail, Globe, Percent, Save, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function AdminSettingsPage() {
  const { t } = useLanguage()
  const [commissionRate, setCommissionRate] = useState("15")
  const [penaltyRate, setPenaltyRate] = useState("10")
  const [minWalletBalance, setMinWalletBalance] = useState("5000")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoApproveTransporters, setAutoApproveTransporters] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin_settings.title")}</h1>
        <p className="text-muted-foreground">{t("admin_settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("admin_settings.general")}
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {t("admin_settings.finance")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t("admin_settings.notifications")}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t("admin_settings.security")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{t("admin_settings.general_info")}</CardTitle>
              <CardDescription className="text-muted-foreground">{t("admin_settings.general_info_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("admin_settings.platform_name")}</Label>
                  <Input defaultValue="Africa Logistique" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("admin_settings.contact_email")}</Label>
                  <Input defaultValue="contact@africa-projectbj.com" className="bg-background border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">{t("admin_settings.description")}</Label>
                <Textarea
                  defaultValue="Plateforme intelligente de gestion du transport de marchandises en Afrique de l'Ouest"
                  className="bg-background border-border min-h-20"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("admin_settings.default_language")}</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">{t("admin_settings.french")}</SelectItem>
                      <SelectItem value="en">{t("admin_settings.english")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("admin_settings.timezone")}</Label>
                  <Select defaultValue="africa">
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa">Africa/Abidjan (GMT+0)</SelectItem>
                      <SelectItem value="paris">Europe/Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="font-medium text-foreground">Mode maintenance</p>
                  <p className="text-sm text-muted-foreground">
                    Désactive l'accès à la plateforme pour les utilisateurs
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Pays couverts</CardTitle>
              <CardDescription className="text-muted-foreground">
                Zones géographiques où la plateforme opère
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Côte d'Ivoire", "Sénégal", "Ghana", "Mali", "Burkina Faso", "Togo", "Bénin", "Niger"].map(
                  (country) => (
                    <div
                      key={country}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                    >
                      <Globe className="h-3 w-3 text-primary" />
                      <span className="text-sm text-foreground">{country}</span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Paramètres financiers</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configuration des commissions et pénalités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Taux de commission (%)
                  </Label>
                  <Input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">Commission prélevée sur chaque transaction</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Taux de pénalité (%)
                  </Label>
                  <Input
                    type="number"
                    value={penaltyRate}
                    onChange={(e) => setPenaltyRate(e.target.value)}
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">Pénalité en cas d'annulation tardive</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Solde minimum portefeuille (FCFA)</Label>
                <Input
                  type="number"
                  value={minWalletBalance}
                  onChange={(e) => setMinWalletBalance(e.target.value)}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">Solde requis pour créer une demande de transport</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Méthodes de paiement</CardTitle>
              <CardDescription className="text-muted-foreground">Options de paiement activées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Mobile Money (Orange, MTN, Moov)", enabled: true },
                { name: "Carte bancaire", enabled: true },
                { name: "Virement bancaire", enabled: true },
                { name: "Wave", enabled: false },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{method.name}</span>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Paramètres de notification</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configuration des alertes et notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Envoi d'emails pour les événements importants</p>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium text-foreground">Notifications SMS</p>
                    <p className="text-sm text-muted-foreground">Envoi de SMS pour les alertes urgentes</p>
                  </div>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Paramètres de sécurité</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configuration de la sécurité et des accès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Approbation automatique des transporteurs</p>
                  <p className="text-sm text-muted-foreground">Activer les comptes transporteurs automatiquement</p>
                </div>
                <Switch checked={autoApproveTransporters} onCheckedChange={setAutoApproveTransporters} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Requise pour les administrateurs</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Journalisation des actions</p>
                  <p className="text-sm text-muted-foreground">Enregistrer toutes les actions administratives</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="gap-2 border-border bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  )
}
