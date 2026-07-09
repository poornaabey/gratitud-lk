import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

/**
 * Next.js 16 Proxy (formerly Middleware).
 * Keeps Supabase auth cookies fresh on page navigations.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap, robots
     * - common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
