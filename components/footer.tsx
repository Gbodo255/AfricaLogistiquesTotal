"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"
import { Logo } from "@/components/logo"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo size="sm" showText={true} className="mb-4" />
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {"Africa Logistique - La solution digitale pour le transport de marchandises en Afrique de l'Ouest. Fiabilité, rapidité et sécurité."}
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">{"Services"}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Transporteurs"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Navigation"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Suivi A-TRACKER"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Solutions entreprises"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">{"Plateforme"}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Devenir transporteur"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Tarification"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Aide & Support"}
                </Link>
              </li>
              <li>
                <Link href="/legal/cgu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {"Conditions d'utilisation"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">{"Contactez-nous"}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
                <span>{t("footer.bp")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{t("footer.email")}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            {"© 2025 Africa Logistics. Tous droits réservés."}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/legal/cgu" className="text-muted-foreground hover:text-foreground transition-colors">
              CGU
            </Link>
            <Link href="/legal/cgv" className="text-muted-foreground hover:text-foreground transition-colors">
              CGV
            </Link>
            <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              {"Confidentialité"}
            </Link>
            <Link href="/legal/moderator-charter" className="text-muted-foreground hover:text-foreground transition-colors">
              {"Charte modérateurs"}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {"Mentions légales"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
