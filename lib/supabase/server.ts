import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createMockClient } from "./mock"

export async function createClient() {
  // Force use of mock client for demo purposes
  return createMockClient()
}
