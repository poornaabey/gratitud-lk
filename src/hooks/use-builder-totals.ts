"use client"

import { useBuilderStore } from "@/store/builder-store"
import { computeBuilderTotals } from "@/lib/builder/share"
import type { BuilderCatalog } from "@/types/builder"

export function useBuilderTotals(catalog: BuilderCatalog) {
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const message = useBuilderStore((s) => s.message)

  return computeBuilderTotals(catalog, {
    packagingSlug,
    anchorSlug,
    addonSlugs,
    message,
  })
}
