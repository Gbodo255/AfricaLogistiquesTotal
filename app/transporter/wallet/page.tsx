"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Banknote, Clock, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/context"

const transactions = [
  { id: 1, type: "credit", label: "Mission TR-2025-001", amount: 40500, date: "15 Jan 2025", status: "completed" },
  { id: 2, type: "debit", label: "Retrait Mobile Money", amount: 100000, date: "14 Jan 2025", status: "completed" },
  { id: 3, type: "credit", label: "Mission TR-2024-098", amount: 27000, date: "10 Jan 2025", status: "completed" },
  { id: 4, type: "credit", label: "Mission TR-2024-095", amount: 40500, date: "08 Jan 2025", status: "completed" },
  { id: 5, type: "debit", label: "Retrait Bancaire", amount: 200000, date: "05 Jan 2025", status: "completed" },
]

const pendingWithdrawals = [
  { id: 1, amount: 150000, method: "Mobile Money", requestedAt: "15 Jan 2025, 10:30", status: "processing" },
]

export default function TransporterWalletPage() {
  const { t } = useLanguage()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWithdraw = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setDialogOpen(false)
      setWithdrawAmount("")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("transporter_wallet.title")}</h1>
        <p className="text-muted-foreground">{t("transporter_wallet.subtitle")}</p>
      </div>

      {/* Balance cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border bg-card md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("transporter_wallet.available_balance")}</p>
                <p className="text-4xl font-bold text-foreground">258 000 FCFA</p>
                <p className="text-sm text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +22% {t("transporter_wallet.vs_last_month")}
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center">
                <Wallet className="h-7 w-7 text-success" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Banknote className="h-4 w-4" />
                    {t("transporter_wallet.request_withdrawal")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{t("transporter_wallet.withdrawal_title")}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {t("transporter_wallet.withdrawal_desc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{t("transporter_wallet.available_balance")}</span>
                        <span className="text-sm font-medium text-foreground">258 000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t("transporter_wallet.minimum")}</span>
                        <span className="text-sm font-medium text-foreground">10 000 FCFA</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">{t("transporter_wallet.amount")}</Label>
                      <Input
                        type="number"
                        placeholder={t("transporter_wallet.enter_amount")}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Méthode de retrait</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-primary bg-primary/10 text-foreground justify-start"
                        >
                          Mobile Money
                        </Button>
                        <Button
                          variant="outline"
                          className="border-border text-foreground bg-transparent justify-start"
                        >
                          Virement bancaire
                        </Button>
                      </div>
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
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? "Traitement..." : "Confirmer le retrait"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{t("transporter_wallet.this_month")}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("transporter_wallet.earnings")}</span>
                </div>
                <span className="font-semibold text-success">+485 000 FCFA</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("transporter_wallet.withdrawals")}</span>
                </div>
                <span className="font-semibold text-destructive">-300 000 FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              {t("transporter_wallet.pending_withdrawals")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{withdrawal.amount.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">
                    {withdrawal.method} • {t("transporter_wallet.requested_at")} {withdrawal.requestedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-warning">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("transporter_wallet.processing")}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("transporter_wallet.recent_transactions")}</CardTitle>
          <CardDescription className="text-muted-foreground">{t("transporter_wallet.recent_transactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("requests.all")}
              </TabsTrigger>
              <TabsTrigger
                value="earnings"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("transporter_wallet.earnings")}
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t("transporter_wallet.withdrawals")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-3 mt-0">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.label}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
                      {tx.type === "credit" ? "+" : "-"}
                      {tx.amount.toLocaleString()} FCFA
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="earnings" className="space-y-3 mt-0">
              {transactions
                .filter((tx) => tx.type === "credit")
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                        <ArrowDownLeft className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.label}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-success">+{tx.amount.toLocaleString()} FCFA</span>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="withdrawals" className="space-y-3 mt-0">
              {transactions
                .filter((tx) => tx.type === "debit")
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.label}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-destructive">-{tx.amount.toLocaleString()} FCFA</span>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
