"use client"

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

const areaData = [
  { name: "Jan", demandes: 65, livraisons: 58 },
  { name: "Fév", demandes: 78, livraisons: 72 },
  { name: "Mar", demandes: 90, livraisons: 85 },
  { name: "Avr", demandes: 81, livraisons: 76 },
  { name: "Mai", demandes: 95, livraisons: 89 },
  { name: "Juin", demandes: 110, livraisons: 102 },
  { name: "Juil", demandes: 125, livraisons: 118 },
]

const barData = [
  { name: "Lun", missions: 45 },
  { name: "Mar", missions: 52 },
  { name: "Mer", missions: 48 },
  { name: "Jeu", missions: 61 },
  { name: "Ven", missions: 55 },
  { name: "Sam", missions: 32 },
  { name: "Dim", missions: 18 },
]

const pieData = [
  { name: "En attente", value: 30, color: "#f59e0b" },
  { name: "En cours", value: 45, color: "#3b82f6" },
  { name: "Terminées", value: 120, color: "#10b981" },
  { name: "Annulées", value: 8, color: "#ef4444" },
]

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Évolution des activités</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={areaData}>
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
          <span className="text-sm text-muted-foreground">Demandes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Livraisons</span>
        </div>
      </div>
    </div>
  )
}

export function WeeklyMissionsChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Missions par jour</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
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
          <Bar dataKey="missions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RequestStatusChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Statut des demandes</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
            {pieData.map((entry, index) => (
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
      <div className="mt-4 grid grid-cols-2 gap-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
