import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { assertDeliveryDate, resolveCheckoutBox } from "@/lib/checkout/resolve-box"
import { prisma } from "@/lib/db"
import {
  buildPayHereCheckoutFields,
  getPayHereConfig,
  isPayHereConfigured,
} from "@/lib/payments/payhere"
import { checkoutRequestSchema } from "@/lib/validations/checkout"
import { OrderStatus } from "@/generated/prisma/client"

/**
 * POST /api/checkout
 * Create an AWAITING_PAYMENT order from builder slugs, then return PayHere form fields
 * (or a demo success redirect when PayHere is unconfigured / demoMode).
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const payload = checkoutRequestSchema.parse(json)

    let resolved
    try {
      resolved = await resolveCheckoutBox(payload.box)
      assertDeliveryDate(payload.deliveryDate)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid checkout payload."
      return apiError("CHECKOUT_INVALID", message, 400)
    }

    const payhereOrderId = `GLK-${Date.now().toString(36).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        status: OrderStatus.AWAITING_PAYMENT,
        boxTemplateId: resolved.boxTemplateId,
        totalAmountCents: resolved.totalAmountCents,
        message: payload.box.message?.trim() || null,
        isSurprise: payload.isSurprise,
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        recipientEmail: payload.recipientEmail || null,
        recipientAddress: payload.recipientAddress,
        recipientCity: payload.recipientCity,
        deliveryDate: payload.deliveryDate,
        billingName: payload.billingName,
        billingEmail: payload.billingEmail,
        billingPhone: payload.billingPhone,
        billingAddress: payload.billingAddress || null,
        payhereOrderId,
        items: {
          create: resolved.lines.map((line) => ({
            productId: line.productId,
            kind: line.kind,
            nameSnapshot: line.nameSnapshot,
            priceCents: line.priceCents,
            volumeScore: line.volumeScore,
            quantity: line.quantity,
          })),
        },
      },
      select: {
        id: true,
        payhereOrderId: true,
        totalAmountCents: true,
        status: true,
      },
    })

    const config = getPayHereConfig()
    const useDemo = payload.demoMode || !isPayHereConfigured(config)

    if (useDemo) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paymentId: payload.demoMode ? `demo-${order.id}` : `local-${order.id}`,
        },
      })

      return apiSuccess({
        mode: "demo" as const,
        orderId: order.id,
        payhereOrderId: order.payhereOrderId,
        totalAmountCents: order.totalAmountCents,
        redirectUrl: `/checkout/success?order=${encodeURIComponent(order.id)}&demo=1`,
      })
    }

    const checkout = buildPayHereCheckoutFields({
      orderId: payhereOrderId,
      amountCents: resolved.totalAmountCents,
      itemsLabel: `GratituD — ${resolved.itemsLabel}`,
      customerName: payload.billingName,
      customerEmail: payload.billingEmail,
      customerPhone: payload.billingPhone,
      address: payload.billingAddress || payload.recipientAddress,
      city: payload.recipientCity,
    })

    return apiSuccess({
      mode: "payhere" as const,
      orderId: order.id,
      payhereOrderId,
      totalAmountCents: order.totalAmountCents,
      action: checkout.action,
      fields: checkout.fields,
      sandbox: checkout.sandbox,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
