"use client"

import { motion } from "framer-motion"
import { CheckIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import type { BuilderProduct } from "@/types/builder"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ProductCardProps = {
  product: BuilderProduct
  selected: boolean
  onToggle: () => void
  disabled?: boolean
}

export function ProductCard({ product, selected, onToggle, disabled }: ProductCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      layout
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "group relative flex w-full flex-col rounded-2xl border p-4 text-left transition-colors",
        "hover:-translate-y-0.5 hover:shadow-soft disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-terracotta bg-terracotta/5 ring-2 ring-terracotta/25"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
      )}
    >
      {selected ? (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-terracotta text-white"
        >
          <CheckIcon className="size-3.5 stroke-[2.5]" />
        </motion.span>
      ) : null}

      <div className="mb-3 aspect-[4/3] rounded-xl bg-slate-100 dark:bg-zinc-800" />

      <p className="pr-8 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
        {product.name}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
        {product.description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {formatLKR(product.priceCents)}
        </p>
        <Badge
          variant="secondary"
          className="rounded-full border-0 bg-slate-100 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        >
          vol {product.volumeScore}
        </Badge>
      </div>
    </motion.button>
  )
}
