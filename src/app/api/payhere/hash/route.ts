import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import {
  formatPayHereAmount,
  generateCheckoutHash,
  getPayHereConfig,
  isPayHereConfigured,
} from "@/lib/payments/payhere"
import { z } from "zod"

const hashRequestSchema = z.object({
  orderId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().default("LKR"),
})

/**
 * POST /api/payhere/hash
 * Server-only checkout hash. Never expose PAYHERE_MERCHANT_SECRET to the client.
 */
export async function POST(request: Request) {
  try {
    const config = getPayHereConfig()
    if (!isPayHereConfigured(config)) {
      return apiError(
        "PAYHERE_NOT_CONFIGURED",
        "PayHere merchant credentials are not configured.",
        503,
      )
    }

    const json = await request.json()
    const payload = hashRequestSchema.parse(json)
    const amount = formatPayHereAmount(payload.amountCents)

    const hash = generateCheckoutHash(
      config.merchantId,
      payload.orderId,
      amount,
      payload.currency,
      config.merchantSecret,
    )

    return apiSuccess({
      hash,
      merchantId: config.merchantId,
      amount,
      currency: payload.currency,
      sandbox: config.sandbox,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
