"use client"

import { LinkIcon } from "lucide-react"
import { toast } from "sonner"

import { formatLKR } from "@/lib/constants"
import { buildShareUrl } from "@/lib/builder/share"
import type { BuilderCatalog } from "@/types/builder"
import { useBuilderStore } from "@/store/builder-store"
import { useBuilderTotals } from "@/hooks/use-builder-totals"
import { Button } from "@/components/ui/button"

type StepReviewProps = {
  catalog: BuilderCatalog
}

export function StepReview({ catalog }: StepReviewProps) {
  const message = useBuilderStore((s) => s.message)
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const { packaging, anchor, addons, totalCents } = useBuilderTotals(catalog)

  async function shareBox() {
    const url = buildShareUrl(window.location.origin, {
      packagingSlug,
      anchorSlug,
      addonSlugs,
      message,
    })
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied", {
        description: "Send it to friends for approval or cost-splitting.",
      })
    } catch {
      toast.message("Share link", { description: url })
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Review your box
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Confirm the details, share for approval, then continue to checkout.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Packaging</dt>
            <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">
              {packaging?.name ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Anchor</dt>
            <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">
              {anchor?.name ?? "Not selected"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Add-ons</dt>
            <dd className="max-w-[60%] text-right font-medium text-zinc-900 dark:text-zinc-50">
              {addons.length ? addons.map((a) => a.name).join(", ") : "None yet"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <dt className="text-zinc-500">Box total</dt>
            <dd className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatLKR(totalCents)}
            </dd>
          </div>
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <dt className="text-zinc-500">Message</dt>
            <dd className="font-script mt-3 text-xl text-zinc-700 dark:text-zinc-300">
              {message.trim() || "No message yet"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-slate-50 p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">Ready for gifting checkout</p>
        <p className="mt-1 text-zinc-500">
          Next: recipient vs billing, delivery date, surprise toggle, then PayHere in LKR.
        </p>
      </div>

      <Button variant="outline" onClick={shareBox}>
        <LinkIcon className="size-4" />
        Copy shareable box link
      </Button>
    </section>
  )
}
