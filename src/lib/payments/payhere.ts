import crypto from "node:crypto"

export type PayHereConfig = {
  merchantId: string
  merchantSecret: string
  sandbox: boolean
  checkoutUrl: string
  siteUrl: string
}

export function getPayHereConfig(): PayHereConfig {
  const env =
    process.env.NEXT_PUBLIC_PAYHERE_ENV ??
    (process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false" ? "sandbox" : "production")
  const sandbox = env !== "production"

  const merchantId = (
    process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ??
    process.env.PAYHERE_MERCHANT_ID ??
    ""
  ).trim()

  return {
    merchantId,
    merchantSecret: (process.env.PAYHERE_MERCHANT_SECRET ?? "").trim(),
    sandbox,
    checkoutUrl: sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout",
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim(),
  }
}

export function isPayHereConfigured(config: PayHereConfig = getPayHereConfig()): boolean {
  return Boolean(config.merchantId && config.merchantSecret)
}

export function getPayHereCheckoutBaseUrl(config: PayHereConfig = getPayHereConfig()): string {
  const override = process.env.PAYHERE_CHECKOUT_BASE_URL?.trim()
  if (override) return override.replace(/\/$/, "")
  return config.siteUrl.replace(/\/$/, "")
}

export function getPayHereNotifyUrl(config: PayHereConfig = getPayHereConfig()): string {
  const override = process.env.PAYHERE_NOTIFY_URL?.trim()
  if (override) return override.replace(/\/$/, "")
  return `${getPayHereCheckoutBaseUrl(config)}/api/payhere/notify`
}

/** LKR cents → PayHere amount string e.g. "14500.00" */
export function formatPayHereAmount(cents: number): string {
  return (cents / 100).toFixed(2)
}

/**
 * Checkout request hash (server-side only).
 * MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
 */
export function generateCheckoutHash(
  merchantId: string,
  orderId: string,
  amountFormatted: string,
  currency: string,
  merchantSecret: string,
): string {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase()

  return crypto
    .createHash("md5")
    .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
    .digest("hex")
    .toUpperCase()
}

/** Verify PayHere notify_url POST (md5sig). status_code 2 = success. */
export function verifyNotificationHash(params: {
  merchantId: string
  orderId: string
  payhereAmount: string
  payhereCurrency: string
  statusCode: string
  md5sig: string
  merchantSecret: string
}): boolean {
  const hashedSecret = crypto
    .createHash("md5")
    .update(params.merchantSecret)
    .digest("hex")
    .toUpperCase()

  const local = crypto
    .createHash("md5")
    .update(
      params.merchantId +
        params.orderId +
        params.payhereAmount +
        params.payhereCurrency +
        params.statusCode +
        hashedSecret,
    )
    .digest("hex")
    .toUpperCase()

  return local === params.md5sig.toUpperCase()
}

export function normalizePayHerePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("94") && digits.length >= 11) {
    return `0${digits.slice(2)}`
  }
  return digits
}

export function splitCustomerName(fullName: string): {
  firstName: string
  lastName: string
} {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0] || "Customer", lastName: "." }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

/** Build PayHere Checkout API form fields (server-side only). */
export function buildPayHereCheckoutFields(input: {
  orderId: string
  amountCents: number
  itemsLabel: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
}): { action: string; fields: Record<string, string>; sandbox: boolean } {
  const config = getPayHereConfig()
  const currency = "LKR"
  const amount = formatPayHereAmount(input.amountCents)
  const { firstName, lastName } = splitCustomerName(input.customerName)
  const base = getPayHereCheckoutBaseUrl(config)

  const hash = generateCheckoutHash(
    config.merchantId,
    input.orderId,
    amount,
    currency,
    config.merchantSecret,
  )

  return {
    action: config.checkoutUrl,
    sandbox: config.sandbox,
    fields: {
      merchant_id: config.merchantId,
      return_url: `${base}/checkout/success?order=${encodeURIComponent(input.orderId)}`,
      cancel_url: `${base}/checkout/error?order=${encodeURIComponent(input.orderId)}`,
      notify_url: getPayHereNotifyUrl(config),
      order_id: input.orderId,
      items: input.itemsLabel.slice(0, 250),
      amount,
      currency,
      hash,
      first_name: firstName,
      last_name: lastName,
      email: input.customerEmail,
      phone: normalizePayHerePhone(input.customerPhone),
      address: input.address.slice(0, 200),
      city: input.city,
      country: "Sri Lanka",
    },
  }
}
