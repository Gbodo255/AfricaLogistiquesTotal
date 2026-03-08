"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { djangoApi } from "@/lib/api/django"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user_slug = searchParams.get("slug")
  
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!user_slug) {
      router.push("/auth/login")
    }
  }, [user_slug, router])

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (code.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await djangoApi.verifyAccount({
        user_slug: user_slug as string,
        code,
      })

      if (response.error) {
        setError(response.error)
        setIsLoading(false)
        return
      }

      setSuccess("Compte vérifié avec succès ! Redirection vers la page de connexion...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.message || "Code invalide ou expiré")
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!user_slug) return
    
    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await djangoApi.resendVerificationCode({
        user_slug,
      })

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Un nouveau code a été envoyé à votre adresse email.")
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du code")
    } finally {
      setIsResending(false)
    }
  }

  // Auto-submit when code is full
  useEffect(() => {
    if (code.length === 6) {
      handleVerify()
    }
  }, [code])

  return (
    <div className="w-full max-w-md">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </Link>

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Vérification du compte</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entrez le code à 6 chiffres envoyé par email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="w-full border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={isLoading || !!success}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={() => handleVerify()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || code.length !== 6 || !!success}
          >
            {isLoading ? "Vérification..." : "Vérifier mon compte"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas reçu de code ?{" "}
            <button
              onClick={handleResendCode}
              disabled={isResending || !!success}
              className="text-primary hover:underline font-medium inline-flex items-center gap-1 disabled:opacity-50"
            >
              {isResending && <RefreshCw className="h-3 w-3 animate-spin" />}
              Renvoyer le code
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
