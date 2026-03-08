"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { useClientRequests } from "@/lib/hooks/use-transport-requests"
import { useAuth } from "@/lib/auth/context"
import { djangoApi } from "@/lib/api/django"
import useSWR from "swr"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function RatingsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: requests, isLoading: requestsLoading } = useClientRequests(user?.id)
  const { data: ratingsData, isLoading: ratingsLoading, mutate: mutateRatings } = useSWR(
    user?.id ? "my-ratings" : null,
    () => djangoApi.getMyRatings()
  )

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ratings = ratingsData?.ratings || []
  
  // Demandes livrées mais pas encore notées
  const pendingRatings = requests?.filter((r: any) => 
    r.status === "DELIVERED" && !ratings.find((rt: any) => rt.transport_request_slug === r.slug)
  ) || []

  const handleRate = (request: any) => {
    setSelectedRequest(request)
    setIsRatingModalOpen(true)
  }

  const handleSubmitRating = async () => {
    if (!selectedRequest) return
    
    setIsSubmitting(true)
    try {
      await djangoApi.createRating({
        transport_request_slug: selectedRequest.slug,
        score: ratingScore,
        comment: comment
      })
      mutateRatings()
      setIsRatingModalOpen(false)
      setSelectedRequest(null)
      setComment("")
      setRatingScore(5)
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((acc: number, r: any) => acc + r.score, 0) / ratings.length).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("ratings.title")}</h1>
        <p className="text-muted-foreground">{t("ratings.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-5 w-5 text-warning fill-warning" />
              <span className="text-2xl font-bold text-foreground">{averageRating}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("ratings.average_given")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{ratings.length}</p>
            <p className="text-sm text-muted-foreground">{t("ratings.given")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{pendingRatings.length}</p>
            <p className="text-sm text-muted-foreground">{t("ratings.pending")}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {ratings.length > 0 ? Math.round((ratings.filter((r: any) => r.score >= 4).length / ratings.length) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">{t("ratings.satisfaction_rate")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending ratings */}
      {pendingRatings.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              {t("ratings.pending_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRatings.map((item: any) => (
              <div
                key={item.slug}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {item.assigned_transporter_name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.assigned_transporter_name || t("history.not_assigned")}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.pickup_city} → {item.delivery_city} • {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => handleRate(item)}
                >
                  <Star className="h-4 w-4" />
                  {t("ratings.rate")}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Given ratings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("ratings.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(requestsLoading || ratingsLoading) ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              {t("ratings.no_ratings")}
            </div>
          ) : (
            ratings.map((rating: any) => (
              <div key={rating.slug} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {rating.transporter_name?.[0] || "T"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{rating.transporter_name}</p>
                      <p className="text-sm text-muted-foreground">{rating.route || "Livraison terminée"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating.score ? "text-warning fill-warning" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(rating.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rating.comment}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    {rating.transport_request_slug}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Rating Modal */}
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Noter la livraison</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Partagez votre expérience avec {selectedRequest?.assigned_transporter_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Note</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setRatingScore(score)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        score <= ratingScore ? "text-warning fill-warning" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Commentaire (optionnel)</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: Livraison très rapide, chauffeur poli..."
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRatingModalOpen(false)} className="border-border text-foreground bg-transparent">
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitRating} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Envoyer la note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
