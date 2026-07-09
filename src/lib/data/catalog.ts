import { rupeesToCents } from "@/lib/constants"

export type Occasion = {
  id: string
  name: string
  blurb: string
  accent: "coral" | "mint" | "sun" | "ink"
}

export type FeaturedBox = {
  id: string
  slug: string
  name: string
  tagline: string
  occasion: string
  priceCents: number
  itemCount: number
  highlights: string[]
}

export type PackagingTheme = {
  id: string
  name: string
  basePriceCents: number
  maxVolume: number
  swatch: string
}

export type CatalogProduct = {
  id: string
  name: string
  category: "anchor" | "leather" | "grooming" | "treats"
  priceCents: number
  volumeScore: number
  blurb: string
}

export const OCCASIONS: Occasion[] = [
  {
    id: "birthday",
    name: "Birthdays",
    blurb: "Tech-forward surprises that feel personal, not generic.",
    accent: "coral",
  },
  {
    id: "corporate",
    name: "Corporate",
    blurb: "HR-ready boxes for onboarding, milestones & client thank-yous.",
    accent: "ink",
  },
  {
    id: "diaspora",
    name: "Send Home",
    blurb: "For Sri Lankans abroad who want a flawless local delivery.",
    accent: "mint",
  },
  {
    id: "anniversary",
    name: "Anniversaries",
    blurb: "Elevated lifestyle + a handwritten note that lands soft.",
    accent: "sun",
  },
]

export const FEATURED_BOXES: FeaturedBox[] = [
  {
    id: "box-urban-pro",
    slug: "urban-pro",
    name: "Urban Pro",
    tagline: "Power bank, leather tray & Colombo coffee.",
    occasion: "For the always-on professional",
    priceCents: rupeesToCents(14500),
    itemCount: 5,
    highlights: ["Anker 20K", "Leather cardholder", "Specialty brew"],
  },
  {
    id: "box-soft-launch",
    slug: "soft-launch",
    name: "Soft Launch",
    tagline: "AirPods-ready kit with grooming & treats.",
    occasion: "Birthdays & just-because",
    priceCents: rupeesToCents(28500),
    itemCount: 6,
    highlights: ["Wireless buds", "Grooming duo", "Artisan chocolate"],
  },
  {
    id: "box-boardroom",
    slug: "boardroom",
    name: "Boardroom",
    tagline: "Smartwatch-led set for client & team gifts.",
    occasion: "Corporate HR favourite",
    priceCents: rupeesToCents(42000),
    itemCount: 4,
    highlights: ["Smartwatch", "Matte black box", "Surprise-safe invoice"],
  },
]

export const PACKAGING_THEMES: PackagingTheme[] = [
  {
    id: "pkg-matte-black",
    name: "Matte Black",
    basePriceCents: rupeesToCents(1500),
    maxVolume: 100,
    swatch: "bg-ink",
  },
  {
    id: "pkg-minimal-white",
    name: "Minimalist White",
    basePriceCents: rupeesToCents(1500),
    maxVolume: 100,
    swatch: "bg-white border border-border",
  },
  {
    id: "pkg-coral-blush",
    name: "Coral Blush",
    basePriceCents: rupeesToCents(1800),
    maxVolume: 90,
    swatch: "bg-coral",
  },
  {
    id: "pkg-mint-fresh",
    name: "Mint Fresh",
    basePriceCents: rupeesToCents(1800),
    maxVolume: 90,
    swatch: "bg-mint",
  },
]

export const SAMPLE_PRODUCTS: CatalogProduct[] = [
  {
    id: "p-anker",
    name: "Anker PowerCore 20K",
    category: "anchor",
    priceCents: rupeesToCents(12500),
    volumeScore: 35,
    blurb: "Fast-charge hero for desk & travel.",
  },
  {
    id: "p-buds",
    name: "Wireless Earbuds Pro",
    category: "anchor",
    priceCents: rupeesToCents(18900),
    volumeScore: 20,
    blurb: "Noise-cancelling daily drivers.",
  },
  {
    id: "p-watch",
    name: "Fitness Smartwatch",
    category: "anchor",
    priceCents: rupeesToCents(24900),
    volumeScore: 25,
    blurb: "Health tracking with a premium finish.",
  },
  {
    id: "p-wallet",
    name: "Slim Leather Wallet",
    category: "leather",
    priceCents: rupeesToCents(4500),
    volumeScore: 12,
    blurb: "Vegetable-tanned, Colombo-made.",
  },
  {
    id: "p-groom",
    name: "Cedar Grooming Duo",
    category: "grooming",
    priceCents: rupeesToCents(3200),
    volumeScore: 15,
    blurb: "Beard oil + hand cream set.",
  },
  {
    id: "p-choc",
    name: "Artisan Chocolate Tin",
    category: "treats",
    priceCents: rupeesToCents(2800),
    volumeScore: 18,
    blurb: "Single-origin Sri Lankan cacao.",
  },
]

export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Ordered from Dubai for my sister’s birthday — the surprise toggle meant zero spoilers. She cried happy tears.",
    name: "Nimasha R.",
    role: "Diaspora · Dubai",
  },
  {
    id: "t2",
    quote:
      "We use GratituD for every new-hire welcome kit. Build-a-Box makes HR look thoughtful without the chaos.",
    name: "Kasun M.",
    role: "People Ops · Colombo",
  },
  {
    id: "t3",
    quote:
      "The handwritten preview sold me. Tech + lifestyle in one box felt premium, not random.",
    name: "Ayesha F.",
    role: "Product designer",
  },
] as const
