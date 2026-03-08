import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  /**
   * IMPORTANT:
   * On ne se base plus sur la simulation (cookie `mock_user_id`).
   * Le frontend utilise l'API Django + token Bearer.
   *
   * Pour permettre au middleware (server-side) de savoir si l'utilisateur est connecté,
   * on stocke le token dans un cookie non-HttpOnly (`django_token`) lors du login.
   * (Idéalement: cookie HttpOnly via route handler, mais on reste compatible avec l'existant.)
   */
  const djangoToken = request.cookies.get("django_token")?.value
  const userRole = request.cookies.get("user_role")?.value?.toUpperCase()

  // If user is authenticated and trying to access auth pages, redirect to their dashboard
  if (
    djangoToken &&
    (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/register"))
  ) {
    const redirectPaths: Record<string, string> = {
      CLIENT: "/client",
      PARTICULIER: "/client",
      PME: "/client",
      AGRICULTEUR: "/client",
      TRANSPORTEUR: "/transporter",
      MODERATOR: "/moderator",
      MODERATEUR: "/moderator",
      ADMIN: "/admin",
      "DATA ADMIN": "/admin",
    }

    const currentRole = userRole?.toUpperCase() || ""
    const redirectUrl = redirectPaths[currentRole] || "/client"
    const url = request.nextUrl.clone()
    url.pathname = redirectUrl
    return NextResponse.redirect(url)
  }

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ["/client", "/transporter", "/moderator", "/admin"]
  const currentPath = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some((path) => currentPath.startsWith(path))

  if (isProtectedPath && !djangoToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (djangoToken && userRole) {
    const currentRole = userRole.toUpperCase()
    const roleRoutes: Record<string, string[]> = {
      CLIENT: ["/client"],
      PARTICULIER: ["/client"],
      PME: ["/client"],
      AGRICULTEUR: ["/client"],
      TRANSPORTEUR: ["/transporter"],
      MODERATOR: ["/moderator", "/client", "/transporter"],
      MODERATEUR: ["/moderator", "/client", "/transporter"],
      ADMIN: ["/admin", "/moderator", "/client", "/transporter"],
      "DATA ADMIN": ["/admin", "/moderator", "/client", "/transporter"],
    }

    const allowedPaths = roleRoutes[currentRole] || []
    const currentBasePath = "/" + currentPath.split("/")[1]

    // Si on est sur un chemin protégé mais non autorisé pour ce rôle
    if (protectedPaths.includes(currentBasePath) && !allowedPaths.includes(currentBasePath)) {
      // Rediriger vers le dashboard approprié
      const url = request.nextUrl.clone()
      url.pathname =
        currentRole === "ADMIN" || currentRole === "DATA ADMIN"
          ? "/admin"
          : currentRole === "MODERATOR" || currentRole === "MODERATEUR"
            ? "/moderator"
            : currentRole === "TRANSPORTEUR"
              ? "/transporter"
              : "/client"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
