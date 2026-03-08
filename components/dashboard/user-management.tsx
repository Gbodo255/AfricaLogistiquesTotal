"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Ban, CheckCircle, UserCheck, Filter, Wallet } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+229 97 XX XX XX",
    role: "client",
    status: "active",
    walletBalance: "250 000 FCFA",
    registeredAt: "12 Jan 2024",
    totalRequests: 15,
  },
  {
    id: 2,
    name: "Express Cargo SARL",
    email: "contact@expresscargo.bj",
    phone: "+229 96 XX XX XX",
    role: "transporter",
    status: "active",
    walletBalance: "1 250 000 FCFA",
    registeredAt: "08 Jan 2024",
    totalRequests: 89,
  },
  {
    id: 3,
    name: "Marie Claire",
    email: "marie.claire@email.com",
    phone: "+229 95 XX XX XX",
    role: "client",
    status: "pending",
    walletBalance: "0 FCFA",
    registeredAt: "15 Jan 2024",
    totalRequests: 0,
  },
  {
    id: 4,
    name: "Trans Rapide",
    email: "info@transrapide.bj",
    phone: "+229 94 XX XX XX",
    role: "transporter",
    status: "suspended",
    walletBalance: "450 000 FCFA",
    registeredAt: "02 Jan 2024",
    totalRequests: 34,
  },
  {
    id: 5,
    name: "Agro Plus",
    email: "contact@agroplus.bj",
    phone: "+229 93 XX XX XX",
    role: "client",
    status: "active",
    walletBalance: "780 000 FCFA",
    registeredAt: "10 Jan 2024",
    totalRequests: 28,
  },
]

const roleConfig = {
  client: { label: "Client", color: "bg-primary/10 text-primary border-primary/20" },
  transporter: { label: "Transporteur", color: "bg-accent/10 text-accent border-accent/20" },
  moderator: { label: "Modérateur", color: "bg-warning/10 text-warning border-warning/20" },
  admin: { label: "Administrateur", color: "bg-destructive/10 text-destructive border-destructive/20" },
}

const statusConfig = {
  active: { label: "Actif", color: "bg-success/10 text-success border-success/20" },
  pending: { label: "En attente", color: "bg-warning/10 text-warning border-warning/20" },
  suspended: { label: "Suspendu", color: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Gestion des utilisateurs</h3>
          <p className="text-sm text-muted-foreground">{users.length} utilisateurs enregistrés</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-muted border-0 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" size="icon" className="border-border text-muted-foreground bg-transparent">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Portefeuille
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={roleConfig[user.role as keyof typeof roleConfig].color}>
                    {roleConfig[user.role as keyof typeof roleConfig].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{user.walletBalance}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusConfig[user.status as keyof typeof statusConfig].color}>
                    {statusConfig[user.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir profil
                      </DropdownMenuItem>
                      {user.status === "pending" && (
                        <DropdownMenuItem className="text-success focus:text-success">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Valider compte
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" && (
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Suspendre
                        </DropdownMenuItem>
                      )}
                      {user.status === "suspended" && (
                        <DropdownMenuItem className="text-success focus:text-success">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Réactiver
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
