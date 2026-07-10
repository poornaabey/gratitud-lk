import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"

import { formatLKR } from "@/lib/constants"
import { prisma } from "@/lib/db"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { ClearBuilderOnSuccess } from "@/components/checkout/clear-builder-on-success"
import { SuccessCheckmark } from "@/components/checkout/success-checkmark"

export const metadata: Metadata = {
  title: "Order confirmed",
}

async function loadOrder(orderParam: string | undefined) {
  if (!orderParam) return null
  try {
    const byId = await prisma.order.findUnique({
      where: { id: orderParam },
      include: { items: true, boxTemplate: true },
    })
    if (byId) return byId

    return await prisma.order.findUnique({
      where: { payhereOrderId: orderParam },
      include: { items: true, boxTemplate: true },
    })
  } catch (error) {
    console.error("[checkout/success] order lookup failed", error)
    return null
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string }>
}) {
  const params = await searchParams
  const isDemo = params.demo === "1"
  const resolved = await loadOrder(params.order)

  return (
    <Container className="py-16 text-center">
      <ClearBuilderOnSuccess />
      <SuccessCheckmark />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {isDemo ? "Demo order confirmed" : "Thank you — gift secured"}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-zinc-500">
        {isDemo
          ? "No payment was charged. This path is for local testing when PayHere is in sandbox or unconfigured."
          : "We received your payment confirmation. Our team will curate and deliver on the date you chose."}
      </p>

      {resolved ? (
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-900">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Reference</dt>
              <dd className="font-mono text-xs text-zinc-900 dark:text-zinc-50">
                {resolved.payhereOrderId ?? resolved.id}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Recipient</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {resolved.recipientName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Delivery</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {format(resolved.deliveryDate, "d MMM yyyy")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <dt className="text-zinc-500">Total</dt>
              <dd className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatLKR(resolved.totalAmountCents)}
              </dd>
            </div>
            {resolved.isSurprise ? (
              <p className="border-t border-zinc-100 pt-3 text-xs text-zinc-400 dark:border-zinc-800">
                Surprise gift — pricing stays off the box.
              </p>
            ) : null}
            {resolved.status === "AWAITING_PAYMENT" ? (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Payment is still confirming with PayHere. This usually updates within a minute.
              </p>
            ) : null}
          </dl>
        </div>
      ) : (
        <p className="mx-auto mt-8 max-w-md text-sm text-zinc-500">
          If you paid successfully, a confirmation email will follow. Keep your PayHere receipt as
          reference.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/build" />}>Build another box</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back home
        </Button>
      </div>
    </Container>
  )
}
