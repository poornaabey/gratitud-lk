/**
 * GratituD.lk — design token reference
 *
 * This project uses Tailwind CSS v4 (CSS-first config in `src/app/globals.css`).
 * There is no runtime `tailwind.config.ts` theme object. This file documents the
 * premium minimalist system for humans and tooling; tokens are applied via `@theme`.
 *
 * Philosophy: pristine canvas, navy trust, champagne warmth, product-first.
 * No neon, no muddy browns, no heavy radial meshes.
 */

export const gratitudDesignSystem = {
  colors: {
    light: {
      background: "#F8FAFC", // slate-50
      card: "#FFFFFF",
      foreground: "#18181B", // zinc-900
      mutedForeground: "#71717A", // zinc-500
      border: "#E4E4E7", // zinc-200
      primary: "#1E293B", // deep navy — trust / structure
      primaryForeground: "#F8FAFC",
      terracotta: "#C17F59", // soft terracotta — CTA / gifting warmth
      terracottaForeground: "#FFFFFF",
      champagne: "#D4B896", // subtle highlight (fullness, chips)
      sage: "#6B7F71",
    },
    dark: {
      background: "#09090B", // zinc-950
      card: "#18181B", // zinc-900
      foreground: "#FAFAFA",
      mutedForeground: "#A1A1AA",
      border: "#27272A",
      primary: "#E4E4E7",
      terracotta: "#D4926E",
      champagne: "#E2C9A5",
    },
  },
  shadows: {
    soft: "0 8px 30px rgb(0 0 0 / 0.04)",
    softMd: "0 12px 40px rgb(0 0 0 / 0.06)",
    softLg: "0 20px 50px rgb(0 0 0 / 0.07)",
  },
  radius: {
    default: "0.75rem",
    pill: "9999px",
  },
  typography: {
    ui: "Plus Jakarta Sans / Inter — geometric sans for all UI",
    emphasis: "Playfair Display / Fraunces — serif ONLY for hero emphasis words",
    script: "Caveat — greeting-card preview only",
  },
  spacing: {
    sectionY: "py-20 md:py-28",
    containerX: "px-6 sm:px-8 lg:px-10",
    cardPadding: "p-6 md:p-8",
  },
} as const

export default gratitudDesignSystem
