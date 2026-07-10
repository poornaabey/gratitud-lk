import type { Transition, Variants } from "framer-motion"

/** Soft ease used across landing + builder motion. */
export const easeOut = [0.22, 1, 0.36, 1] as const

export const viewportOnce = { once: true, margin: "-48px" } as const

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
}

export function fadeUpTransition(delay = 0, reduceMotion = false): Transition {
  if (reduceMotion) return { duration: 0 }
  return { duration: 0.42, delay, ease: easeOut }
}

export function stepTransition(reduceMotion = false): Transition {
  if (reduceMotion) return { duration: 0 }
  return { duration: 0.22, ease: easeOut }
}
