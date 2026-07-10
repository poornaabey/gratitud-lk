"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Share2Icon, ShoppingBagIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import { easeOut } from "@/lib/motion"
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
  const reduce = Boolean(useReducedMotion())

  return (
    <motion.div
      initial={reduce ? false : { y: 72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: easeOut, delay: 0.15 }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-soft-lg backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/95",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">Box total</p>
          <p className="text-lg font-semibold leading-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            <motion.span
              key={totalCents}
              initial={reduce ? false : { opacity: 0.45, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {formatLKR(totalCents)}
            </motion.span>{" "}
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
    </motion.div>
  )
}
