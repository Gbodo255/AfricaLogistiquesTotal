"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Truck,
  Package,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Activity,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import {
  useAdminKPIs,
  useAdminUsers,
  useAdminTransactions,
  useAdminRequests,
  useAdminChartData,
} from "@/lib/hooks/use-admin"
import { useLanguage } from "@/lib/i18n/context"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: t("moderator_requests.pending"), color: "bg-warning/10 text-warning border-warning/20" },
    VALIDATED: { label: t("moderator_requests.validated"), color: "bg-primary/10 text-primary border-primary/20" },
    ASSIGNED: { label: t("assigned"), color: "bg-accent/10 text-accent border-accent/20" },
    IN_PROGRESS: { label: t("in_progress"), color: "bg-primary/10 text-primary border-primary/20" },
    DELIVERED: { label: t("delivered"), color: "bg-success/10 text-success border-success/20" },
    CANCELLED: { label: t("cancelled"), color: "bg-destructive/10 text-destructive border-destructive/20" },
  }
  const { data: kpis, isLoading: kpisLoading } = useAdminKPIs()
  const { data: users } = useAdminUsers()
  const { data: transactions } = useAdminTransactions(5)
  const { data: requests } = useAdminRequests(5)
  const { data: chartData } = useAdminChartData()

  const firstName = user?.firstname || "Admin"

  const mainKPIs = [
    {
      title: t("admin.total_clients"),
      value: kpis?.total_clients?.toString() || "0",
      subtitle: t("admin.active_users"),
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: t("admin.active_transporters"),
      value: kpis?.total_transporters?.toString() || "0",
      subtitle: `${kpis?.in_progress_requests || 0} ${t("admin.on_mission")}`,
      icon: Truck,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: t("admin.total_requests"),
      value: kpis?.total_requests?.toString() || "0",
      subtitle: `${kpis?.pending_requests || 0} ${t("admin.pending")}`,
      icon: Package,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: t("admin.revenue"),
      value: `${((kpis?.total_revenue || 0) / 1000000).toFixed(1)}M FCFA`,
      subtitle: t("admin.commission"),
      icon: Wallet,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ]

  const secondaryKPIs = [
    {
      title: t("admin.delivery_rate"),
      value: `${kpis?.delivery_rate || 0}%`,
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: t("admin_wallets.client_balance"),
      value: `${((kpis?.total_client_balance || 0) / 1000000).toFixed(1)}M`,
      icon: Activity,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: t("admin_wallets.today_transactions"),
      value: kpis?.today_transactions?.toString() || "0",
      icon: CreditCard,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      title: t("moderator.open_disputes"),
      value: kpis?.open_disputes?.toString() || "0",
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin.welcome")}, {firstName}</h1>
          <p className="text-muted-foreground">{t("admin.overview")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant="outline" className="gap-2 border-border bg-transparent">
              <Users className="h-4 w-4" />
              {t("users")}
            </Button>
          </Link>
          <Link href="/admin/finance">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              {t("admin_finance.title")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainKPIs.map((kpi, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpisLoading ? "..." : kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((kpi, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-foreground">{kpisLoading ? "..." : kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_finance.revenue_chart")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData?.areaData || []}>
                <defs>
                  <linearGradient id="colorDemandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLivraisons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="demandes"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorDemandes)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="livraisons"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorLivraisons)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{t("admin_tracking.missions")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">{t("admin_finance.commissions")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_requests.status")} {t("admin_tracking.missions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData?.pieData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(chartData?.pieData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(chartData?.pieData || []).map((item: any) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-foreground">{t("admin_wallets.recent_transactions")}</CardTitle>
            <Link href="/admin/finance">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                {t("admin.view_all")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions?.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${tx.tx_type === "CREDIT" ? "bg-success/10" : "bg-destructive/10"
                      }`}
                  >
                    {tx.tx_type === "CREDIT" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.wallet?.user?.firstname} {tx.wallet?.user?.lastname}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.description || tx.tx_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${tx.tx_type === "CREDIT" ? "text-success" : "text-destructive"
                      }`}
                  >
                    {tx.tx_type === "CREDIT" ? "+" : "-"}
                    {Number(tx.amount).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {(!transactions || transactions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("admin_wallets.no_transactions")}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-foreground">{t("admin.recent_requests")}</CardTitle>
            <Link href="/admin/requests">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                {t("admin.view_all")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests?.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{request.id.slice(0, 8)}</span>
                      <Badge className={statusConfig[request.status]?.color || "bg-muted"}>
                        {statusConfig[request.status]?.label || request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {request.pickup_city} → {request.delivery_city}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {(request.final_price || request.estimated_price)?.toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
            {(!requests || requests.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("admin_users.no_recent")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Overview */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-foreground">{t("admin_users.recent_users")}</CardTitle>
            <p className="text-sm text-muted-foreground">{users?.length || 0} {t("admin_users.registered")}</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="gap-1 border-border bg-transparent">
              <Eye className="h-4 w-4" />
              {t("admin_users.manage")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("admin_users.user_column")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("admin_users.role")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("admin.page.portefeuille")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("admin_transporters.status_label")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.slice(0, 5).map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {u.firstname?.[0]}
                            {u.lastname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {u.firstname} {u.lastname}
                          </p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          ["PME", "PARTICULIER", "AGRICULTEUR"].includes(u.role)
                            ? "bg-primary/10 text-primary border-primary/20"
                            : u.role === "TRANSPORTEUR"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : ["MODERATOR", "MODERATEUR"].includes(u.role)
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {["PME", "PARTICULIER", "AGRICULTEUR"].includes(u.role)
                          ? t("auth.client")
                          : u.role === "TRANSPORTEUR"
                            ? t("auth.transporter")
                            : ["MODERATOR", "MODERATEUR"].includes(u.role)
                              ? t("admin_roles.moderator")
                              : t("admin_roles.admin")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">
                        {((u.wallet as any)?.[0]?.balance || 0).toLocaleString()} FCFA
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          u.is_active
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {u.is_active ? t("admin_transporters.active_label") : t("admin_transporters.inactive_label")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
