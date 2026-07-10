"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GiftIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"

import { SITE } from "@/lib/constants"
import { viewportOnce } from "@/lib/motion"
import { useMotionPrefs } from "@/hooks/use-motion-prefs"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

const PERKS = [
  {
    icon: TruckIcon,
    title: "Colombo delivery",
    text: "Same-week slots with a mandatory delivery date picker.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Keep it a surprise",
    text: "No price tags or invoices on the recipient side.",
  },
  {
    icon: GiftIcon,
    title: "Save & share",
    text: "Send a link so friends can approve or split the cost.",
  },
] as const

export function FinalCta() {
  const motionPrefs = useMotionPrefs()

  return (
    <section className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <Container>
        <motion.div
          {...motionPrefs.inView(0)}
          viewport={viewportOnce}
          className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-navy px-8 py-14 text-center shadow-soft-lg sm:px-14 dark:border-zinc-800"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-terracotta uppercase">
            {SITE.name}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to build something unforgettable?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            {SITE.tagline} Start with packaging, add a tech anchor, and wrap it with a note that
            feels handwritten.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/build" />}>
              Open Build-a-Box
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/20"
              render={<Link href={`mailto:${SITE.email}`} />}
            >
              Corporate enquiries
            </Button>
          </div>

          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5"
              >
                <perk.icon className="size-5 text-terracotta" />
                <p className="mt-4 text-sm font-semibold text-white">{perk.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{perk.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
