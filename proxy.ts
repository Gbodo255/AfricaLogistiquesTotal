import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * proxy.ts — Protection des routes (Next.js 16+)
 * (remplace l'ancien middleware.ts + supprime le proxy Supabase)
 *
 * /admin/*      → ADMIN, DATA ADMIN
 * /client/*     → PARTICULIER, PME, AGRICULTEUR
 * /transporter/*→ TRANSPORTEUR
 * /moderator/*  → MODERATOR, MODERATEUR
 */

const ROLE_TO_DASHBOARD: Record<string, string> = {
  ADMIN: '/admin',
  'DATA ADMIN': '/admin',
  MODERATOR: '/moderator',
  MODERATEUR: '/moderator',
  PARTICULIER: '/client',
  PME: '/client',
  AGRICULTEUR: '/client',
  TRANSPORTEUR: '/transporter',
}

const ROUTE_ALLOWED_ROLES: Record<string, string[]> = {
  '/admin': ['ADMIN', 'DATA ADMIN'],
  '/moderator': ['MODERATOR', 'MODERATEUR'],
  '/client': ['PARTICULIER', 'PME', 'AGRICULTEUR'],
  '/transporter': ['TRANSPORTEUR'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPrefix = Object.keys(ROUTE_ALLOWED_ROLES).find(prefix =>
    pathname.startsWith(prefix)
  )

  if (!protectedPrefix) {
    return NextResponse.next()
  }

  const token = request.cookies.get('django_token')?.value
  const userRole = request.cookies.get('user_role')?.value?.toUpperCase().trim()

  if (!token || !userRole) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const allowedRoles = ROUTE_ALLOWED_ROLES[protectedPrefix]
  if (!allowedRoles.includes(userRole)) {
    const dashboard = ROLE_TO_DASHBOARD[userRole] || '/auth/login'
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/transporter/:path*', '/moderator/:path*'],
}
