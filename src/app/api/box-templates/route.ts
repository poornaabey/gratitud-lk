import { apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"

/**
 * GET /api/box-templates
 */
export async function GET() {
  try {
    const boxTemplates = await prisma.boxTemplate.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    })

    return apiSuccess({ boxTemplates })
  } catch (error) {
    return handleApiError(error)
  }
}
