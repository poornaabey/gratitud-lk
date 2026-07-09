import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"
import { createOrderSchema } from "@/lib/validations/order"
import { OrderStatus } from "@/generated/prisma/client"

/**
 * GET /api/orders?id=...
 * Fetch a single order by id (Phase 4 will add auth scoping).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return apiError("MISSING_ID", "Query parameter `id` is required.", 400)
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        boxTemplate: true,
      },
    })

    if (!order) {
      return apiError("NOT_FOUND", "Order not found.", 404)
    }

    return apiSuccess({ order })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/orders
 * Create a pending order from the Build-a-Box checkout payload.
 * Total is computed server-side from item line prices (never trust client total).
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const payload = createOrderSchema.parse(json)

    if (payload.boxTemplateId) {
      const template = await prisma.boxTemplate.findFirst({
        where: { id: payload.boxTemplateId, isActive: true },
      })
      if (!template) {
        return apiError("INVALID_BOX_TEMPLATE", "Selected packaging is unavailable.", 400)
      }
    }

    const productIds = payload.items
      .map((item) => item.productId)
      .filter((id): id is string => Boolean(id))

    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: { id: true, stock: true },
      })
      const found = new Set(products.map((p) => p.id))
      const missing = productIds.filter((id) => !found.has(id))
      if (missing.length > 0) {
        return apiError("INVALID_PRODUCT", "One or more products are unavailable.", 400, {
          missing,
        })
      }
    }

    const totalAmountCents = payload.items.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    )

    if (totalAmountCents <= 0) {
      return apiError("INVALID_TOTAL", "Order total must be greater than zero.", 400)
    }

    const order = await prisma.order.create({
      data: {
        userId: payload.userId ?? null,
        status: OrderStatus.PENDING,
        boxTemplateId: payload.boxTemplateId ?? null,
        totalAmountCents,
        message: payload.message ?? null,
        isSurprise: payload.isSurprise,
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        recipientEmail: payload.recipientEmail ?? null,
        recipientAddress: payload.recipientAddress,
        recipientCity: payload.recipientCity,
        deliveryDate: payload.deliveryDate,
        billingName: payload.billingName,
        billingEmail: payload.billingEmail,
        billingPhone: payload.billingPhone,
        billingAddress: payload.billingAddress ?? null,
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId ?? null,
            kind: item.kind,
            nameSnapshot: item.nameSnapshot,
            priceCents: item.priceCents,
            volumeScore: item.volumeScore,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
        boxTemplate: true,
      },
    })

    return apiSuccess({ order }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
