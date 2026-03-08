"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Calendar, Star, Download, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"
import { useClientRequests } from "@/lib/hooks/use-transport-requests"
import { useAuth } from "@/lib/auth/context"
import { useState } from "react"
import { djangoApi } from "@/lib/api/django"
import useSWR from "swr"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { generateClientHistoryPDF, downloadAndEmailPDF } from "@/lib/services/pdf-generator"

export default function HistoryPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: requests, isLoading, mutate: mutateRequests } = useClientRequests(user?.id)

  const { data: ratingsData, isLoading: ratingsLoading, mutate: mutateRatings } = useSWR(
    user?.id ? "my-ratings" : null,
    () => djangoApi.getMyRatings()
  )

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const ratings = ratingsData?.ratings || []
  const deliveredRequests = requests?.filter((r: any) => r.status === "DELIVERED") || []

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

  const totalAmount = deliveredRequests.reduce((acc: number, r: any) => acc + (parseFloat(r.estimated_price) || 0), 0)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const blob = generateClientHistoryPDF({
        requests: deliveredRequests,
        userName: `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "Client",
        userEmail: user?.email || "",
        period: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      })
      const filename = `historique-livraisons-${new Date().toISOString().split("T")[0]}.pdf`
      const { success } = await downloadAndEmailPDF({
        blob,
        filename,
        userEmail: user?.email || "",
        reportTitle: "Historique des transports",
      })
      toast.success(
        success
          ? "PDF téléchargé et envoyé par email !"
          : "PDF téléchargé. L'envoi email a échoué.",
        { duration: 4000 }
      )
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF")
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("history.title")}</h1>
            <p className="text-muted-foreground">{t("history.subtitle")}</p>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-border text-foreground bg-transparent"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? "Génération..." : t("history.export")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{deliveredRequests.length}</p>
              <p className="text-sm text-muted-foreground">{t("history.total_deliveries")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">100%</p>
              <p className="text-sm text-muted-foreground">{t("history.success_rate")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">--</p>
              <p className="text-sm text-muted-foreground">{t("history.average_rating")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{totalAmount.toLocaleString()} FCFA</p>
              <p className="text-sm text-muted-foreground">{t("history.total_transported")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("history.search")}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
              <Button variant="outline" className="gap-2 border-border text-foreground bg-transparent">
                <Filter className="h-4 w-4" />
                {t("history.filter")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : deliveredRequests.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
              {t("history.no_data")}
            </div>
          ) : (
            deliveredRequests.map((item: any) => (
              <Card key={item.slug} className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{item.slug}</span>
                        <Badge className="bg-success/20 text-success">{t(`status.${item.status.toLowerCase()}`)}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.pickup_city} → {item.delivery_city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {t("history.transporter")}: <span className="text-foreground">{item.assigned_transporter_name || t("history.not_assigned")}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <p className="text-lg font-bold text-foreground">{parseFloat(item.estimated_price).toLocaleString()} FCFA</p>
                      <div className="flex gap-2">
                        {item.status === "DELIVERED" && !ratings.find((r: any) => r.transport_request_slug === item.slug) && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1 bg-primary text-primary-foreground"
                            onClick={() => handleRate(item)}
                          >
                            <Star className="h-4 w-4" />
                            {t("ratings.rate")}
                          </Button>
                        )}
                        <Link href={`/client/requests/${item.slug}`}>
                          <Button variant="outline" size="sm" className="gap-1 border-border text-foreground bg-transparent">
                            <Eye className="h-4 w-4" />
                            {t("history.view")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

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
                      className={`h-8 w-8 ${score <= ratingScore ? "text-warning fill-warning" : "text-muted-foreground"
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
    </>
  )
}
