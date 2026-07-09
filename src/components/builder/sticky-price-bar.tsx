"use client"

import Link from "next/link"
import { Share2Icon, ShoppingBagIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type StickyPriceBarProps = {
  totalCents: number
  itemCount: number
  className?: string
  onShare?: () => void
  checkoutHref?: string
}

export function StickyPriceBar({
  totalCents,
  itemCount,
  className,
  onShare,
  checkoutHref = "/build",
}: StickyPriceBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-soft-lg backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/95",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">Box total</p>
          <p className="text-lg font-semibold leading-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatLKR(totalCents)}{" "}
            <span className="text-sm font-normal text-zinc-500">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onShare ? (
            <Button variant="outline" size="icon-sm" aria-label="Share box" onClick={onShare}>
              <Share2Icon className="size-4" />
            </Button>
          ) : null}
          <Button size="sm" render={<Link href={checkoutHref} />}>
            <ShoppingBagIcon className="size-4" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
