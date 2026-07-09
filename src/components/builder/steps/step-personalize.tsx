"use client"

import { useBuilderStore } from "@/store/builder-store"
import { Textarea } from "@/components/ui/textarea"

export function StepPersonalize() {
  const message = useBuilderStore((s) => s.message)
  const setMessage = useBuilderStore((s) => s.setMessage)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Personalize the message
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Live preview on a greeting card with a handwritten web font.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="gift-message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Your note
          </label>
          <Textarea
            id="gift-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something warm…"
            className="min-h-44 resize-none rounded-2xl border-zinc-200 bg-white text-base dark:border-zinc-800 dark:bg-zinc-900"
            maxLength={280}
          />
          <p className="text-xs text-zinc-400">{message.length}/280</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-slate-50 p-7 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-[10px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Greeting card
          </p>
          <p className="font-script mt-6 min-h-28 text-2xl leading-snug text-zinc-700 dark:text-zinc-300">
            {message.trim() || "Your message will appear here…"}
          </p>
        </div>
      </div>
    </section>
  )
}
