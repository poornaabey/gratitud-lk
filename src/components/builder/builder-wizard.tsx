"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { BUILDER_STEPS } from "@/lib/constants"
import { buildShareUrl } from "@/lib/builder/share"
import { useBuilderStore } from "@/store/builder-store"
import { useCatalog } from "@/hooks/use-catalog"
import { useBuilderTotals } from "@/hooks/use-builder-totals"
import { Container } from "@/components/layout/container"
import { StepIndicator } from "@/components/builder/step-indicator"
import { BoxSummary } from "@/components/builder/box-summary"
import { StickyPriceBar } from "@/components/builder/sticky-price-bar"
import { StepPackaging } from "@/components/builder/steps/step-packaging"
import { StepAnchor } from "@/components/builder/steps/step-anchor"
import { StepAddons } from "@/components/builder/steps/step-addons"
import { StepPersonalize } from "@/components/builder/steps/step-personalize"
import { StepReview } from "@/components/builder/steps/step-review"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BuilderWizard() {
  const searchParams = useSearchParams()
  const { catalog, status, isLoading } = useCatalog()
  const didHydrate = React.useRef(false)

  const step = useBuilderStore((s) => s.step)
  const occasion = useBuilderStore((s) => s.occasion)
  const packagingSlug = useBuilderStore((s) => s.packagingSlug)
  const anchorSlug = useBuilderStore((s) => s.anchorSlug)
  const addonSlugs = useBuilderStore((s) => s.addonSlugs)
  const message = useBuilderStore((s) => s.message)
  const goNext = useBuilderStore((s) => s.goNext)
  const goBack = useBuilderStore((s) => s.goBack)
  const hydrateFromSearchParams = useBuilderStore((s) => s.hydrateFromSearchParams)

  const { totalCents, itemCount } = useBuilderTotals(catalog)
  const stepIndex = BUILDER_STEPS.findIndex((s) => s.id === step)

  React.useEffect(() => {
    if (didHydrate.current) return
    didHydrate.current = true
    hydrateFromSearchParams(new URLSearchParams(searchParams.toString()))
  }, [hydrateFromSearchParams, searchParams])

  async function shareBox() {
    const url = buildShareUrl(window.location.origin, {
      packagingSlug,
      anchorSlug,
      addonSlugs,
      message,
    })
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied", {
        description: "Send it to friends for approval or cost-splitting.",
      })
    } catch {
      toast.message("Share link", { description: url })
    }
  }

  const canContinue =
    step === "packaging"
      ? Boolean(packagingSlug)
      : step === "anchor"
        ? Boolean(anchorSlug)
        : true

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">
        Loading catalog…
      </div>
    )
  }

  return (
    <div className="bg-slate-50 pb-28 dark:bg-zinc-950 md:pb-16">
      <Container className="py-10 md:py-14">
        <div className="mb-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full border border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900"
            >
              Build-a-Box
            </Badge>
            {status === "fallback" ? (
              <Badge
                variant="secondary"
                className="rounded-full border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                Demo catalog (connect DATABASE_URL for live data)
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="rounded-full border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              >
                Live catalog
              </Badge>
            )}
            {occasion ? (
              <Badge
                variant="secondary"
                className="rounded-full capitalize text-terracotta"
              >
                Occasion: {occasion}
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Build your gift
              </h1>
              <p className="mt-2 max-w-xl text-sm text-zinc-500 sm:text-base">
                Five calm steps — packaging, tech anchor, lifestyle add-ons, a handwritten note, then
                review. Totals and fullness update live.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={shareBox}>
              <Share2Icon className="size-4" />
              Save & share
            </Button>
          </div>

          <StepIndicator current={step} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
              >
                {step === "packaging" ? (
                  <StepPackaging templates={catalog.boxTemplates} />
                ) : null}
                {step === "anchor" ? <StepAnchor products={catalog.products} /> : null}
                {step === "addons" ? <StepAddons products={catalog.products} /> : null}
                {step === "personalize" ? <StepPersonalize /> : null}
                {step === "review" ? <StepReview catalog={catalog} /> : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3">
              <Button variant="outline" disabled={stepIndex === 0} onClick={goBack}>
                Back
              </Button>
              {step !== "review" ? (
                <Button disabled={!canContinue} onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button disabled title="Checkout in Phase 4">
                  Proceed to checkout
                </Button>
              )}
            </div>
          </div>

          <BoxSummary catalog={catalog} />
        </div>
      </Container>

      <StickyPriceBar totalCents={totalCents} itemCount={itemCount} onShare={shareBox} />
    </div>
  )
}
