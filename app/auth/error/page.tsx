import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Truck } from "lucide-react"

export default function AuthErrorPage() {
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
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Erreur d'authentification</CardTitle>
            <CardDescription className="text-muted-foreground">
              Une erreur s'est produite lors de la vérification de votre compte. Veuillez réessayer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Retour à la connexion
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Créer un nouveau compte
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
