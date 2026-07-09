"use client"

import type { BuilderProduct } from "@/types/builder"
import { useBuilderStore } from "@/store/builder-store"
import { ProductCard } from "@/components/builder/product-card"

type StepAnchorProps = {
  products: BuilderProduct[]
}

export function StepAnchor({ products }: StepAnchorProps) {
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const setAnchor = useBuilderStore((s) => s.setAnchor)
  const anchors = products.filter((p) => p.category === "ANCHOR").slice(0, 15)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Choose the anchor item
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          High-utility tech — limited to a focused set so choosing stays easy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {anchors.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={anchorSlug === product.slug}
            onToggle={() =>
              setAnchor(anchorSlug === product.slug ? null : product.slug)
            }
          />
        ))}
      </div>
    </section>
  )
}
