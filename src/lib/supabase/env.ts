/**
 * Shared Supabase public env (URL + publishable/anon key).
 * Supports both the new publishable key and classic anon JWT.
 */

export type SupabaseEnv = {
  url: string
  key: string
}

export function getSupabaseEnvOptional(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim()

  if (!url || !key) return null
  return { url, key }
}

export function getSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnvOptional()
  if (!env?.url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!env.key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    )
  }
  return env
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnvOptional() !== null
}
