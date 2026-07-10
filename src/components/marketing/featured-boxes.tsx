"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import { FEATURED_BOXES } from "@/lib/data/catalog"
import { viewportOnce } from "@/lib/motion"
import { useMotionPrefs } from "@/hooks/use-motion-prefs"
import { Container } from "@/components/layout/container"
import { SectionHeader } from "@/components/marketing/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FeaturedBoxes() {
  const motionPrefs = useMotionPrefs()

  return (
    <section
      id="featured"
      className="border-y border-zinc-200 bg-slate-50 py-20 md:py-28 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            align="left"
            eyebrow="Featured boxes"
            title="Ready-to-gift favourites"
            description="Start from a curated set, then tweak packaging, anchors, and add-ons in the builder."
          />
          <Button variant="outline" render={<Link href="/build" />}>
            Customize your own
            <ArrowRightIcon />
          </Button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURED_BOXES.map((box, index) => (
            <motion.article
              key={box.id}
              {...motionPrefs.inView(index * 0.06)}
              viewport={viewportOnce}
              className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-soft transition-shadow hover:shadow-soft-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative flex aspect-[16/10] items-end bg-navy p-6 dark:bg-zinc-800">
                <Badge className="absolute right-4 top-4 rounded-full border-0 bg-white/95 text-zinc-800">
                  {box.itemCount} items
                </Badge>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
                    {box.occasion}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
                    {box.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {box.tagline}
                </p>
                <ul className="space-y-2.5">
                  {box.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-terracotta" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <p className="text-lg font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                    {formatLKR(box.priceCents)}
                  </p>
                  <Button size="sm" render={<Link href={`/build?preset=${box.slug}`} />}>
                    Customize
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  )
}
