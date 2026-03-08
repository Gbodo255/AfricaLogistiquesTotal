import { createBrowserClient } from "@supabase/ssr"
import { createMockClient } from "./mock"

let client: any = null

export function createClient() {
  if (client) return client

  // Force use of mock client for demo purposes
  console.log("Using Mock Supabase Client (Demo Mode)")
  client = createMockClient()

  return client
}
