"use client"

import { ADDON_CATEGORIES } from "@/lib/builder/mock-catalog"
import type { BuilderProduct } from "@/types/builder"
import { useBuilderStore } from "@/store/builder-store"
import { ProductCard } from "@/components/builder/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StepAddonsProps = {
  products: BuilderProduct[]
}

export function StepAddons({ products }: StepAddonsProps) {
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const toggleAddon = useBuilderStore((s) => s.toggleAddon)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Curate lifestyle add-ons
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Leather, grooming, and treats — tap to add or remove. Watch the fullness meter.
        </p>
      </div>

      <Tabs defaultValue="LEATHER">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-full bg-slate-100 p-1 dark:bg-zinc-900">
          {ADDON_CATEGORIES.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-full px-4 py-2 text-sm data-active:bg-white data-active:shadow-soft dark:data-active:bg-zinc-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ADDON_CATEGORIES.map((tab) => {
          const items = products.filter((p) => p.category === tab.id)
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-5">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500">No items in this category yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={addonSlugs.includes(product.slug)}
                      onToggle={() => toggleAddon(product.slug)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}
