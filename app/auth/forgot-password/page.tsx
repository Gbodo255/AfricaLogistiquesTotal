"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Mail, Phone, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<"email" | "phone">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Mot de passe oublié ?</CardTitle>
            <CardDescription className="text-muted-foreground">
              {sent ? "Vérifiez votre boîte de réception" : "Nous vous enverrons un lien de réinitialisation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Un lien de réinitialisation a été envoyé à votre{" "}
                  {method === "email" ? "adresse email" : "numéro de téléphone"}. Veuillez vérifier et suivre les
                  instructions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-border text-foreground hover:bg-secondary bg-transparent"
                  onClick={() => setSent(false)}
                >
                  Renvoyer le lien
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Tabs value={method} onValueChange={(v) => setMethod(v as "email" | "phone")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                    <TabsTrigger
                      value="email"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Téléphone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4 mt-0">
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
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">
                        Numéro de téléphone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+229 XX XX XX XX"
                          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
            <p className="text-sm text-center text-muted-foreground">
              Vous vous souvenez ?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
