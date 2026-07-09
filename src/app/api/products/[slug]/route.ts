import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"

type RouteContext = {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/products/[slug]
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
    })

    if (!product) {
      return apiError("NOT_FOUND", `Product "${slug}" was not found.`, 404)
    }

    return apiSuccess({ product })
  } catch (error) {
    return handleApiError(error)
  }
}
