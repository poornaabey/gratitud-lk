"use client"

import { formatLKR } from "@/lib/constants"
import type { BuilderBoxTemplate } from "@/types/builder"
import { useBuilderStore } from "@/store/builder-store"
import { cn } from "@/lib/utils"

type StepPackagingProps = {
  templates: BuilderBoxTemplate[]
}

export function StepPackaging({ templates }: StepPackagingProps) {
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const setPackaging = useBuilderStore((s) => s.setPackaging)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Select packaging theme
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Sets the base price and box capacity for the fullness meter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((pkg) => {
          const selected = packagingSlug === pkg.slug
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setPackaging(pkg.slug)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
                selected
                  ? "border-terracotta bg-terracotta/5 ring-2 ring-terracotta/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
              )}
            >
              <span
                className={cn(
                  "size-14 shrink-0 rounded-xl shadow-inner",
                  pkg.swatchClass ?? "bg-zinc-200",
                )}
              />
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{pkg.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatLKR(pkg.basePriceCents)} · capacity {pkg.maxVolume}
                </p>
                {pkg.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{pkg.description}</p>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
