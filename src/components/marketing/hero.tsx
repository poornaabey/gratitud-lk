"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon, GiftIcon, MapPinIcon } from "lucide-react"

import { SITE } from "@/lib/constants"
import { Container } from "@/components/layout/container"
import { CuratedBoxCard } from "@/components/marketing/curated-box-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const HERO_BOX_ITEMS = [
  {
    id: "anker",
    name: "Anker PowerCore 20K",
    detail: "Fast-charge tech anchor",
  },
  {
    id: "wallet",
    name: "Slim leather wallet",
    detail: "Vegetable-tanned lifestyle filler",
  },
  {
    id: "chocolate",
    name: "Artisan chocolate tin",
    detail: "Single-origin Sri Lankan cacao",
  },
] as const

export function Hero() {
  return (
    <section className="border-b border-zinc-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="grid items-center gap-16 py-20 md:grid-cols-[1.05fr_0.95fr] md:gap-20 md:py-28 lg:gap-24">
        <div className="space-y-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <Badge
              variant="secondary"
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-soft dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              Build-a-Box · Colombo
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-500 shadow-soft dark:border-zinc-700 dark:bg-zinc-900"
            >
              <MapPinIcon className="size-3.5" />
              {SITE.city}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="space-y-6"
          >
            <p className="text-sm font-semibold tracking-[0.18em] text-terracotta uppercase">
              {SITE.name}
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem] dark:text-zinc-50">
              Premium gifts that feel{" "}
              <em className="font-emphasis not-italic text-terracotta">personal</em>
              <span className="text-zinc-900 dark:text-zinc-50"> — not packaged.</span>
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg md:mx-0 dark:text-zinc-400">
              Curate high-utility tech and lifestyle essentials in five calm steps. Handwritten
              notes, surprise-safe delivery, and PayHere checkout — built for Sri Lanka.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="flex flex-col items-center gap-3 sm:flex-row md:items-start"
          >
            <Button size="lg" className="min-w-48" render={<Link href="/build" />}>
              <GiftIcon />
              Start Building
              <ArrowRightIcon />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-48"
              render={<Link href="/#featured" />}
            >
              Browse featured boxes
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {SITE.deliveryNote}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto w-full max-w-md"
        >
          <CuratedBoxCard
            title="Urban Pro"
            totalFormatted="LKR 14,500"
            itemCount={HERO_BOX_ITEMS.length}
            fullnessPercent={62}
            items={[...HERO_BOX_ITEMS]}
            note="Happy birthday Amma — miss you from London"
          />
        </motion.div>
      </Container>
    </section>
  )
}
