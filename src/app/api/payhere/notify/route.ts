import { prisma } from "@/lib/db"
import {
  getPayHereConfig,
  isPayHereConfigured,
  verifyNotificationHash,
} from "@/lib/payments/payhere"
import { OrderStatus } from "@/generated/prisma/client"

/**
 * POST /api/payhere/notify
 * PayHere server-to-server callback (application/x-www-form-urlencoded).
 * Must return 200 quickly; status_code 2 = success.
 */
export async function POST(request: Request) {
  const config = getPayHereConfig()

  if (!isPayHereConfigured(config)) {
    return new Response("PayHere not configured", { status: 500 })
  }

  const rawBody = await request.text()
  const params = new URLSearchParams(rawBody)

  const merchantId = params.get("merchant_id") ?? ""
  const orderId = params.get("order_id") ?? ""
  const payhereAmount = params.get("payhere_amount") ?? ""
  const payhereCurrency = params.get("payhere_currency") ?? ""
  const statusCode = params.get("status_code") ?? ""
  const md5sig = params.get("md5sig") ?? ""
  const paymentId = params.get("payment_id") ?? orderId

  if (
    !verifyNotificationHash({
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      md5sig,
      merchantSecret: config.merchantSecret,
    })
  ) {
    console.error("[payhere/notify] invalid signature", { orderId, statusCode })
    return new Response("Invalid signature", { status: 400 })
  }

  if (statusCode !== "2") {
    // Failed / cancelled / pending — acknowledge without marking paid
    if (statusCode === "-1" || statusCode === "-2") {
      await prisma.order.updateMany({
        where: {
          payhereOrderId: orderId,
          status: { in: [OrderStatus.AWAITING_PAYMENT, OrderStatus.PENDING] },
        },
        data: { status: OrderStatus.CANCELLED },
      })
    }
    return new Response("OK", { status: 200 })
  }

  const order = await prisma.order.findUnique({
    where: { payhereOrderId: orderId },
  })

  if (!order) {
    console.error("[payhere/notify] order not found", { orderId })
    return new Response("Order not found", { status: 404 })
  }

  // Idempotent: already paid
  if (order.status === OrderStatus.PAID || order.status === OrderStatus.PREPARING) {
    return new Response("OK", { status: 200 })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.PAID,
      paymentId,
    },
  })

  return new Response("OK", { status: 200 })
}
