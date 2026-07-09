/**
 * App-wide constants for GratituD.lk.
 */

export const SITE = {
  name: "GratituD.lk",
  tagline: "Gifts that feel like a hug from home.",
  city: "Colombo, Sri Lanka",
  phone: "+94 77 000 0000",
  email: "hello@gratitud.lk",
  deliveryNote: "Same-week delivery across Colombo · Island-wide on request",
} as const

/** Steps of the interactive gift builder (drives the wizard + progress bar). */
export const BUILDER_STEPS = [
  {
    id: "packaging",
    label: "Packaging",
    description: "Pick a box theme and capacity.",
  },
  {
    id: "anchor",
    label: "Anchor Item",
    description: "Choose the hero tech piece.",
  },
  {
    id: "addons",
    label: "Add-ons",
    description: "Curate lifestyle fillers by category.",
  },
  {
    id: "personalize",
    label: "Personalize",
    description: "Write a handwritten-style note.",
  },
  {
    id: "review",
    label: "Review",
    description: "Confirm, share, and checkout.",
  },
] as const

export type BuilderStepId = (typeof BUILDER_STEPS)[number]["id"]

/**
 * LKR is stored as integer cents everywhere. Convert + format at the edges only.
 */
export function formatLKR(cents: number): string {
  const rupees = cents / 100
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(rupees)
}

export function rupeesToCents(rupees: number): number {
  return Math.round(rupees * 100)
}
