"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Truck,
  MapPin,
  Shield,
  Wallet,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Globe,
  Clock,
  Headphones,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n/context"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md animate-fade-in">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-8">
              <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                {t("nav.services") || "Services"}
              </Link>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                {t("nav.features") || "Fonctionnalités"}
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                {t("nav.about") || "À propos"}
              </Link>
              <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                {t("nav.contact") || "Contact"}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:bg-secondary">
                  {t("auth.login")}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105">
                  {t("auth.register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 overflow-hidden hero-gradient-animated">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="animate-badge inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm text-primary font-medium">{t("hero.badge")}</span>
              </div>

              {/* Title */}
              <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                {t("hero.title")}
              </h1>

              {/* Description */}
              <p className="animate-fade-in-up delay-200 text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.desc")}
              </p>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    {t("hero.cta.start")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary gap-2 w-full sm:w-auto bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    {t("hero.cta.discover")}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up delay-400 flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">5000+</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stats.transporters")}</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">15K+</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stats.deliveries")}</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">99.5%</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stats.satisfaction")}</div>
                </div>
              </div>
            </div>

            {/* Hero card — floats gently */}
            <div className="animate-fade-in-right delay-300 relative hidden lg:block">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl" />
              <div className="animate-float relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">{t("hero.tracking.title")}</h3>
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">{t("hero.tracking.status")}</span>
                </div>
                <div className="aspect-video bg-secondary/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/africa-logistics-hero.png"
                    alt={t("hero.tracking.title")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-primary animate-ping absolute" />
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center relative">
                        <Truck className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{t("hero.tracking.route")}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("hero.tracking.distance")}: 165 km • {t("hero.tracking.eta")}: 2h30
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>75% {t("hero.tracking.completed")}</span>
                    <span>{t("hero.tracking.estimated")}: 14h30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="animate-fade-in-up text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("services.title")}</h2>
            <p className="text-muted-foreground">{t("services.desc")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: t("services.freight"), description: t("services.freight_desc") },
              { icon: Globe, title: t("services.regional"), description: t("services.regional_desc") },
              { icon: Clock, title: t("services.express"), description: t("services.express_desc") },
              { icon: Wallet, title: t("services.secure_payment"), description: t("services.secure_payment_desc") },
              { icon: MapPin, title: t("services.tracking"), description: t("services.tracking_desc") },
              { icon: Headphones, title: t("services.support"), description: t("services.support_desc") },
            ].map((service, index) => (
              <div
                key={index}
                className={`animate-fade-in-up delay-${(index + 1) * 100} card-hover-glow group p-7 bg-card border border-border rounded-xl transition-all duration-300`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transition-transform">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("features.title")}</h2>
              <div className="space-y-6">
                {[
                  { icon: Users, title: t("features.for_clients"), description: t("features.for_clients_desc") },
                  { icon: Truck, title: t("features.for_transporters"), description: t("features.for_transporters_desc") },
                  { icon: Shield, title: t("features.for_moderators"), description: t("features.for_moderators_desc") },
                  { icon: BarChart3, title: t("features.for_admins"), description: t("features.for_admins_desc") },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-fade-in-right relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="card-hover-glow animate-scale-in delay-100 bg-card border border-border rounded-xl p-5">
                    <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">{t("features.availability")}</div>
                  </div>
                  <div className="card-hover-glow animate-scale-in delay-300 bg-card border border-border rounded-xl p-5">
                    <div className="text-2xl font-bold text-success mb-1">99.5%</div>
                    <div className="text-sm text-muted-foreground">{t("features.sla")}</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="card-hover-glow animate-scale-in delay-200 bg-card border border-border rounded-xl p-5">
                    <div className="text-2xl font-bold text-foreground mb-1">{"<"}300ms</div>
                    <div className="text-sm text-muted-foreground">{t("features.response_time")}</div>
                  </div>
                  <div className="card-hover-glow animate-scale-in delay-400 bg-card border border-border rounded-xl p-5">
                    <div className="text-2xl font-bold text-warning mb-1">HTTPS</div>
                    <div className="text-sm text-muted-foreground">{t("features.ssl")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="animate-fade-in-up text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("howitworks.title")}</h2>
            <p className="text-muted-foreground">{t("howitworks.desc")}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t("howitworks.step1.title"), description: t("howitworks.step1.desc") },
              { step: "02", title: t("howitworks.step2.title"), description: t("howitworks.step2.desc") },
              { step: "03", title: t("howitworks.step3.title"), description: t("howitworks.step3.desc") },
              { step: "04", title: t("howitworks.step4.title"), description: t("howitworks.step4.desc") },
            ].map((item, index) => (
              <div
                key={index}
                className="animate-fade-in-up relative text-center px-2"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="step-circle mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4 cursor-default">
                  {item.step}
                </div>
                {index < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />}
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="animate-scale-in bg-card border border-border rounded-2xl p-10 md:p-14 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold text-foreground mb-6">{t("hero.guarantees.title")}</h2>
                <ul className="space-y-4">
                  {[
                    t("hero.guarantees.verified"),
                    t("hero.guarantees.insurance"),
                    t("hero.guarantees.secure_payment"),
                    t("hero.guarantees.support_24"),
                    t("hero.guarantees.refund"),
                    t("hero.guarantees.gdpr"),
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 group">
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-fade-in-right bg-secondary/50 rounded-xl p-8 text-center transition-all duration-300 hover:bg-secondary/70">
                <div className="text-5xl font-bold text-primary mb-2 animate-pulse">10%</div>
                <div className="text-lg font-medium text-foreground mb-4">{t("hero.guarantees.commission")}</div>
                <p className="text-sm text-muted-foreground mb-6">{t("hero.guarantees.commission_desc")}</p>
                <Link href="/auth/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                    {t("hero.guarantees.create_account")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-primary/5">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="animate-fade-in-up text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("hero.cta.ready")}</h2>
            <p className="text-muted-foreground mb-8">{t("hero.cta.join")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=client">
                <Button
                  size="lg"
                  className="animate-fade-in-left delay-100 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <Users className="h-5 w-5" />
                  {t("hero.cta.i_am_client")}
                </Button>
              </Link>
              <Link href="/auth/register?role=transporter">
                <Button
                  size="lg"
                  variant="outline"
                  className="animate-fade-in-right delay-100 border-border text-foreground hover:bg-secondary gap-2 w-full sm:w-auto bg-transparent transition-all duration-200 hover:scale-105"
                >
                  <Truck className="h-5 w-5" />
                  {t("hero.cta.i_am_transporter")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-sm text-muted-foreground">{t("footer.desc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("footer.platform")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    {t("auth.login")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    {t("auth.register")}
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    {t("nav.features") || "Fonctionnalités"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/legal/cgu" className="hover:text-foreground transition-colors">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cgv" className="hover:text-foreground transition-colors">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/moderator-charter" className="hover:text-foreground transition-colors">
                    {t("footer.moderator_charter")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("footer.contact")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t("footer.email")}</li>
                <li className="pl-0">{t("footer.bp")}</li>
                <li>{t("footer.address")}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
            <p className="text-sm text-muted-foreground">
              {t("footer.powered_by")} <span className="text-primary">AFRI-PRO</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
