"use client"

import { useReducedMotion } from "framer-motion"

import { fadeUpTransition, stepTransition } from "@/lib/motion"

/** Central place for prefers-reduced-motion aware motion props. */
export function useMotionPrefs() {
  const reduce = Boolean(useReducedMotion())

  return {
    reduce,
    fadeUp: (delay = 0) =>
      reduce
        ? {
            initial: false as const,
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: fadeUpTransition(delay),
          },
    inView: (delay = 0) =>
      reduce
        ? {
            initial: false as const,
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            transition: fadeUpTransition(delay),
          },
    step: () =>
      reduce
        ? {
            initial: { opacity: 1, x: 0 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 1, x: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -10 },
            transition: stepTransition(),
          },
  }
}
