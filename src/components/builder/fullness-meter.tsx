"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BatteryMediumIcon } from "lucide-react"

import { easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

type FullnessMeterProps = {
  used: number
  max: number
  className?: string
}

/** Premium iOS-style capacity indicator for the Build-a-Box sidebar. */
export function FullnessMeter({ used, max, className }: FullnessMeterProps) {
  const reduce = Boolean(useReducedMotion())
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  const over = used > max

  const hint = over
    ? "Over capacity — remove an add-on or choose a larger box."
    : pct >= 90
      ? "Nearly full — a generous box."
      : pct >= 60
        ? "Well balanced — room for a filler or two."
        : "Plenty of capacity left."

  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border border-zinc-100 bg-slate-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/80",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <BatteryMediumIcon className="size-4 text-zinc-400" aria-hidden />
          <span className="text-xs font-semibold tracking-wide uppercase">Box fullness</span>
        </div>
        <motion.span
          key={`${used}-${max}`}
          initial={reduce ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className={cn(
            "text-xs font-semibold tabular-nums",
            over ? "text-destructive" : "text-zinc-900 dark:text-zinc-100",
          )}
        >
          {pct}% · {used}/{max}
        </motion.span>
      </div>

      <div
        className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Box fullness"
      >
        <motion.div
          className={cn(
            "h-full rounded-full",
            over ? "bg-destructive" : "bg-navy dark:bg-terracotta",
          )}
          initial={false}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeOut }}
        />
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">{hint}</p>
    </div>
  )
}
