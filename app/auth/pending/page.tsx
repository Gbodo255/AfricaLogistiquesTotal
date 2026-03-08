"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowLeft, Truck, CheckCircle2, Mail, FileText } from "lucide-react"

export default function PendingVerificationPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "verification" // "verification" ou "approval"

  const isApprovalPending = type === "approval"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isApprovalPending 
                ? "Demande en attente d'approbation" 
                : "Compte en attente de validation"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isApprovalPending
                ? "Votre demande de transporteur est en cours de vérification par notre équipe d'administration."
                : "Votre compte transporteur est en cours de vérification par notre équipe."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {isApprovalPending
                  ? "Un administrateur va vérifier vos documents et véhicules. Vous recevrez un email dès que votre demande sera approuvée."
                  : "Ce processus prend généralement 24 à 48 heures ouvrables. Vous recevrez un email dès que votre compte sera validé."}
              </p>

              <div className="space-y-3 p-4 rounded-xl bg-secondary/50">
                <h4 className="font-medium text-foreground text-sm">Prochaines étapes :</h4>
                <div className="space-y-2">
                  {isApprovalPending ? [
                    "Vérification de vos documents légaux",
                    "Validation de vos véhicules",
                    "Approbation par un administrateur",
                    "Réception d'un email de confirmation",
                  ] : [
                    "Vérification de vos informations",
                    "Validation de vos documents",
                    "Activation de votre compte",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {isApprovalPending && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Vérifiez votre boîte email
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Vous recevrez un email dès que votre demande sera approuvée. Vous pourrez alors accéder à votre dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  Retour à la connexion
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Des questions ? Contactez-nous à{" "}
                <a href="mailto:support@a-logistics.com" className="text-primary hover:underline">
                  support@a-logistics.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
