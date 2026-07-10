"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  CalendarHeartIcon,
  PackageIcon,
  PenLineIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react"

import { BUILDER_STEPS } from "@/lib/constants"
import { viewportOnce } from "@/lib/motion"
import { useMotionPrefs } from "@/hooks/use-motion-prefs"
import { Container } from "@/components/layout/container"
import { SectionHeader } from "@/components/marketing/section-header"
import { Button } from "@/components/ui/button"

const STEP_ICONS = [PackageIcon, SmartphoneIcon, SparklesIcon, PenLineIcon, CalendarHeartIcon]

export function HowItWorks() {
  const motionPrefs = useMotionPrefs()

  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="Five steps. Zero decision fatigue."
          description="Mobile-first taps, a live price bar, and a fullness meter so every box feels intentional."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {BUILDER_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? SparklesIcon
            return (
              <motion.li
                key={step.id}
                {...motionPrefs.inView(index * 0.04)}
                viewport={viewportOnce}
                className="rounded-3xl border border-zinc-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-navy dark:border-zinc-700 dark:bg-zinc-950 dark:text-terracotta">
                  <Icon className="size-5" />
                </div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-400 uppercase">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {step.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>
              </motion.li>
            )
          })}
        </ol>

        <div className="mt-12 flex justify-center">
          <Button size="lg" render={<Link href="/build" />}>
            Try the builder
          </Button>
        </div>
      </Container>
    </section>
  )
}
