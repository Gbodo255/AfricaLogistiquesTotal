"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { djangoApi } from "@/lib/api/django"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    try {
      // Utiliser l'API Django pour la connexion
      const response = await djangoApi.login({
        email,
        password,
      })

      if (response.error) {
        if (response.is_not_verified && response.user_slug) {
          setError("Votre compte n'est pas vérifié. Redirection vers la page de vérification...")
          setTimeout(() => {
            router.push(`/auth/verify?slug=${response.user_slug}`)
          }, 2000)
        } else {
          setError(response.error)
        }
        setIsLoading(false)
        return
      }

      if (!response.user) {
        setError("Erreur lors de la connexion")
        setIsLoading(false)
        return
      }

      // Vérifier si le compte est actif
      if (response.user.is_active === false) {
        djangoApi.setToken(null)
        setError("Votre compte a été désactivé. Contactez le support.")
        setIsLoading(false)
        return
      }

      // Vérifier si transporteur non approuvé
      if (response.user.role === 'TRANSPORTEUR' && !response.user.is_approved) {
        djangoApi.setToken(null)
        setError("Votre demande est en cours de validation. Vous recevrez un email une fois votre compte approuvé.")
        setIsLoading(false)
        return
      }

      // Vérifier si le compte est vérifié (email)
      if (!response.user.is_verified) {
        djangoApi.setToken(null)
        setError("Veuillez vérifier votre email avant de vous connecter.")
        setIsLoading(false)
        return
      }

      // Redirection basée sur le rôle (harmonisation majuscules/minuscules)
      const role = (response.user.role || "").toUpperCase()
      const redirectPaths: Record<string, string> = {
        PARTICULIER: "/client",
        PME: "/client",
        AGRICULTEUR: "/client",
        TRANSPORTEUR: "/transporter",
        MODERATOR: "/moderator",
        MODERATEUR: "/moderator",
        ADMIN: "/admin",
        "DATA ADMIN": "/admin",
      }

      // Cookies réels pour le middleware (plus de simulation)
      // - `django_token` permet au middleware de savoir qu'on est authentifié (server-side)
      // - `user_role` permet le contrôle d'accès par rôle
      if (response.token) {
        document.cookie = `django_token=${response.token}; path=/; max-age=86400`
      }
      document.cookie = `user_role=${role}; path=/; max-age=86400`

      const redirectPath = redirectPaths[role] || "/client"

      console.log(`Redirecting user with role ${role} to ${redirectPath}`)

      // Forcer un rechargement complet pour que le middleware relise les cookies
      window.location.href = redirectPath

    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Une erreur s'est produite lors de la connexion")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Bienvenue sur votre plateforme logistique
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Connectez-vous pour accéder à votre espace personnel et gérer vos opérations de transport.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Transporteurs actifs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15K+</div>
                <div className="text-sm text-muted-foreground">Livraisons réussies</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Africa Logistics. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          <Card className="border-border bg-card">
            <CardHeader className="space-y-1">
              <div className="mb-2 lg:hidden">
                <Logo size="md" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Connexion</CardTitle>
              <CardDescription className="text-muted-foreground">
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}


              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">
                      Mot de passe
                    </Label>
                    <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
              <p className="text-sm text-center text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
