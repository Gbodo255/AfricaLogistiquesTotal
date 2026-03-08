"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: KPICardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-destructive",
                trend.direction === "neutral" && "text-muted-foreground",
              )}
            >
              {trend.direction === "up" && <TrendingUp className="h-4 w-4" />}
              {trend.direction === "down" && <TrendingDown className="h-4 w-4" />}
              {trend.direction === "neutral" && <Minus className="h-4 w-4" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  )
}

interface KPIGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4 | 6
}

export function KPIGrid({ children, columns = 4 }: KPIGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        columns === 6 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
      )}
    >
      {children}
    </div>
  )
}
