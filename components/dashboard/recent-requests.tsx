import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const requests = [
  {
    id: "TR-2024-001",
    client: "Jean Dupont",
    origin: "Douala",
    destination: "Yaoundé",
    status: "pending",
    amount: "150 000 FCFA",
    date: "15 Jan 2024",
  },
  {
    id: "TR-2024-002",
    client: "Marie Claire",
    origin: "Bafoussam",
    destination: "Douala",
    status: "in_progress",
    amount: "85 000 FCFA",
    date: "15 Jan 2024",
  },
  {
    id: "TR-2024-003",
    client: "Express SARL",
    origin: "Yaoundé",
    destination: "Kribi",
    status: "completed",
    amount: "200 000 FCFA",
    date: "14 Jan 2024",
  },
  {
    id: "TR-2024-004",
    client: "Agro Plus",
    origin: "Maroua",
    destination: "Douala",
    status: "assigned",
    amount: "450 000 FCFA",
    date: "14 Jan 2024",
  },
  {
    id: "TR-2024-005",
    client: "Tech Import",
    origin: "Douala Port",
    destination: "Yaoundé",
    status: "pending",
    amount: "320 000 FCFA",
    date: "13 Jan 2024",
  },
]

const statusConfig = {
  pending: { label: "En attente", variant: "warning" as const },
  assigned: { label: "Affectée", variant: "secondary" as const },
  in_progress: { label: "En cours", variant: "default" as const },
  completed: { label: "Terminée", variant: "success" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
}

export function RecentRequests() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Demandes récentes</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground bg-transparent"
        >
          Voir tout
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trajet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Montant
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
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-muted/50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{request.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{request.client}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {request.origin} → {request.destination}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{request.amount}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge
                    className={
                      statusConfig[request.status as keyof typeof statusConfig].variant === "warning"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : statusConfig[request.status as keyof typeof statusConfig].variant === "success"
                          ? "bg-success/10 text-success border-success/20"
                          : statusConfig[request.status as keyof typeof statusConfig].variant === "default"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {statusConfig[request.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
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
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
                          Affecter
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Annuler</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
