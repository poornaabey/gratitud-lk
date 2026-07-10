import type { Metadata } from "next"
import { Suspense } from "react"

import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Surprise-safe gifting checkout with PayHere payment in LKR.",
}

export default function CheckoutPage() {
  return (
    <div className="bg-slate-50 dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">
            Loading checkout…
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
