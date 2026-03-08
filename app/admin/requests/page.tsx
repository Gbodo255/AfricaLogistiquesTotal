"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Package,
  MapPin,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

export default function AdminRequestsPage() {
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: t("moderator_requests.pending"), color: "bg-warning/10 text-warning border-warning/20" },
    validated: { label: t("moderator_requests.validated_plural"), color: "bg-primary/10 text-primary border-primary/20" },
    assigned: { label: t("assigned"), color: "bg-accent/10 text-accent border-accent/20" },
    in_progress: { label: t("in_progress"), color: "bg-primary/10 text-primary border-primary/20" },
    delivered: { label: t("delivered"), color: "bg-success/10 text-success border-success/20" },
    cancelled: { label: t("cancelled"), color: "bg-destructive/10 text-destructive border-destructive/20" },
  }

  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: requests = [], isLoading } = useSWR(["admin-requests", statusFilter], async () => {
    const res = await djangoApi.getAdminRequests({ include_deleted: false })
    if (res.error) throw new Error(res.error)
    const all = res.requests || []
    if (statusFilter === "all") return all
    // Backend Django statuses are uppercase (PENDING/ASSIGNED/IN_PROGRESS/DELIVERED/CANCELLED)
    return all.filter((r: any) => (r.status || "").toUpperCase() === statusFilter.toUpperCase())
  })

  const filteredRequests = requests.filter((r: any) => {
    const matchesSearch =
      !searchQuery ||
      (r.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pickup_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.delivery_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || r.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: requests.length,
    pending: requests.filter((r: any) => r.status === "PENDING").length,
    in_progress: requests.filter((r: any) => ["ASSIGNED", "IN_PROGRESS"].includes(r.status)).length,
    completed: requests.filter((r: any) => r.status === "DELIVERED").length,
    cancelled: requests.filter((r: any) => r.status === "CANCELLED").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_requests.title")}</h1>
          <p className="text-muted-foreground">{t("admin_requests.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground"
          onClick={() => window.open(process.env.NEXT_PUBLIC_DJANGO_API_URL + '/api/africa_logistic/reports/admin/requests.csv')}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("common.export")} CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t("common.total")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">{t("moderator_requests.pending")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.in_progress}</p>
                <p className="text-xs text-muted-foreground">{t("in_progress")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">{t("common.completed")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.cancelled}</p>
                <p className="text-xs text-muted-foreground">{t("cancelled")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin_requests.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("admin_requests.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin_requests.all_statuses")}</SelectItem>
                <SelectItem value="PENDING">{t("moderator_requests.pending")}</SelectItem>
                <SelectItem value="ASSIGNED">{t("assigned")}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t("in_progress")}</SelectItem>
                <SelectItem value="DELIVERED">{t("delivered")}</SelectItem>
                <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground">
            {filteredRequests.length} {filteredRequests.length === 1 ? t("admin_requests.request_singular") : t("admin_requests.request_plural")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading && (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">{t("common.loading")}</span>
              </div>
            )}
            {filteredRequests.map((request) => (
              <div key={request.slug} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-lg p-2 ${request.status === "PENDING"
                        ? "bg-warning/10"
                        : request.status === "DELIVERED"
                          ? "bg-success/10"
                          : request.status === "IN_PROGRESS"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                    >
                      <Package
                        className={`h-5 w-5 ${request.status === "PENDING"
                          ? "text-warning"
                          : request.status === "DELIVERED"
                            ? "text-success"
                            : request.status === "IN_PROGRESS"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-primary">{(request.slug || "").slice(0, 12)}</span>
                        <Badge className={statusConfig[(request.status || "").toLowerCase()]?.color || "bg-muted"}>
                          {statusConfig[(request.status || "").toLowerCase()]?.label || request.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-border">
                          {request.merchandise_type || "Transport"}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground">
                        {request.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {request.pickup_city} → {request.delivery_city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      {(request.estimated_price ? Number(request.estimated_price) : 0).toLocaleString()} FCFA
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setExpandedId(expandedId === request.slug ? null : request.slug)}
                    >
                      {expandedId === request.slug ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedId === request.slug && (
                  <div className="mt-4 ml-14 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-muted/50 p-4">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("moderator_requests.cargo")}</p>
                        <p className="text-sm font-medium text-foreground">{request.merchandise_description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("moderator_requests.weight")}</p>
                        <p className="text-sm font-medium text-foreground">{request.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("moderator_requests.estimated_price")}</p>
                        <p className="text-sm font-medium text-foreground">
                          {(request.estimated_price ? Number(request.estimated_price) : 0).toLocaleString()} FCFA
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("admin_transporters.status_label")}</p>
                        <p className="text-sm font-medium text-foreground">{statusConfig[request.status]?.label || request.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("moderator_requests.details")} {t("admin_requests.complete")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
