"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "light" | "dark" | "auto"
}

export function Logo({ className, showText = false, size = "md", variant = "auto" }: LogoProps) {
  const sizeConfig = {
    sm: { width: 100, height: 34 },
    md: { width: 130, height: 44 },
    lg: { width: 165, height: 56 },
    xl: { width: 210, height: 72 },
  }

  const dimensions = sizeConfig[size]

  // Variant "dark" = logo NÉGATIF (blanc, pour fond sombre)
  // Variant "light" = logo normal (foncé, pour fond clair)
  // Variant "auto" = détection automatique via CSS (dark mode)
  if (variant === "dark") {
    return (
      <div className={cn("flex items-center", className)}>
        <Image
          src="/logo/AFRICA LOGISTICS NEGATIF.png"
          alt="Africa Logistics"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  if (variant === "light") {
    return (
      <div className={cn("flex items-center", className)}>
        <Image
          src="/logo/AFRICA LOGISTICS.png"
          alt="Africa Logistics"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  // Mode "auto" : utilise les classes CSS dark: pour switcher automatiquement
  return (
    <div className={cn("flex items-center", className)}>
      {/* Logo foncé pour fond clair (masqué en dark mode) */}
      <Image
        src="/logo/AFRICA LOGISTICS.png"
        alt="Africa Logistics"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain block dark:hidden"
        priority
      />
      {/* Logo clair (négatif) pour fond sombre (visible en dark mode uniquement) */}
      <Image
        src="/logo/AFRICA LOGISTICS NEGATIF.png"
        alt="Africa Logistics"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain hidden dark:block"
        priority
      />
    </div>
  )
}
