/**
 * Link Supabase Postgres → write DATABASE_URL / DIRECT_URL → migrate → seed → check
 *
 * Usage (pick one):
 *   npm run db:link
 *   SUPABASE_DB_PASSWORD='your-password' npm run db:link
 *
 * Or put the password alone in .supabase-db-password (gitignored), then:
 *   npm run db:link
 */
import { config } from "dotenv"
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs"
import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { execSync } from "node:child_process"
import { resolve } from "node:path"

config({ path: ".env.local" })
config({ path: ".env" })

const PROJECT_REF = "vqqljzydkcuvgzxauowt"
const POOLER_HOST = "aws-1-ap-southeast-1.pooler.supabase.com"
const ENV_PATH = resolve(process.cwd(), ".env.local")
const PASSWORD_FILE = resolve(process.cwd(), ".supabase-db-password")

function buildUrls(password) {
  const encoded = encodeURIComponent(password)
  const databaseUrl = `postgresql://postgres.${PROJECT_REF}:${encoded}@${POOLER_HOST}:6543/postgres?pgbouncer=true`
  const directUrl = `postgresql://postgres.${PROJECT_REF}:${encoded}@${POOLER_HOST}:5432/postgres`
  return { databaseUrl, directUrl }
}

function upsertEnv(contents, key, value) {
  const line = `${key}="${value}"`
  const re = new RegExp(`^${key}=.*$`, "m")
  if (re.test(contents)) {
    return contents.replace(re, line)
  }
  // Insert after the database section header if present
  if (contents.includes("# ---- Database")) {
    return contents.replace(
      /(# ---- Database[^\n]*\n(?:#[^\n]*\n)*)/,
      `$1${line}\n`,
    )
  }
  return `${key}="${value}"\n${contents}`
}

async function readPassword() {
  if (process.env.SUPABASE_DB_PASSWORD?.trim()) {
    return process.env.SUPABASE_DB_PASSWORD.trim()
  }

  if (existsSync(PASSWORD_FILE)) {
    const fromFile = readFileSync(PASSWORD_FILE, "utf8").trim()
    if (fromFile) {
      console.log("Using password from .supabase-db-password")
      return fromFile
    }
  }

  if (!input.isTTY) {
    throw new Error(
      "No password found. Either:\n" +
        "  1) Run:  SUPABASE_DB_PASSWORD='your-password' npm run db:link\n" +
        "  2) Put the password in a file named .supabase-db-password (one line), then npm run db:link\n" +
        "  3) Run npm run db:link in an interactive terminal and type the password when asked",
    )
  }

  const rl = createInterface({ input, output })
  const password = await rl.question(
    "Paste your Supabase database password (input hidden in most terminals): ",
  )
  rl.close()
  return password.trim()
}

async function main() {
  console.log("\nGratituD → Supabase DB linker\n")

  const password = await readPassword()
  if (!password || password.includes("YOUR-PASSWORD")) {
    throw new Error("A real database password is required.")
  }

  const { databaseUrl, directUrl } = buildUrls(password)

  let env = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : ""
  env = upsertEnv(env, "DATABASE_URL", databaseUrl)
  env = upsertEnv(env, "DIRECT_URL", directUrl)

  // Ensure auth URL is present
  if (!/^NEXT_PUBLIC_SUPABASE_URL=/m.test(env)) {
    env =
      `NEXT_PUBLIC_SUPABASE_URL="https://${PROJECT_REF}.supabase.co"\n` + env
  }

  writeFileSync(ENV_PATH, env, "utf8")
  console.log("✅ Wrote DATABASE_URL + DIRECT_URL to .env.local")

  // Reload for child processes
  process.env.DATABASE_URL = databaseUrl
  process.env.DIRECT_URL = directUrl

  console.log("\n→ Generating Prisma client…")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("\n→ Pushing schema to Supabase (db push)…")
  try {
    execSync("npx prisma db push", { stdio: "inherit", env: process.env })
  } catch {
    console.log("\n db push failed — trying migrate deploy…")
    execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env })
  }

  console.log("\n→ Seeding catalog…")
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env })

  console.log("\n→ Verifying connection…")
  execSync("npm run db:check", { stdio: "inherit", env: process.env })

  if (existsSync(PASSWORD_FILE)) {
    unlinkSync(PASSWORD_FILE)
    console.log("Removed .supabase-db-password for safety.")
  }

  console.log("\n🎉 Supabase database is connected and seeded.\n")
}

main().catch((error) => {
  console.error("\n❌", error instanceof Error ? error.message : error)
  process.exit(1)
})
