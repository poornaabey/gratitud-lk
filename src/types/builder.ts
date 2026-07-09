import type { ProductCategory } from "@/generated/prisma/client"

/** Normalized catalog shapes used by the Build-a-Box UI (API or mock). */

export type BuilderProduct = {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  category: ProductCategory
  volumeScore: number
  imageUrl: string | null
  stock: number
}

export type BuilderBoxTemplate = {
  id: string
  slug: string
  name: string
  description: string | null
  basePriceCents: number
  maxVolume: number
  imageUrl: string | null
  swatchClass: string | null
}

export type BuilderCatalog = {
  products: BuilderProduct[]
  boxTemplates: BuilderBoxTemplate[]
  source: "api" | "mock"
}

export type BuilderShareState = {
  packagingSlug: string | null
  anchorSlug: string | null
  addonSlugs: string[]
  message: string
}
