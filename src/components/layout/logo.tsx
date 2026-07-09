import Link from "next/link"

import { SITE } from "@/lib/constants"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  markOnly?: boolean
}

export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-8 items-center justify-center rounded-full bg-navy text-sm font-semibold text-navy-foreground"
      >
        G
      </span>
      {!markOnly && (
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {SITE.name}
        </span>
      )}
    </Link>
  )
}
