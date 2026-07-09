"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"

import { OCCASIONS } from "@/lib/data/catalog"
import { Container } from "@/components/layout/container"
import { SectionHeader } from "@/components/marketing/section-header"

export function Occasions() {
  return (
    <section id="occasions" className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <Container>
        <SectionHeader
          eyebrow="Occasions"
          title="Built for how Colombo actually gifts"
          description="Birthdays, boardrooms, and boxes sent home — start from an occasion or jump straight into the builder."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <Link
                href={`/build?occasion=${occasion.id}`}
                className="group flex h-full flex-col rounded-3xl border border-zinc-200 bg-slate-50 p-7 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <span className="mb-5 flex size-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {occasion.name}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {occasion.blurb}
                </p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta">
                  Build for this
                  <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
