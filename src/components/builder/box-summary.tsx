"use client"

import { Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { formatLKR } from "@/lib/constants"
import { buildShareUrl } from "@/lib/builder/share"
import type { BuilderCatalog } from "@/types/builder"
import { useBuilderStore } from "@/store/builder-store"
import { useBuilderTotals } from "@/hooks/use-builder-totals"
import { FullnessMeter } from "@/components/builder/fullness-meter"
import { Button } from "@/components/ui/button"

type BoxSummaryProps = {
  catalog: BuilderCatalog
}

export function BoxSummary({ catalog }: BoxSummaryProps) {
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const message = useBuilderStore((s) => s.message)

  const { packaging, anchor, addons, volumeUsed, maxVolume, totalCents, itemCount } =
    useBuilderTotals(catalog)

  async function shareBox() {
    const url = buildShareUrl(window.location.origin, {
      packagingSlug,
      anchorSlug,
      addonSlugs,
      message,
    })
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied")
    } catch {
      toast.message("Share link", { description: url })
    }
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
            Live summary
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatLKR(totalCents)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
            {packaging ? ` · ${packaging.name}` : ""}
          </p>
        </div>

        <FullnessMeter used={volumeUsed} max={maxVolume} />

        <ul className="space-y-2.5 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
          {packaging ? (
            <li className="flex justify-between gap-2">
              <span className="text-zinc-500">{packaging.name}</span>
              <span className="tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatLKR(packaging.basePriceCents)}
              </span>
            </li>
          ) : null}
          {anchor ? (
            <li className="flex justify-between gap-2">
              <span className="text-zinc-500">{anchor.name}</span>
              <span className="tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatLKR(anchor.priceCents)}
              </span>
            </li>
          ) : null}
          {addons.map((a) => (
            <li key={a.id} className="flex justify-between gap-2">
              <span className="text-zinc-500">{a.name}</span>
              <span className="tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatLKR(a.priceCents)}
              </span>
            </li>
          ))}
        </ul>

        <Button className="w-full" variant="outline" onClick={shareBox}>
          <Share2Icon className="size-4" />
          Save & share link
        </Button>
      </div>
    </aside>
  )
}
