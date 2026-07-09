import type { ProductCategory } from "@/generated/prisma/client"
import type { BuilderBoxTemplate, BuilderCatalog, BuilderProduct } from "@/types/builder"
import { rupeesToCents } from "@/lib/constants"

/** Mock catalog — mirrors prisma/seed.ts so share links work offline. */

export const MOCK_BOX_TEMPLATES: BuilderBoxTemplate[] = [
  {
    id: "mock-pkg-matte-black",
    slug: "matte-black",
    name: "Matte Black",
    description: "Sleek matte finish — our most popular corporate packaging.",
    basePriceCents: rupeesToCents(1500),
    maxVolume: 100,
    imageUrl: null,
    swatchClass: "bg-navy",
  },
  {
    id: "mock-pkg-minimalist-white",
    slug: "minimalist-white",
    name: "Minimalist White",
    description: "Clean white board with soft tissue wrap.",
    basePriceCents: rupeesToCents(1500),
    maxVolume: 100,
    imageUrl: null,
    swatchClass: "bg-white border border-zinc-200",
  },
  {
    id: "mock-pkg-coral-blush",
    slug: "coral-blush",
    name: "Coral Blush",
    description: "Warm blush packaging for birthdays and celebrations.",
    basePriceCents: rupeesToCents(1800),
    maxVolume: 90,
    imageUrl: null,
    swatchClass: "bg-terracotta",
  },
  {
    id: "mock-pkg-mint-fresh",
    slug: "mint-fresh",
    name: "Mint Fresh",
    description: "Soft sage-mint finish for lifestyle-forward gifts.",
    basePriceCents: rupeesToCents(1800),
    maxVolume: 90,
    imageUrl: null,
    swatchClass: "bg-sage",
  },
]

export const MOCK_PRODUCTS: BuilderProduct[] = [
  {
    id: "mock-p-anker",
    slug: "anker-powercore-20k",
    name: "Anker PowerCore 20K",
    description: "Fast-charge hero for desk & travel.",
    priceCents: rupeesToCents(12500),
    category: "ANCHOR" as ProductCategory,
    volumeScore: 35,
    imageUrl: null,
    stock: 40,
  },
  {
    id: "mock-p-buds",
    slug: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro",
    description: "Noise-cancelling daily drivers.",
    priceCents: rupeesToCents(18900),
    category: "ANCHOR" as ProductCategory,
    volumeScore: 20,
    imageUrl: null,
    stock: 30,
  },
  {
    id: "mock-p-watch",
    slug: "fitness-smartwatch",
    name: "Fitness Smartwatch",
    description: "Health tracking with a premium finish.",
    priceCents: rupeesToCents(24900),
    category: "ANCHOR" as ProductCategory,
    volumeScore: 25,
    imageUrl: null,
    stock: 20,
  },
  {
    id: "mock-p-wallet",
    slug: "slim-leather-wallet",
    name: "Slim Leather Wallet",
    description: "Vegetable-tanned, Colombo-made.",
    priceCents: rupeesToCents(4500),
    category: "LEATHER" as ProductCategory,
    volumeScore: 12,
    imageUrl: null,
    stock: 50,
  },
  {
    id: "mock-p-groom",
    slug: "cedar-grooming-duo",
    name: "Cedar Grooming Duo",
    description: "Beard oil + hand cream set.",
    priceCents: rupeesToCents(3200),
    category: "GROOMING" as ProductCategory,
    volumeScore: 15,
    imageUrl: null,
    stock: 45,
  },
  {
    id: "mock-p-choc",
    slug: "artisan-chocolate-tin",
    name: "Artisan Chocolate Tin",
    description: "Single-origin Sri Lankan cacao.",
    priceCents: rupeesToCents(2800),
    category: "TREATS" as ProductCategory,
    volumeScore: 18,
    imageUrl: null,
    stock: 60,
  },
]

export const MOCK_CATALOG: BuilderCatalog = {
  products: MOCK_PRODUCTS,
  boxTemplates: MOCK_BOX_TEMPLATES,
  source: "mock",
}

/** Featured / occasion presets keyed by marketing slug. */
export const BUILDER_PRESETS: Record<
  string,
  {
    packagingSlug: string
    anchorSlug: string
    addonSlugs: string[]
    message: string
  }
> = {
  "urban-pro": {
    packagingSlug: "matte-black",
    anchorSlug: "anker-powercore-20k",
    addonSlugs: ["slim-leather-wallet", "artisan-chocolate-tin"],
    message: "For the one who never slows down — thank you.",
  },
  "soft-launch": {
    packagingSlug: "coral-blush",
    anchorSlug: "wireless-earbuds-pro",
    addonSlugs: ["cedar-grooming-duo", "artisan-chocolate-tin"],
    message: "Happy birthday — hope this makes you smile.",
  },
  boardroom: {
    packagingSlug: "matte-black",
    anchorSlug: "fitness-smartwatch",
    addonSlugs: ["slim-leather-wallet"],
    message: "Welcome to the team. Excited to build with you.",
  },
}

export const ADDON_CATEGORIES = [
  { id: "LEATHER" as const, label: "Leather" },
  { id: "GROOMING" as const, label: "Grooming" },
  { id: "TREATS" as const, label: "Treats" },
]
