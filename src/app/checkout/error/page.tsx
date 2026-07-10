import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircleIcon } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment incomplete",
}

export default async function CheckoutErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reason?: string }>
}) {
  const params = await searchParams
  const reason =
    params.reason ??
    "Payment was cancelled or could not be completed. Your card was not charged if you left PayHere."

  return (
    <Container className="py-16 text-center">
      <AlertCircleIcon className="mx-auto size-14 text-zinc-400" strokeWidth={1.5} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Payment could not be completed
      </h1>
      <p className="mx-auto mt-3 max-w-md text-zinc-500">{reason}</p>
      {params.order ? (
        <p className="mx-auto mt-2 font-mono text-xs text-zinc-400">
          Reference: {params.order}
        </p>
      ) : null}
      <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
        If money was deducted, PayHere will reconcile via notify. Contact us with your reference if
        you need help.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/checkout" />}>Try checkout again</Button>
        <Button variant="outline" render={<Link href="/build" />}>
          Back to builder
        </Button>
      </div>
    </Container>
  )
}
