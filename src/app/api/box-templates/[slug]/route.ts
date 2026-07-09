import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"

type RouteContext = {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/box-templates/[slug]
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    const boxTemplate = await prisma.boxTemplate.findFirst({
      where: { slug, isActive: true },
    })

    if (!boxTemplate) {
      return apiError("NOT_FOUND", `Box template "${slug}" was not found.`, 404)
    }

    return apiSuccess({ boxTemplate })
  } catch (error) {
    return handleApiError(error)
  }
}
