"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react"

const disputes = [
  {
    id: "LIT-2024-012",
    title: "Marchandise endommagée",
    client: "Jean Dupont",
    transporter: "Express Cargo",
    requestId: "TR-2024-089",
    amount: "150 000 FCFA",
    status: "open",
    priority: "high",
    createdAt: "Il y a 2h",
    description: "Le client signale des dommages sur le mobilier livré",
  },
  {
    id: "LIT-2024-011",
    title: "Retard de livraison",
    client: "Agro Plus",
    transporter: "Trans Rapide",
    requestId: "TR-2024-085",
    amount: "320 000 FCFA",
    status: "in_progress",
    priority: "medium",
    createdAt: "Il y a 5h",
    description: "Retard de 48h sur la livraison convenue",
  },
  {
    id: "LIT-2024-010",
    title: "Contestation de facturation",
    client: "Tech Import",
    transporter: "Logistic Pro",
    requestId: "TR-2024-078",
    amount: "85 000 FCFA",
    status: "resolved",
    priority: "low",
    createdAt: "Il y a 1j",
    description: "Différend sur les frais supplémentaires facturés",
  },
]

const statusConfig = {
  open: { label: "Ouvert", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
  in_progress: { label: "En traitement", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  resolved: { label: "Résolu", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  closed: { label: "Fermé", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
}

const priorityConfig = {
  high: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Moyen", color: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Faible", color: "bg-muted text-muted-foreground border-border" },
}

export function DisputesPanel() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Litiges récents</h3>
          <p className="text-sm text-muted-foreground">
            {disputes.filter((d) => d.status === "open").length} litige(s) ouvert(s)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground bg-transparent"
        >
          Voir tout
        </Button>
      </div>

      <div className="divide-y divide-border">
        {disputes.map((dispute) => {
          const StatusIcon = statusConfig[dispute.status as keyof typeof statusConfig].icon
          return (
            <div key={dispute.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`rounded-lg p-2 ${
                      dispute.priority === "high"
                        ? "bg-destructive/10"
                        : dispute.priority === "medium"
                          ? "bg-warning/10"
                          : "bg-muted"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        dispute.priority === "high"
                          ? "text-destructive"
                          : dispute.priority === "medium"
                            ? "text-warning"
                            : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-primary">{dispute.id}</span>
                      <Badge className={statusConfig[dispute.status as keyof typeof statusConfig].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[dispute.status as keyof typeof statusConfig].label}
                      </Badge>
                      <Badge className={priorityConfig[dispute.priority as keyof typeof priorityConfig].color}>
                        {priorityConfig[dispute.priority as keyof typeof priorityConfig].label}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground mt-1">{dispute.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{dispute.description}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {dispute.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{dispute.client}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-accent/10 text-accent text-xs">
                            {dispute.transporter
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{dispute.transporter}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-foreground">{dispute.amount}</span>
                  <span className="text-xs text-muted-foreground">{dispute.createdAt}</span>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground mt-2">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Traiter
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
