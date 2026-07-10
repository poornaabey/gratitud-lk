"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addDays, format } from "date-fns"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { formatLKR } from "@/lib/constants"
import { useBuilderStore } from "@/store/builder-store"
import { useCatalog } from "@/hooks/use-catalog"
import { useBuilderTotals } from "@/hooks/use-builder-totals"
import { useMotionPrefs } from "@/hooks/use-motion-prefs"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PayHereRedirectForm } from "@/components/checkout/payhere-redirect-form"

type CheckoutSuccess =
  | {
      mode: "demo"
      orderId: string
      payhereOrderId: string | null
      totalAmountCents: number
      redirectUrl: string
    }
  | {
      mode: "payhere"
      orderId: string
      payhereOrderId: string
      totalAmountCents: number
      action: string
      fields: Record<string, string>
      sandbox: boolean
    }

type CheckoutResponse =
  | { ok: true; data: CheckoutSuccess }
  | { ok: false; error: { code: string; message: string } }

export function CheckoutForm() {
  const router = useRouter()
  const motionPrefs = useMotionPrefs()
  const { catalog, isLoading } = useCatalog()
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const message = useBuilderStore((s) => s.message)
  const reset = useBuilderStore((s) => s.reset)

  const { packaging, anchor, addons, totalCents } = useBuilderTotals(catalog)

  const [loading, setLoading] = React.useState(false)
  const [isSurprise, setIsSurprise] = React.useState(true)
  const [sameAsRecipient, setSameAsRecipient] = React.useState(false)
  const [payhere, setPayhere] = React.useState<{
    action: string
    fields: Record<string, string>
    sandbox: boolean
  } | null>(null)

  const minDate = format(addDays(new Date(), 2), "yyyy-MM-dd")
  const isSandbox = (process.env.NEXT_PUBLIC_PAYHERE_ENV ?? "sandbox") !== "production"
  const formRef = React.useRef<HTMLFormElement>(null)

  const canCheckout = Boolean(packagingSlug && anchorSlug)

  async function submitCheckout(demoMode = false) {
    const form = formRef.current
    if (!form) return

    if (!packagingSlug || !anchorSlug) {
      toast.error("Complete your box in the builder first.")
      router.push("/build")
      return
    }

    if (!form.reportValidity()) return

    const fd = new FormData(form)
    const recipientName = String(fd.get("recipientName") ?? "").trim()
    const recipientPhone = String(fd.get("recipientPhone") ?? "").trim()
    const recipientEmail = String(fd.get("recipientEmail") ?? "").trim()
    const recipientAddress = String(fd.get("recipientAddress") ?? "").trim()
    const recipientCity = String(fd.get("recipientCity") ?? "Colombo").trim()
    const deliveryDate = String(fd.get("deliveryDate") ?? "")

    const billingName = sameAsRecipient
      ? recipientName
      : String(fd.get("billingName") ?? "").trim()
    const billingEmail = String(fd.get("billingEmail") ?? "").trim()
    const billingPhone = sameAsRecipient
      ? recipientPhone
      : String(fd.get("billingPhone") ?? "").trim()
    const billingAddress = sameAsRecipient
      ? recipientAddress
      : String(fd.get("billingAddress") ?? "").trim()

    setLoading(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          box: {
            packagingSlug,
            anchorSlug,
            addonSlugs,
            message: message.trim() || null,
          },
          isSurprise,
          recipientName,
          recipientPhone,
          recipientEmail: recipientEmail || null,
          recipientAddress,
          recipientCity,
          deliveryDate,
          billingName,
          billingEmail,
          billingPhone,
          billingAddress: billingAddress || null,
          demoMode,
        }),
      })

      const body = (await res.json()) as CheckoutResponse

      if (!body.ok) {
        toast.error(body.error.message)
        setLoading(false)
        return
      }

      if (body.data.mode === "demo") {
        reset()
        router.push(body.data.redirectUrl)
        return
      }

      setPayhere({
        action: body.data.action,
        fields: body.data.fields,
        sandbox: body.data.sandbox,
      })
    } catch {
      toast.error("Could not start checkout. Please try again.")
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">
        Loading your box…
      </div>
    )
  }

  if (payhere) {
    return (
      <Container className="py-16">
        <PayHereRedirectForm
          action={payhere.action}
          fields={payhere.fields}
          sandbox={payhere.sandbox}
        />
      </Container>
    )
  }

  if (!canCheckout) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your box is incomplete
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Choose packaging and an anchor item in the Build-a-Box flow before checkout.
        </p>
        <Button className="mt-6" render={<Link href="/build" />}>
          Back to builder
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-10 md:py-14">
      <motion.div {...motionPrefs.fadeUp(0)} className="mb-8 max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-terracotta uppercase">Gifting checkout</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Who receives this gift?
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Recipient details stay separate from billing. Surprise mode hides the invoice from the
          gift box.
        </p>
      </motion.div>

      <motion.form
        ref={formRef}
        {...motionPrefs.fadeUp(0.06)}
        onSubmit={(e) => {
          e.preventDefault()
          void submitCheckout(false)
        }}
        className="grid gap-10 lg:grid-cols-[1fr_320px]"
      >
        <div className="space-y-8">
          <section className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recipient</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="recipientName">Full name</Label>
                <Input id="recipientName" name="recipientName" required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Phone</Label>
                <Input
                  id="recipientPhone"
                  name="recipientPhone"
                  type="tel"
                  placeholder="0771234567"
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Email (optional)</Label>
                <Input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="recipientAddress">Delivery address</Label>
                <Input
                  id="recipientAddress"
                  name="recipientAddress"
                  required
                  autoComplete="street-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCity">City</Label>
                <Input
                  id="recipientCity"
                  name="recipientCity"
                  defaultValue="Colombo"
                  required
                  autoComplete="address-level2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery date</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  min={minDate}
                  required
                />
                <p className="text-xs text-zinc-400">At least 2 days from today for curation.</p>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-[var(--terracotta,#C17F59)]"
                checked={isSurprise}
                onChange={(e) => setIsSurprise(e.target.checked)}
              />
              <span>
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Surprise gift
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  We will not include pricing or your billing details in the box.
                </span>
              </span>
            </label>
          </section>

          <section className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Billing</h2>
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--terracotta,#C17F59)]"
                  checked={sameAsRecipient}
                  onChange={(e) => setSameAsRecipient(e.target.checked)}
                />
                Same as recipient
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {!sameAsRecipient ? (
                <>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="billingName">Payer name</Label>
                    <Input id="billingName" name="billingName" required={!sameAsRecipient} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPhone">Phone</Label>
                    <Input
                      id="billingPhone"
                      name="billingPhone"
                      type="tel"
                      required={!sameAsRecipient}
                    />
                  </div>
                </>
              ) : null}
              <div className={`space-y-2 ${sameAsRecipient ? "sm:col-span-2" : ""}`}>
                <Label htmlFor="billingEmail">Email (receipt)</Label>
                <Input id="billingEmail" name="billingEmail" type="email" required />
              </div>
              {!sameAsRecipient ? (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="billingAddress">Billing address (optional)</Label>
                  <Input id="billingAddress" name="billingAddress" />
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Your box</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Packaging</dt>
              <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">
                {packaging?.name}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Anchor</dt>
              <dd className="text-right font-medium text-zinc-900 dark:text-zinc-50">
                {anchor?.name}
              </dd>
            </div>
            {addons.length > 0 ? (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Add-ons</dt>
                <dd className="max-w-[55%] text-right font-medium text-zinc-900 dark:text-zinc-50">
                  {addons.map((a) => a.name).join(", ")}
                </dd>
              </div>
            ) : null}
            {message.trim() ? (
              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <dt className="text-zinc-500">Note</dt>
                <dd className="font-script mt-2 text-lg text-zinc-700 dark:text-zinc-300">
                  {message}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <dt className="font-medium text-zinc-900 dark:text-zinc-50">Total</dt>
              <dd className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatLKR(totalCents)}
              </dd>
            </div>
          </dl>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Preparing payment…" : "Pay with PayHere"}
          </Button>

          {isSandbox ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => void submitCheckout(true)}
            >
              Complete as demo (no charge)
            </Button>
          ) : null}

          <Button variant="ghost" className="w-full" render={<Link href="/build" />}>
            Edit box
          </Button>

          <p className="text-center text-xs text-zinc-400">
            Prices are re-verified on the server. PayHere processes LKR securely.
          </p>
        </aside>
      </motion.form>
    </Container>
  )
}
