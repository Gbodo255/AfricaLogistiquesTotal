"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, ThumbsUp, MessageSquare } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function TransporterRatingsPage() {
  const { t } = useLanguage()

  const ratings = [
  {
    id: "TR-2024-098",
    client: "Amina Sow",
    clientInitials: "AS",
    date: "10 Jan 2025",
    rating: 5,
    comment: "Très professionnel, livraison rapide et soignée. Je recommande !",
    route: "Parakou → Cotonou",
  },
  {
    id: "TR-2024-095",
    client: "Pierre Mensah",
    clientInitials: "PM",
    date: "08 Jan 2025",
    rating: 5,
    comment: "Excellent service, communication parfaite tout au long du trajet.",
    route: "Lomé → Cotonou",
  },
  {
    id: "TR-2024-090",
    client: "Fatou Diallo",
    clientInitials: "FD",
    date: "05 Jan 2025",
    rating: 4,
    comment: "Bon service, petit retard mais marchandise en parfait état.",
    route: "Cotonou → Lagos",
  },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("transporter_ratings.title")}</h1>
        <p className="text-muted-foreground">{t("transporter_ratings.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="h-6 w-6 text-warning fill-warning" />
              <span className="text-3xl font-bold text-foreground">4.9</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("transporter_ratings.overall_rating")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">156</p>
            <p className="text-sm text-muted-foreground">{t("transporter_ratings.received")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">92%</p>
            <p className="text-sm text-muted-foreground">{t("transporter_ratings.five_stars")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-success">
              <TrendingUp className="h-5 w-5" />
              <span className="text-3xl font-bold">+0.2</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("transporter_wallet.this_month")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating breakdown */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">{t("transporter_ratings.breakdown")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { stars: 5, count: 144, percent: 92 },
            { stars: 4, count: 8, percent: 5 },
            { stars: 3, count: 3, percent: 2 },
            { stars: 2, count: 1, percent: 1 },
            { stars: 1, count: 0, percent: 0 },
          ].map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm text-foreground">{item.stars}</span>
                <Star className="h-4 w-4 text-warning fill-warning" />
              </div>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent ratings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Avis récents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {rating.clientInitials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{rating.client}</p>
                    <p className="text-sm text-muted-foreground">{rating.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating.rating ? "text-warning fill-warning" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rating.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rating.comment}</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {rating.id}
                </Badge>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  Remercier
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <MessageSquare className="h-3 w-3" />
                  Répondre
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
