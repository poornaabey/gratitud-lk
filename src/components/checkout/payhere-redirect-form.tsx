"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { easeOut } from "@/lib/motion"

type PayHereRedirectFormProps = {
  action: string
  fields: Record<string, string>
  sandbox?: boolean
}

export function PayHereRedirectForm({ action, fields, sandbox }: PayHereRedirectFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const reduce = Boolean(useReducedMotion())

  React.useEffect(() => {
    formRef.current?.submit()
  }, [])

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="space-y-3"
      >
        <motion.div
          aria-hidden
          className="mx-auto size-10 rounded-full border-2 border-terracotta/30 border-t-terracotta"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce ? undefined : { duration: 0.9, repeat: Infinity, ease: "linear" }
          }
        />
        <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Redirecting to PayHere…
        </p>
        <p className="max-w-sm text-sm text-zinc-500">
          Secure payment in LKR. Do not close this window.
        </p>
        {sandbox ? (
          <p className="mt-2 max-w-md text-xs text-zinc-400">
            Sandbox mode — use PayHere test cards. Register your domain (or ngrok HTTPS URL) in
            sandbox.payhere.lk and set NEXT_PUBLIC_SITE_URL accordingly.
          </p>
        ) : null}
      </motion.div>
      <form ref={formRef} method="POST" action={action} className="hidden">
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </form>
    </div>
  )
}
