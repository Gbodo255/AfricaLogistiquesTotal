"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Smartphone,
  History,
  TrendingUp,
  AlertCircle,
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
import { useAuth } from "@/lib/auth/context"
import { useWallet, useTransactions, topupWallet } from "@/lib/hooks/use-wallet"
import { useLanguage } from "@/lib/i18n/context"

const quickAmounts = [10000, 25000, 50000, 100000]

export default function WalletPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: wallet, mutate: mutateWallet } = useWallet(user?.id)
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(wallet?.id)

  const [rechargeAmount, setRechargeAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("mobile_money")
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const balance = wallet?.balance || 0

  // Calculate monthly totals
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyTransactions =
    transactions?.filter((tx) => {
      const txDate = new Date(tx.created_at)
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    }) || []

  const monthlyCredits = monthlyTransactions
    .filter((tx: any) => tx.tx_type === "CREDIT")
    .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0)

  const monthlyDebits = monthlyTransactions
    .filter((tx: any) => tx.tx_type !== "CREDIT")
    .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0)

  const handleRecharge = async () => {
    if (!rechargeAmount) return

    setIsLoading(true)
    try {
      await topupWallet(Number.parseInt(rechargeAmount), `Rechargement ${paymentMethod === "mobile_money" ? "Mobile Money" : "Carte bancaire"}`)
      mutateWallet()
      setDialogOpen(false)
      setRechargeAmount("")
    } catch (error) {
      console.error("Error recharging wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portefeuille</h1>
        <p className="text-muted-foreground">Gérez votre solde et vos transactions</p>
      </div>

      {/* Balance cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solde disponible</p>
                <p className="text-4xl font-bold text-foreground">{balance.toLocaleString()} FCFA</p>
                {monthlyCredits > 0 && (
                  <p className="text-sm text-success mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />+{monthlyCredits.toLocaleString()} FCFA ce mois
                  </p>
                )}
              </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wallet className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Plus className="h-4 w-4" />
                    {"Recharger"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{t("wallet.recharge_title")}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {t("wallet.recharge_desc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label className="text-foreground">{t("wallet.quick_amount")}</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            className={`border-border text-foreground hover:bg-secondary bg-transparent ${rechargeAmount === amount.toString() ? "border-primary bg-primary/10" : ""}`}
                            onClick={() => setRechargeAmount(amount.toString())}
                          >
                            {(amount / 1000).toFixed(0)}K
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-foreground">
                        {t("wallet.custom_amount")} (FCFA)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder={t("wallet.custom_amount")}
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">{t("wallet.payment_method")}</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="mobile_money" id="mobile_money" />
                          <Label htmlFor="mobile_money" className="flex-1 cursor-pointer flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Mobile Money</p>
                              <p className="text-xs text-muted-foreground">MTN, Moov, Orange</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{t("wallet.bank_card")}</p>
                              <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="border-border text-foreground bg-transparent"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleRecharge}
                      disabled={!rechargeAmount || isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading
                        ? t("wallet.processing")
                        : rechargeAmount
                          ? t("wallet.recharge_amount").replace("{amount}", Number(rechargeAmount).toLocaleString())
                          : "Recharger"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent gap-2"
              >
                <History className="h-4 w-4" />
                Historique
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Ce mois</p>
              <Badge variant="outline" className="border-primary text-primary">
                {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">Entrées</span>
                </div>
                <span className="font-semibold text-success">+{monthlyCredits.toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">Sorties</span>
                </div>
                <span className="font-semibold text-destructive">-{monthlyDebits.toLocaleString()} FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Penalty notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Règle de pénalité</p>
            <p className="text-xs text-muted-foreground mt-1">
              En cas d'annulation après affectation et début de déplacement du transporteur, une pénalité de{" "}
              <strong>10%</strong> du montant de la commande sera automatiquement prélevée de votre portefeuille.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Historique des transactions</CardTitle>
          <CardDescription className="text-muted-foreground">Toutes vos opérations récentes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Tout
              </TabsTrigger>
              <TabsTrigger
                value="credits"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Entrées
              </TabsTrigger>
              <TabsTrigger
                value="debits"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sorties
              </TabsTrigger>
            </TabsList>

            {transactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucune transaction pour le moment</p>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-3 mt-0">
                  {transactions.map((tx) => (
                    <div
                      key={tx.slug || tx.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            tx.tx_type === "CREDIT"
                              ? "bg-success/10"
                              : "bg-destructive/10"
                          }`}
                        >
                          {tx.tx_type === "CREDIT" ? (
                            <ArrowDownLeft className="h-5 w-5 text-success" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.description || tx.tx_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.tx_type === "CREDIT" ? "text-success" : "text-destructive"}`}>
                        {tx.tx_type === "CREDIT" ? "+" : "-"}
                        {Number(tx.amount || 0).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="credits" className="space-y-3 mt-0">
                  {transactions
                    .filter((tx: any) => tx.tx_type === "CREDIT")
                    .map((tx) => (
                      <div key={tx.slug || tx.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <ArrowDownLeft className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tx.description || tx.tx_type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-success">+{Number(tx.amount || 0).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="debits" className="space-y-3 mt-0">
                  {transactions
                    .filter((tx: any) => tx.tx_type !== "CREDIT")
                    .map((tx) => (
                      <div key={tx.slug || tx.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center bg-destructive/10"
                          >
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tx.description || tx.tx_type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-destructive">-{Number(tx.amount || 0).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
