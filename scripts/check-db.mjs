/**
 * Quick DB connectivity check for GratituD.lk
 * Usage: node --env-file=.env.local scripts/check-db.mjs
 */
import { PrismaClient } from "../src/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"

const url = process.env.DATABASE_URL
if (!url) {
  console.error("❌ DATABASE_URL is missing in .env.local")
  process.exit(1)
}

const host = new URL(url).hostname
console.log(`Connecting via DATABASE_URL host: ${host}`)

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
})

try {
  const [products, templates] = await Promise.all([
    prisma.product.count(),
    prisma.boxTemplate.count(),
  ])
  console.log("✅ Connected to Supabase Postgres")
  console.log(`   products: ${products}`)
  console.log(`   box_templates: ${templates}`)
  if (products === 0 || templates === 0) {
    console.log("\nTip: run  npm run db:seed  to load the catalog.")
  }
} catch (error) {
  console.error("❌ Connection / query failed:")
  console.error(error instanceof Error ? error.message : error)
  console.error("\nChecklist:")
  console.error("1. DATABASE_URL uses the Transaction pooler (port 6543) + ?pgbouncer=true")
  console.error("2. DIRECT_URL uses Session (5432) or Direct host for migrations")
  console.error("3. Password is URL-encoded if it has special characters (@ # % etc.)")
  console.error("4. You ran: npm run db:migrate   (or db:push)")
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
