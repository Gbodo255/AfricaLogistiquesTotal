"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Background texture */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center max-w-md text-center gap-8">
                {/* Logo */}
                <Link href="/">
                    <Logo size="md" showText={true} />
                </Link>

                {/* 404 Visual */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <p className="text-[120px] font-black text-primary/10 leading-none select-none">
                            404
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-warning/10 border-2 border-warning/20 flex items-center justify-center">
                                <AlertTriangle className="h-10 w-10 text-warning" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            Page introuvable
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Oups ! La page que vous recherchez n&apos;existe pas ou a été déplacée.
                            Vérifiez l&apos;URL ou revenez à l&apos;accueil.
                        </p>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="w-full p-4 rounded-xl bg-card border border-border text-left space-y-3">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        Que souhaitez-vous faire ?
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <Link href="/client" className="flex items-center gap-2 hover:text-primary transition-colors py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                            Accéder à mon espace client
                        </Link>
                        <Link href="/transporter" className="flex items-center gap-2 hover:text-primary transition-colors py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                            Accéder à mon espace transporteur
                        </Link>
                        <Link href="/auth/login" className="flex items-center gap-2 hover:text-primary transition-colors py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                            Se connecter
                        </Link>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Home className="h-4 w-4" />
                            Accueil
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-xs text-muted-foreground">
                    © 2025 Africa Logistics — Besoin d&apos;aide ?{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                        Contactez-nous
                    </Link>
                </p>
            </div>
        </div>
    )
}
