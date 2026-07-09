import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/orders/[id]
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

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
