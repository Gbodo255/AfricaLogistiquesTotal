"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { useAdminKPIs, useAdminTransactions } from "@/lib/hooks/use-admin"

export default function AdminFinancePage() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState("month")
  const { data: kpis } = useAdminKPIs()
  const { data: transactions } = useAdminTransactions(10)

  const handleExport = async () => {
    try {
      const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api/africa_logistic'
      const token = sessionStorage.getItem('django_token')

      const response = await fetch(`${DJANGO_API_URL}/reports/admin/revenue.csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Export error')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert(t('common.error'))
    }
  }

  // On utilise les données réelles des KPIs
  const revenueData = [
    { name: t("common.total"), revenue: kpis?.total_revenue || 0, commissions: (kpis?.total_revenue || 0) * 0.15 },
  ]

  const transactionsByType = [
    { name: t("delivered"), value: kpis?.completed_requests || 0, color: "#10b981" },
    { name: t("in_progress"), value: kpis?.in_progress_requests || 0, color: "#3b82f6" },
    { name: t("admin.pending"), value: kpis?.pending_requests || 0, color: "#f59e0b" },
  ]

  const topRoutes: any[] = []

  const totalRevenue = kpis?.total_revenue || 0
  const totalCommissions = totalRevenue * 0.15
  const avgTransactionValue = totalRevenue > 0 ? totalRevenue / (kpis?.total_requests || 1) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin_finance.title")}</h1>
          <p className="text-muted-foreground">{t("admin_finance.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-background border-border">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t("admin_finance.this_week")}</SelectItem>
              <SelectItem value="month">{t("admin_finance.this_month")}</SelectItem>
              <SelectItem value="quarter">{t("admin_finance.this_quarter")}</SelectItem>
              <SelectItem value="year">{t("admin_finance.this_year")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 border-border bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4" />
            {t("admin_finance.export")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Number(kpis?.total_revenue || 0).toLocaleString()} FCFA
            </p>
            <p className="text-xs text-muted-foreground">{t("admin_finance.total_revenue")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Number((kpis?.total_revenue || 0) * 0.15).toLocaleString()} FCFA
            </p>
            <p className="text-xs text-muted-foreground">{t("admin_finance.total_commissions")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Number(kpis?.total_client_balance || 0).toLocaleString()} FCFA
            </p>
            <p className="text-xs text-muted-foreground">{t("admin_wallets.client_balance")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Number(kpis?.total_transporter_balance || 0).toLocaleString()} FCFA
            </p>
            <p className="text-xs text-muted-foreground">{t("admin_wallets.transporter_balance")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_finance.revenue_chart")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name={t("admin_finance.revenue")}
                />
                <Area
                  type="monotone"
                  dataKey="commissions"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCommissions)"
                  strokeWidth={2}
                  name={t("admin_finance.commissions")}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{t("admin_finance.revenue")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">{t("admin_finance.commissions")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_finance.transactions_by_type")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={transactionsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {transactionsByType.map((entry, index) => (
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
              {transactionsByType.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_finance.top_routes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${value / 1000}K`} />
                <YAxis type="category" dataKey="route" stroke="#94a3b8" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`]}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">{t("admin_finance.recent_commissions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions?.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${tx.tx_type === "CREDIT" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {tx.tx_type === "CREDIT" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description || tx.tx_type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${tx.tx_type === "CREDIT" ? "text-success" : "text-destructive"}`}>
                  {tx.tx_type === "CREDIT" ? "+" : "-"}{Number(tx.amount).toLocaleString()} FCFA
                </p>
              </div>
            ))}
            {(!transactions || transactions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("admin_wallets.no_transactions")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
