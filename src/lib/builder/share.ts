import type { BuilderCatalog, BuilderShareState } from "@/types/builder"
import { BUILDER_PRESETS } from "@/lib/builder/mock-catalog"
import type { BuilderStepId } from "@/lib/constants"

export function serializeBuilderShare(state: BuilderShareState): string {
  const params = new URLSearchParams()
  if (state.packagingSlug) params.set("pkg", state.packagingSlug)
  if (state.anchorSlug) params.set("anchor", state.anchorSlug)
  if (state.addonSlugs.length) params.set("addons", state.addonSlugs.join(","))
  if (state.message.trim()) params.set("msg", state.message.trim())
  return params.toString()
}

export function parseBuilderShare(params: URLSearchParams): {
  state: BuilderShareState
  step: BuilderStepId
  occasion: string | null
} | null {
  const occasion = params.get("occasion")
  const pkg = params.get("pkg")
  const anchor = params.get("anchor")
  const addons = params.get("addons")
  const msg = params.get("msg")
  const preset = params.get("preset")

  if (pkg || anchor || addons || msg) {
    return {
      state: {
        packagingSlug: pkg,
        anchorSlug: anchor,
        addonSlugs: addons ? addons.split(",").filter(Boolean) : [],
        message: msg ?? "",
      },
      step: "review",
      occasion,
    }
  }

  if (preset && BUILDER_PRESETS[preset]) {
    const p = BUILDER_PRESETS[preset]
    return {
      state: {
        packagingSlug: p.packagingSlug,
        anchorSlug: p.anchorSlug,
        addonSlugs: [...p.addonSlugs],
        message: p.message,
      },
      step: "review",
      occasion,
    }
  }

  if (occasion) {
    return {
      state: {
        packagingSlug: "matte-black",
        anchorSlug: null,
        addonSlugs: [],
        message: "",
      },
      step: "packaging",
      occasion,
    }
  }

  return null
}

export function computeBuilderTotals(
  catalog: BuilderCatalog,
  state: BuilderShareState,
) {
  const packaging = catalog.boxTemplates.find((t) => t.slug === state.packagingSlug) ?? null
  const anchor = catalog.products.find((p) => p.slug === state.anchorSlug) ?? null
  const addons = catalog.products.filter((p) => state.addonSlugs.includes(p.slug))

  const volumeUsed =
    (anchor?.volumeScore ?? 0) + addons.reduce((sum, p) => sum + p.volumeScore, 0)
  const maxVolume = packaging?.maxVolume ?? 100
  const totalCents =
    (packaging?.basePriceCents ?? 0) +
    (anchor?.priceCents ?? 0) +
    addons.reduce((sum, p) => sum + p.priceCents, 0)
  const itemCount = (anchor ? 1 : 0) + addons.length

  return { packaging, anchor, addons, volumeUsed, maxVolume, totalCents, itemCount }
}

export function buildShareUrl(origin: string, state: BuilderShareState) {
  const qs = serializeBuilderShare(state)
  return qs ? `${origin}/build?${qs}` : `${origin}/build`
}
