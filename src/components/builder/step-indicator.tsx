"use client"

import { BUILDER_STEPS, type BuilderStepId } from "@/lib/constants"
import { cn } from "@/lib/utils"

type StepIndicatorProps = {
  current: BuilderStepId
  className?: string
}

export function StepIndicator({ current, className }: StepIndicatorProps) {
  const currentIndex = BUILDER_STEPS.findIndex((s) => s.id === current)

  return (
    <ol className={cn("flex w-full items-center gap-1.5 sm:gap-2", className)}>
      {BUILDER_STEPS.map((step, index) => {
        const active = index === currentIndex
        const done = index < currentIndex
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-full rounded-full transition-colors",
                done || active ? "bg-terracotta" : "bg-zinc-200 dark:bg-zinc-800",
              )}
            />
            <span
              className={cn(
                "hidden truncate text-[10px] font-medium tracking-wide uppercase sm:block",
                active ? "text-terracotta" : "text-zinc-400",
              )}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
