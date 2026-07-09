import { config } from "dotenv"
import { defineConfig } from "prisma/config"

// Prefer Next.js-style .env.local, then fall back to .env
config({ path: ".env.local" })
config({ path: ".env" })

/**
 * Prisma CLI config (migrations / seed).
 * Prefer DIRECT_URL (Supabase session/direct) for migrations; fall back to DATABASE_URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "",
  },
})
