import { NextRequest } from "next/server"

import { apiError, apiSuccess, handleApiError } from "@/lib/api"
import { prisma } from "@/lib/db"
import { ProductCategory } from "@/generated/prisma/client"

/**
 * GET /api/products
 * Query: ?category=ANCHOR|LEATHER|GROOMING|TREATS|OTHER
 */
export async function GET(request: NextRequest) {
  try {
    const categoryParam = request.nextUrl.searchParams.get("category")

    let category: ProductCategory | undefined
    if (categoryParam) {
      if (!Object.values(ProductCategory).includes(categoryParam as ProductCategory)) {
        return apiError(
          "INVALID_CATEGORY",
          `category must be one of: ${Object.values(ProductCategory).join(", ")}`,
          400,
        )
      }
      category = categoryParam as ProductCategory
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    })

    return apiSuccess({ products })
  } catch (error) {
    return handleApiError(error)
  }
}
