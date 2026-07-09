"use client"

import { motion } from "framer-motion"

import { TESTIMONIALS } from "@/lib/data/catalog"
import { Container } from "@/components/layout/container"
import { SectionHeader } from "@/components/marketing/section-header"

export function Testimonials() {
  return (
    <section
      id="stories"
      className="border-y border-zinc-200 bg-slate-50 py-20 md:py-28 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Container>
        <SectionHeader
          eyebrow="Love notes"
          title="Why people keep coming back"
          description="Diaspora senders, corporate HR teams, and thoughtful locals — same calm experience."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-7 shadow-soft dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-emphasis text-3xl leading-none text-terracotta">&ldquo;</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {item.quote}
              </p>
              <footer className="mt-8 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
