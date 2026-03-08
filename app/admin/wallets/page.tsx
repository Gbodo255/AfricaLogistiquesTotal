"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useAdminWallets, useAdminTransactions } from "@/lib/hooks/use-admin"

export default function AdminWalletsPage() {
  const { t } = useLanguage()
  const { data: walletsData, isLoading: loadingWallets } = useAdminWallets()
  const { data: transactionsData } = useAdminTransactions(10)

  const roleConfig: Record<string, { label: string; color: string }> = {
    client: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    transporter: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
    CLIENT: { label: t("auth.client"), color: "bg-primary/10 text-primary border-primary/20" },
    TRANSPORTEUR: { label: t("auth.transporter"), color: "bg-accent/10 text-accent border-accent/20" },
  }

  const wallets = walletsData || []
  const transactions = transactionsData || []

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showAdjustDialog, setShowAdjustDialog] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit")
  const [adjustAmount, setAdjustAmount] = useState("")

  const filteredWallets = wallets.filter((w: any) => {
    const user = w.user || {}
    const matchesSearch =
      !searchQuery ||
      (user.firstname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.lastname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())

    const role = (user.role || "").toLowerCase()
    const matchesRole = roleFilter === "all" || role === roleFilter || role === roleFilter.toUpperCase()

    return matchesSearch && matchesRole
  })

  const totalBalance = wallets.reduce((acc: number, w: any) => acc + Number(w.balance || 0), 0)
  const clientBalance = wallets
    .filter((w: any) => (w.user?.role || "").toUpperCase().includes("CLIENT"))
    .reduce((acc: number, w: any) => acc + Number(w.balance || 0), 0)
  const transporterBalance = wallets
    .filter((w: any) => (w.user?.role || "").toUpperCase().includes("TRANSPORT"))
    .reduce((acc: number, w: any) => acc + Number(w.balance || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin_wallets.title")}</h1>
        <p className="text-muted-foreground">{t("admin_wallets.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{(totalBalance / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">{t("admin_wallets.total_balance")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{(clientBalance / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">{t("admin_wallets.client_balance")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{(transporterBalance / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">{t("admin_wallets.transporter_balance")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                <p className="text-xs text-muted-foreground">{t("admin_wallets.today_transactions")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("admin_wallets.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t("admin_wallets.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("requests.all")}</SelectItem>
                    <SelectItem value="client">{t("auth.client")}</SelectItem>
                    <SelectItem value="transporter">{t("auth.transporter")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">{t("admin_wallets.title")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("admin_wallets.user")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("admin_wallets.balance")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("admin_wallets.total_credits")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("admin_wallets.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingWallets ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" /></td></tr>
                    ) : filteredWallets.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">{t("admin_wallets.no_wallets")}</td></tr>
                    ) : filteredWallets.map((wallet: any) => (
                      <tr key={wallet.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {wallet.user?.firstname?.[0]}
                                {wallet.user?.lastname?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {wallet.user?.firstname} {wallet.user?.lastname}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className={roleConfig[wallet.user?.role]?.color || "bg-muted"} >
                                  {roleConfig[wallet.user?.role]?.label || wallet.user?.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-foreground">
                            {(wallet.balance || 0).toLocaleString()} FCFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-success">+{(wallet.total_credits || 0).toLocaleString()} FCFA</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-success text-success hover:bg-success/10 bg-transparent h-8"
                              onClick={() => {
                                setSelectedWallet(wallet)
                                setAdjustType("credit")
                                setShowAdjustDialog(true)
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {t("admin_wallets.credit")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent h-8"
                              onClick={() => {
                                setSelectedWallet(wallet)
                                setAdjustType("debit")
                                setShowAdjustDialog(true)
                              }}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              {t("admin_wallets.debit")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_wallets.recent_transactions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t("admin_wallets.no_transactions")}</p>
            ) : transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${(tx.tx_type || tx.type) === "CREDIT" || (tx.tx_type || tx.type) === "credit"
                      ? "bg-success/10"
                      : (tx.tx_type || tx.type) === "penalty"
                        ? "bg-warning/10"
                        : "bg-destructive/10"
                      }`}
                  >
                    {(tx.tx_type || tx.type) === "CREDIT" || (tx.tx_type || tx.type) === "credit" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight
                        className={`h-4 w-4 ${(tx.tx_type || tx.type) === "penalty" ? "text-warning" : "text-destructive"}`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.user || `${tx.wallet?.user?.firstname || ""} ${tx.wallet?.user?.lastname || ""}`.trim() || t("common.unknown")}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${(tx.tx_type || tx.type) === "CREDIT" || (tx.tx_type || tx.type) === "credit"
                      ? "text-success"
                      : (tx.tx_type || tx.type) === "penalty"
                        ? "text-warning"
                        : "text-destructive"
                      }`}
                  >
                    {(tx.tx_type || tx.type) === "CREDIT" || (tx.tx_type || tx.type) === "credit" ? "+" : "-"}
                    {Number(tx.amount || 0).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.created_at ? new Date(tx.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : (tx.date || "").split(" ")[1]}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {adjustType === "credit" ? t("admin_wallets.credit") : t("admin_wallets.debit")} {t("admin_wallets.adjust_wallet")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedWallet && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground">
                  {selectedWallet.user?.firstname} {selectedWallet.user?.lastname}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("admin_wallets.current_balance")}: {(selectedWallet.balance || 0).toLocaleString()} FCFA
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-foreground">{t("admin_wallets.amount")} (FCFA)</Label>
              <Input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="Ex: 50000"
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdjustDialog(false)}
              className="bg-transparent border-border"
            >
              {t("requests.cancel")}
            </Button>
            <Button
              onClick={() => {
                setShowAdjustDialog(false)
                setAdjustAmount("")
              }}
              className={
                adjustType === "credit" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
              }
            >
              {adjustType === "credit" ? t("admin_wallets.credit") : t("admin_wallets.debit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
