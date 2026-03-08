"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  TrendingUp,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const walletStats = {
  totalClientWallets: "45 250 000 FCFA",
  totalTransporterWallets: "12 800 000 FCFA",
  pendingPayouts: "3 450 000 FCFA",
  todayTransactions: 127,
}

const recentWalletActivity = [
  {
    id: 1,
    type: "credit",
    user: "Jean Dupont",
    userType: "client",
    method: "Mobile Money",
    amount: "250 000 FCFA",
    time: "Il y a 5 min",
    status: "completed",
  },
  {
    id: 2,
    type: "debit",
    user: "Express Cargo",
    userType: "transporter",
    method: "Retrait",
    amount: "180 000 FCFA",
    time: "Il y a 12 min",
    status: "pending",
  },
  {
    id: 3,
    type: "credit",
    user: "Marie Claire SARL",
    userType: "client",
    method: "Carte bancaire",
    amount: "500 000 FCFA",
    time: "Il y a 25 min",
    status: "completed",
  },
  {
    id: 4,
    type: "penalty",
    user: "Tech Import",
    userType: "client",
    method: "Pénalité annulation",
    amount: "32 000 FCFA",
    time: "Il y a 1h",
    status: "completed",
  },
  {
    id: 5,
    type: "credit",
    user: "Trans Rapide",
    userType: "transporter",
    method: "Paiement mission",
    amount: "145 000 FCFA",
    time: "Il y a 2h",
    status: "completed",
  },
]

export function WalletOverview() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portefeuilles électroniques</h3>
          <p className="text-sm text-muted-foreground">Vue d'ensemble des transactions</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground bg-transparent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Rapport
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-border">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Solde Clients</p>
          <p className="text-lg font-bold text-foreground">{walletStats.totalClientWallets}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Solde Transporteurs</p>
          <p className="text-lg font-bold text-foreground">{walletStats.totalTransporterWallets}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Retraits en attente</p>
          <p className="text-lg font-bold text-warning">{walletStats.pendingPayouts}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{"Transactions aujourd'hui"}</p>
          <p className="text-lg font-bold text-primary">{walletStats.todayTransactions}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="divide-y divide-border">
        {recentWalletActivity.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-2 ${
                  activity.type === "credit"
                    ? "bg-success/10"
                    : activity.type === "penalty"
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                }`}
              >
                {activity.type === "credit" ? (
                  <ArrowUpRight className={`h-4 w-4 ${activity.type === "credit" ? "text-success" : "text-warning"}`} />
                ) : (
                  <ArrowDownRight
                    className={`h-4 w-4 ${activity.type === "penalty" ? "text-warning" : "text-destructive"}`}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{activity.user}</p>
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    {activity.userType === "client" ? "Client" : "Transporteur"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {activity.method === "Mobile Money" && <Smartphone className="h-3 w-3" />}
                  {activity.method === "Carte bancaire" && <CreditCard className="h-3 w-3" />}
                  {activity.method === "Retrait" && <Wallet className="h-3 w-3" />}
                  <span>{activity.method}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    activity.type === "credit"
                      ? "text-success"
                      : activity.type === "penalty"
                        ? "text-warning"
                        : "text-destructive"
                  }`}
                >
                  {activity.type === "credit" ? "+" : "-"}
                  {activity.amount}
                </p>
                <Badge
                  className={`text-xs ${
                    activity.status === "completed"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }`}
                >
                  {activity.status === "completed" ? "Complété" : "En attente"}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
