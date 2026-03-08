import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user role to redirect appropriately
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      const redirectPaths: Record<string, string> = {
        client: "/client",
        transporteur: "/transporter",
        moderateur: "/moderator",
        admin: "/admin",
      }

      const redirectUrl = profile ? redirectPaths[profile.role] || "/client" : next
      return NextResponse.redirect(`${origin}${redirectUrl}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
