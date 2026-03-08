import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"

const transactions = [
  { id: 1, type: "credit", description: "Paiement commission - TR-2024-003", amount: "15 000 FCFA", date: "15 Jan" },
  { id: 2, type: "credit", description: "Paiement commission - TR-2024-002", amount: "8 500 FCFA", date: "15 Jan" },
  { id: 3, type: "debit", description: "Remboursement client - TR-2024-001", amount: "5 000 FCFA", date: "14 Jan" },
  { id: 4, type: "credit", description: "Paiement commission - TR-2024-004", amount: "45 000 FCFA", date: "14 Jan" },
]

export function FinanceOverview() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Aperçu financier</h3>
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">2 450 000 FCFA</span>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${tx.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}>
                {tx.type === "credit" ? (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
              {tx.type === "credit" ? "+" : "-"}
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
