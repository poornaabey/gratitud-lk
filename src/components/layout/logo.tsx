import Link from "next/link"
import Image from "next/image"

import { SITE } from "@/lib/constants"
import { cn } from "@/lib/utils"

/** Final brand assets — transparent copper lockup + emblem. */
export const BRAND_ASSETS = {
  /** Emblem + GratituD.lk wordmark (horizontal) */
  lockup: "/brand/logo-lockup.png",
  /** Heart / G / gift only — favicon & compact mark */
  emblem: "/brand/logo-emblem.png",
} as const

type LogoVariant = "nav" | "mark" | "lockup"

type LogoProps = {
  className?: string
  /** @deprecated use variant="mark" */
  markOnly?: boolean
  /**
   * nav — compact full lockup (header)
   * mark — emblem only
   * lockup — larger lockup (footer / brand moments)
   */
  variant?: LogoVariant
  showTagline?: boolean
  priority?: boolean
}

/**
 * Brand logo — final lockup in chrome; emblem for compact / favicon uses.
 */
export function Logo({
  className,
  markOnly = false,
  variant,
  showTagline = false,
  priority = false,
}: LogoProps) {
  const resolved: LogoVariant = variant ?? (markOnly ? "mark" : "nav")

  if (resolved === "mark") {
    return (
      <Link
        href="/"
        aria-label={SITE.name}
        className={cn("group inline-flex shrink-0 transition-opacity hover:opacity-90", className)}
      >
        <Image
          src={BRAND_ASSETS.emblem}
          alt=""
          width={80}
          height={80}
          priority={priority}
          className="size-10 object-contain sm:size-11"
        />
      </Link>
    )
  }

  if (resolved === "lockup") {
    return (
      <Link
        href="/"
        aria-label={SITE.name}
        className={cn(
          "group inline-flex flex-col items-start gap-2.5 transition-opacity hover:opacity-90",
          className,
        )}
      >
        <Image
          src={BRAND_ASSETS.lockup}
          alt={SITE.name}
          width={480}
          height={150}
          priority={priority}
          className="h-12 w-auto max-w-[240px] object-contain sm:h-14 sm:max-w-[280px]"
        />
        <span className="text-[10px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          {SITE.brandLine}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href="/"
      aria-label={SITE.name}
      className={cn("group inline-flex items-center transition-opacity hover:opacity-90", className)}
    >
      <Image
        src={BRAND_ASSETS.lockup}
        alt={SITE.name}
        width={360}
        height={112}
        priority={priority}
        className="h-8 w-auto max-w-[200px] object-contain sm:h-9 sm:max-w-[240px]"
      />
    </Link>
  )
}
