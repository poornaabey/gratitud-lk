"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BatteryMediumIcon, CheckIcon } from "lucide-react"

import { easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type CuratedBoxItem = {
  id: string
  name: string
  detail?: string
}

export type CuratedBoxCardProps = {
  title?: string
  eyebrow?: string
  totalLabel?: string
  totalFormatted: string
  itemCount: number
  fullnessPercent: number
  items: CuratedBoxItem[]
  note?: string
  className?: string
  /** Stagger item list + fill fullness bar (hero). */
  animated?: boolean
}

/**
 * Premium curated-box preview — white/zinc card, integrated total,
 * high-contrast item list, iOS-style fullness indicator.
 */
export function CuratedBoxCard({
  title = "Urban Pro",
  eyebrow = "Your curated box",
  totalLabel = "Box total",
  totalFormatted,
  itemCount,
  fullnessPercent,
  items,
  note,
  className,
  animated = false,
}: CuratedBoxCardProps) {
  const reduce = Boolean(useReducedMotion())
  const shouldAnimate = animated && !reduce
  const clamped = Math.max(0, Math.min(100, Math.round(fullnessPercent)))
  const fullnessHint =
    clamped >= 90
      ? "Nearly full — a generous box."
      : clamped >= 60
        ? "Well balanced — room for a filler or two."
        : "Plenty of capacity left."

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-soft-lg",
        "dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-6 border-b border-zinc-100 px-7 py-6 sm:px-8 sm:py-7 dark:border-zinc-800">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-2 truncate text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            {totalLabel}
          </p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
            {totalFormatted}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </header>

      <div className="space-y-8 px-7 py-7 sm:px-8 sm:py-8">
        <ul className="space-y-1" aria-label="Items in this box">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={shouldAnimate ? { opacity: 0, x: 8 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={
                shouldAnimate
                  ? { delay: 0.28 + index * 0.09, duration: 0.35, ease: easeOut }
                  : { duration: 0 }
              }
              className="flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/60"
            >
              <span
                aria-hidden
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta"
              >
                <CheckIcon className="size-3.5 stroke-[2.5]" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </p>
                {item.detail ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{item.detail}</p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="space-y-3 rounded-2xl border border-zinc-100 bg-slate-50/80 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <BatteryMediumIcon className="size-4 text-zinc-400" aria-hidden />
              <span className="text-xs font-semibold tracking-wide uppercase">Box fullness</span>
            </div>
            <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {clamped}%
            </span>
          </div>

          <div
            className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Box fullness"
          >
            <motion.div
              className="h-full rounded-full bg-navy dark:bg-terracotta"
              initial={shouldAnimate ? { width: 0 } : false}
              animate={{ width: `${clamped}%` }}
              transition={
                shouldAnimate
                  ? { delay: 0.55, duration: 0.7, ease: easeOut }
                  : { duration: 0.45, ease: easeOut }
              }
            />
          </div>

          <p className="text-xs leading-relaxed text-zinc-500">{fullnessHint}</p>
        </div>

        {note ? (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldAnimate
                ? { delay: 0.75, duration: 0.4, ease: easeOut }
                : { duration: 0 }
            }
            className="rounded-2xl border border-zinc-100 bg-white px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-[10px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
              Greeting card
            </p>
            <p className="font-script mt-3 text-xl leading-snug text-zinc-700 dark:text-zinc-300">
              {note}
            </p>
          </motion.div>
        ) : null}
      </div>
    </article>
  )
}
