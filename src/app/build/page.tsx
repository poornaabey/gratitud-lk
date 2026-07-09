import type { Metadata } from "next"
import { Suspense } from "react"

import { BuilderWizard } from "@/components/builder/builder-wizard"

export const metadata: Metadata = {
  title: "Build a Box",
  description:
    "Curate a premium personalized gift box — packaging, tech anchor, lifestyle add-ons, and a handwritten note.",
}

export default function BuildPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24 text-sm text-zinc-500">
          Loading builder…
        </div>
      }
    >
      <BuilderWizard />
    </Suspense>
  )
}
