"use client"

import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2Icon } from "lucide-react"

import { easeOut } from "@/lib/motion"

export function SuccessCheckmark() {
  const reduce = Boolean(useReducedMotion())

  return (
    <motion.div
      initial={reduce ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
      className="relative mx-auto flex size-16 items-center justify-center"
    >
      <CheckCircle2Icon className="size-14 text-terracotta" strokeWidth={1.5} />
      {!reduce ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute size-16 rounded-full border border-terracotta/30"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
        />
      ) : null}
    </motion.div>
  )
}
