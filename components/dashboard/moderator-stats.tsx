import { StatCard } from "./stat-card"
import { Package, CheckCircle, Clock, Truck, AlertTriangle, TrendingUp } from "lucide-react"
import { useModeratorStats } from "@/lib/hooks/use-moderator"
import { useLanguage } from "@/lib/i18n/context"

export function ModeratorStats() {
  const { data: stats, isLoading } = useModeratorStats()
  const { t } = useLanguage()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title={t("moderator_requests.pending")}
        value={isLoading ? "..." : stats?.pending_requests?.toString() || "0"}
        icon={Clock}
        iconColor="bg-warning/10 text-warning"
      />
      <StatCard
        title={t("in_progress")}
        value={isLoading ? "..." : stats?.in_progress_requests?.toString() || "0"}
        icon={Truck}
        iconColor="bg-primary/10 text-primary"
      />
      <StatCard
        title={t("disputes.title")}
        value={isLoading ? "..." : stats?.open_disputes?.toString() || "0"}
        icon={AlertTriangle}
        iconColor="bg-destructive/10 text-destructive"
      />
      <StatCard
        title={t("moderator_requests.my_disputes")}
        value={isLoading ? "..." : stats?.my_disputes?.toString() || "0"}
        icon={CheckCircle}
        iconColor="bg-success/10 text-success"
      />
      <StatCard
        title={t("moderator_requests.pending_withdrawals")}
        value={isLoading ? "..." : stats?.pending_withdrawals?.toString() || "0"}
        icon={TrendingUp}
        iconColor="bg-accent/10 text-accent"
      />
      <StatCard
        title={t("admin_users.transporters")}
        value={isLoading ? "..." : stats?.total_transporters?.toString() || "0"}
        icon={Package}
        iconColor="bg-primary/10 text-primary"
      />
    </div>
  )
}
