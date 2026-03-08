"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MapPin, Calendar, Package, MoreVertical, Eye, X, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/context"
import { useClientRequests, updateTransportRequest } from "@/lib/hooks/use-transport-requests"
import { useLanguage } from "@/lib/i18n/context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function RequestsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: requests, isLoading, mutate } = useClientRequests(user?.id)

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-secondary text-secondary-foreground" },
    assigned: { label: "Assigné", color: "bg-primary/20 text-primary" },
    picked_up: { label: "Enlevé", color: "bg-accent/20 text-accent" },
    in_transit: { label: "En transit", color: "bg-warning/20 text-warning" },
    delivered: { label: "Livré", color: "bg-success/20 text-success" },
    cancelled: { label: "Annulé", color: "bg-destructive/20 text-destructive" },
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch =
      !searchQuery ||
      request.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.pickup_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCancelRequest = async () => {
    if (!selectedRequest) return

    try {
      await updateTransportRequest(selectedRequest, { status: "cancelled" })
      mutate()
      setCancelDialogOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      console.error("Error cancelling request:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{"Mes demandes"}</h1>
          <p className="text-muted-foreground">{t("requests.manage")}</p>
        </div>
        <Link href="/client/requests/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            {"Nouvelle demande"}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("requests.search")}
                className="pl-10 bg-input border-border text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 border-border text-foreground bg-transparent">
              <Filter className="h-4 w-4" />
              {t("requests.filter")}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: null, label: t("requests.all") },
              { key: "pending", label: "En attente" },
              { key: "assigned", label: "Assigné" },
              { key: "in_transit", label: "En transit" },
              { key: "delivered", label: "Livré" },
              { key: "cancelled", label: "Annulé" },
            ].map((filter) => (
              <Badge
                key={filter.label}
                variant={statusFilter === filter.key ? "default" : "outline"}
                className={`cursor-pointer ${statusFilter === filter.key ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                onClick={() => setStatusFilter(filter.key)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requests list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredRequests?.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("requests.no_requests")}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter
                ? t("requests.no_requests_desc")
                : t("requests.no_requests_desc")}
            </p>
            <Link href="/client/requests/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">{"Créez une demande de transport"}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests?.map((request) => (
            <Card key={request.id} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {request.reference_number || `REQ-${request.id.slice(0, 8)}`}
                            </span>
                            <Badge className={statusConfig[request.status]?.color || statusConfig.pending.color}>
                              {statusConfig[request.status]?.label || request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.cargo_type || t("requests.transport_type.general")} • {request.weight || 0} kg
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            {t("requests.view_details")}
                          </DropdownMenuItem>
                          {request.status === "pending" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive"
                              onClick={() => {
                                setSelectedRequest(request.id)
                                setCancelDialogOpen(true)
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              {t("requests.cancel")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t("requests.from")}:</span>
                        <span className="text-foreground truncate">{request.pickup_address || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{t("requests.to")}:</span>
                        <span className="text-foreground truncate">{request.delivery_address || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {request.transporter && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">{t("moderator_requests.transporter_label")}: </span>
                        <span className="text-foreground font-medium">
                          {request.transporter.company_name ||
                            `${request.transporter.first_name} ${request.transporter.last_name}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {(request.estimated_cost || 0).toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/client/requests/${request.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground bg-transparent gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">{t("requests.view_details")}</span>
                        </Button>
                      </Link>
                      {["assigned", "picked_up", "in_transit"].includes(request.status) && (
                        <Link href="/client/tracking">
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">{"Suivre mes livraisons"}</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel confirmation dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {t("requests.cancel_confirm")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t("requests.cancel_desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground bg-transparent">{t("requests.cancel_no")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelRequest} className="bg-destructive hover:bg-destructive/90">
              {t("requests.cancel_yes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
