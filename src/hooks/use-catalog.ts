"use client"

import * as React from "react"

import { MOCK_CATALOG } from "@/lib/builder/mock-catalog"
import type { BuilderCatalog, BuilderBoxTemplate, BuilderProduct } from "@/types/builder"
import type { ApiBody } from "@/lib/api"

type CatalogApiData = {
  products: Array<{
    id: string
    slug: string
    name: string
    description: string
    priceCents: number
    category: BuilderProduct["category"]
    volumeScore: number
    imageUrl: string | null
    stock: number
  }>
  boxTemplates: Array<{
    id: string
    slug: string
    name: string
    description: string | null
    basePriceCents: number
    maxVolume: number
    imageUrl: string | null
    swatchClass: string | null
  }>
}

function mapApiCatalog(data: CatalogApiData): BuilderCatalog {
  const products: BuilderProduct[] = data.products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    category: p.category,
    volumeScore: p.volumeScore,
    imageUrl: p.imageUrl,
    stock: p.stock,
  }))

  const boxTemplates: BuilderBoxTemplate[] = data.boxTemplates.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    basePriceCents: t.basePriceCents,
    maxVolume: t.maxVolume,
    imageUrl: t.imageUrl,
    swatchClass: t.swatchClass,
  }))

  return { products, boxTemplates, source: "api" }
}

export function useCatalog() {
  const [catalog, setCatalog] = React.useState<BuilderCatalog>(MOCK_CATALOG)
  const [status, setStatus] = React.useState<"loading" | "ready" | "fallback">("loading")

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/catalog")
        const body = (await res.json()) as ApiBody<CatalogApiData>

        if (
          !cancelled &&
          body.ok &&
          body.data.products.length > 0 &&
          body.data.boxTemplates.length > 0
        ) {
          setCatalog(mapApiCatalog(body.data))
          setStatus("ready")
          return
        }
      } catch {
        // fall through to mock
      }

      if (!cancelled) {
        setCatalog(MOCK_CATALOG)
        setStatus("fallback")
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { catalog, status, isLoading: status === "loading" }
}
