import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseEnvOptional } from "@/lib/supabase/env"

/**
 * Refresh the Supabase auth session on each matched request.
 * Must call `getUser()` so expired tokens are rotated into cookies.
 * Skips cleanly when Supabase env is not configured (e.g. Vercel preview
 * before secrets are added) so the marketing site still boots.
 */
export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnvOptional()

  if (!env) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  // Important: do not remove — refreshes the session.
  try {
    await supabase.auth.getUser()
  } catch (error) {
    console.error("[supabase] session refresh failed", error)
  }

  return supabaseResponse
}
