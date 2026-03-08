"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Eye, Clock, MapPin, Package, User, ChevronDown, ChevronUp } from "lucide-react"

const pendingRequests = [
  {
    id: "TR-2024-006",
    client: "Société Agricole du Centre",
    clientType: "Entreprise",
    origin: "Bafoussam",
    destination: "Douala Port",
    merchandise: "Produits agricoles",
    weight: "8 tonnes",
    volume: "25 m³",
    deadline: "18 Jan 2024",
    amount: "380 000 FCFA",
    walletBalance: "500 000 FCFA",
    submittedAt: "Il y a 15 min",
    priority: "high",
  },
  {
    id: "TR-2024-007",
    client: "Jean Michel",
    clientType: "Particulier",
    origin: "Yaoundé - Bastos",
    destination: "Douala - Bonanjo",
    merchandise: "Mobilier de bureau",
    weight: "500 kg",
    volume: "4 m³",
    deadline: "20 Jan 2024",
    amount: "75 000 FCFA",
    walletBalance: "120 000 FCFA",
    submittedAt: "Il y a 32 min",
    priority: "medium",
  },
  {
    id: "TR-2024-008",
    client: "Import Export SARL",
    clientType: "Entreprise",
    origin: "Douala Port",
    destination: "N'Djamena",
    merchandise: "Conteneur marchandises diverses",
    weight: "20 tonnes",
    volume: "40 m³",
    deadline: "25 Jan 2024",
    amount: "1 200 000 FCFA",
    walletBalance: "2 500 000 FCFA",
    submittedAt: "Il y a 1h",
    priority: "high",
  },
  {
    id: "TR-2024-009",
    client: "Pharmacie Centrale",
    clientType: "Entreprise",
    origin: "Douala",
    destination: "Garoua",
    merchandise: "Produits pharmaceutiques",
    weight: "1.5 tonnes",
    volume: "8 m³",
    deadline: "17 Jan 2024",
    amount: "250 000 FCFA",
    walletBalance: "400 000 FCFA",
    submittedAt: "Il y a 2h",
    priority: "urgent",
  },
]

export function PendingRequests() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Demandes en attente de traitement</h3>
          <p className="text-sm text-muted-foreground">{pendingRequests.length} demandes nécessitent votre attention</p>
        </div>
        <Badge className="bg-warning/10 text-warning border-warning/20">
          {pendingRequests.filter((r) => r.priority === "urgent").length} urgent(es)
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {pendingRequests.map((request) => (
          <div key={request.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-lg p-2 ${
                    request.priority === "urgent"
                      ? "bg-destructive/10"
                      : request.priority === "high"
                        ? "bg-warning/10"
                        : "bg-primary/10"
                  }`}
                >
                  <Package
                    className={`h-5 w-5 ${
                      request.priority === "urgent"
                        ? "text-destructive"
                        : request.priority === "high"
                          ? "text-warning"
                          : "text-primary"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{request.id}</span>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      {request.clientType}
                    </Badge>
                    {request.priority === "urgent" && (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{request.client}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {request.origin} → {request.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{request.submittedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{request.amount}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                >
                  {expandedId === request.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {expandedId === request.id && (
              <div className="mt-4 ml-14 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Marchandise</p>
                    <p className="text-sm font-medium text-foreground">{request.merchandise}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Poids</p>
                    <p className="text-sm font-medium text-foreground">{request.weight}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-sm font-medium text-foreground">{request.volume}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Délai souhaité</p>
                    <p className="text-sm font-medium text-foreground">{request.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Solde portefeuille: <span className="font-medium text-success">{request.walletBalance}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Rejeter
                    </Button>
                    <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                      <Check className="mr-2 h-4 w-4" />
                      Valider & Affecter
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
