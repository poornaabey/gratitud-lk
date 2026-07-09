import { apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"

/**
 * GET /api/catalog
 * Combined products + packaging for the Build-a-Box wizard.
 */
export async function GET() {
  try {
    const [products, boxTemplates] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.boxTemplate.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    ])

    return apiSuccess({ products, boxTemplates })
  } catch (error) {
    return handleApiError(error)
  }
}
