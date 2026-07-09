"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { BUILDER_STEPS, type BuilderStepId } from "@/lib/constants"
import { parseBuilderShare } from "@/lib/builder/share"

type BuilderState = {
  step: BuilderStepId
  packagingSlug: string | null
  anchorSlug: string | null
  addonSlugs: string[]
  message: string
  occasion: string | null
  hydratedFromUrl: boolean

  setStep: (step: BuilderStepId) => void
  goNext: () => void
  goBack: () => void
  setPackaging: (slug: string) => void
  setAnchor: (slug: string | null) => void
  toggleAddon: (slug: string) => void
  setMessage: (message: string) => void
  hydrateFromSearchParams: (params: URLSearchParams) => void
  reset: () => void
}

const INITIAL = {
  step: "packaging" as BuilderStepId,
  packagingSlug: "matte-black" as string | null,
  anchorSlug: null as string | null,
  addonSlugs: [] as string[],
  message: "",
  occasion: null as string | null,
  hydratedFromUrl: false,
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      setStep: (step) => set({ step }),

      goNext: () => {
        const index = BUILDER_STEPS.findIndex((s) => s.id === get().step)
        const next = BUILDER_STEPS[index + 1]
        if (next) set({ step: next.id })
      },

      goBack: () => {
        const index = BUILDER_STEPS.findIndex((s) => s.id === get().step)
        const prev = BUILDER_STEPS[index - 1]
        if (prev) set({ step: prev.id })
      },

      setPackaging: (slug) => set({ packagingSlug: slug }),

      setAnchor: (slug) => set({ anchorSlug: slug }),

      toggleAddon: (slug) => {
        const current = get().addonSlugs
        set({
          addonSlugs: current.includes(slug)
            ? current.filter((s) => s !== slug)
            : [...current, slug],
        })
      },

      setMessage: (message) => set({ message }),

      hydrateFromSearchParams: (params) => {
        const parsed = parseBuilderShare(params)
        if (!parsed) {
          set({ hydratedFromUrl: true })
          return
        }
        // URL / preset always wins over persisted draft when present.
        set({
          packagingSlug: parsed.state.packagingSlug ?? "matte-black",
          anchorSlug: parsed.state.anchorSlug,
          addonSlugs: parsed.state.addonSlugs,
          message: parsed.state.message,
          step: parsed.step,
          occasion: parsed.occasion,
          hydratedFromUrl: true,
        })
      },

      reset: () => set({ ...INITIAL, hydratedFromUrl: true }),
    }),
    {
      name: "gratitud-builder-v1",
      partialize: (state) => ({
        packagingSlug: state.packagingSlug,
        anchorSlug: state.anchorSlug,
        addonSlugs: state.addonSlugs,
        message: state.message,
        step: state.step,
        occasion: state.occasion,
      }),
    },
  ),
)
