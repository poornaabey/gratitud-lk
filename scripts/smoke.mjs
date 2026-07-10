/**
 * Lightweight smoke checks against a running Next.js server.
 * Usage: npm run smoke  (expects http://localhost:3000)
 */
import { addDays, format } from "date-fns"

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000"

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`)
  const body = await res.json()
  return { res, body }
}

async function postJson(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  return { res, body }
}

async function main() {
  console.log(`Smoke → ${BASE}`)

  const home = await fetch(`${BASE}/`)
  assert(home.ok, `GET / failed (${home.status})`)
  console.log("✓ GET /")

  const build = await fetch(`${BASE}/build`)
  assert(build.ok, `GET /build failed (${build.status})`)
  console.log("✓ GET /build")

  const checkout = await fetch(`${BASE}/checkout`)
  assert(checkout.ok, `GET /checkout failed (${checkout.status})`)
  console.log("✓ GET /checkout")

  const { res: catalogRes, body: catalog } = await getJson("/api/catalog")
  assert(catalogRes.ok && catalog.ok, "GET /api/catalog failed")
  assert(Array.isArray(catalog.data?.products), "catalog.products missing")
  assert(Array.isArray(catalog.data?.boxTemplates), "catalog.boxTemplates missing")
  console.log(
    `✓ GET /api/catalog (${catalog.data.products.length} products, ${catalog.data.boxTemplates.length} templates)`,
  )

  const packaging = catalog.data.boxTemplates[0]
  const anchor = catalog.data.products.find((p) => p.category === "ANCHOR")
  assert(packaging && anchor, "Need at least one packaging + anchor for checkout smoke")

  const deliveryDate = format(addDays(new Date(), 3), "yyyy-MM-dd")
  const { res: checkoutRes, body: checkoutBody } = await postJson("/api/checkout", {
    box: {
      packagingSlug: packaging.slug,
      anchorSlug: anchor.slug,
      addonSlugs: [],
      message: "Smoke test note",
    },
    isSurprise: true,
    recipientName: "Smoke Recipient",
    recipientPhone: "0771234567",
    recipientEmail: null,
    recipientAddress: "42 Smoke Street, Colombo 07",
    recipientCity: "Colombo",
    deliveryDate,
    billingName: "Smoke Payer",
    billingEmail: "smoke@gratitud.lk",
    billingPhone: "0771234567",
    billingAddress: null,
    demoMode: true,
  })

  assert(checkoutRes.ok && checkoutBody.ok, `POST /api/checkout failed: ${JSON.stringify(checkoutBody)}`)
  assert(checkoutBody.data?.mode === "demo", "Expected demo checkout mode")
  assert(checkoutBody.data?.orderId, "Missing orderId")
  console.log(`✓ POST /api/checkout demo → ${checkoutBody.data.orderId}`)

  const success = await fetch(`${BASE}${checkoutBody.data.redirectUrl}`)
  assert(success.ok, `GET success page failed (${success.status})`)
  console.log("✓ GET /checkout/success")

  console.log("\nAll smoke checks passed.")
}

main().catch((error) => {
  console.error("\nSmoke failed:", error.message)
  process.exit(1)
})
