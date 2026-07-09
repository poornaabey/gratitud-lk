import { config } from "dotenv"
config({ path: ".env.local" })
config({ path: ".env" })

import { PrismaClient, ProductCategory } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

/**
 * Seed catalog from the Phase 1 mock data.
 * Run: npm run db:seed  (requires DATABASE_URL)
 */

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed.")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const BOX_TEMPLATES = [
  {
    slug: "matte-black",
    name: "Matte Black",
    description: "Sleek matte finish — our most popular corporate packaging.",
    basePriceCents: 150_000,
    maxVolume: 100,
    swatchClass: "bg-navy",
    sortOrder: 1,
  },
  {
    slug: "minimalist-white",
    name: "Minimalist White",
    description: "Clean white board with soft tissue wrap.",
    basePriceCents: 150_000,
    maxVolume: 100,
    swatchClass: "bg-white border border-zinc-200",
    sortOrder: 2,
  },
  {
    slug: "coral-blush",
    name: "Coral Blush",
    description: "Warm blush packaging for birthdays and celebrations.",
    basePriceCents: 180_000,
    maxVolume: 90,
    swatchClass: "bg-terracotta",
    sortOrder: 3,
  },
  {
    slug: "mint-fresh",
    name: "Mint Fresh",
    description: "Soft sage-mint finish for lifestyle-forward gifts.",
    basePriceCents: 180_000,
    maxVolume: 90,
    swatchClass: "bg-sage",
    sortOrder: 4,
  },
] as const

const PRODUCTS = [
  {
    slug: "anker-powercore-20k",
    name: "Anker PowerCore 20K",
    description: "Fast-charge hero for desk & travel.",
    priceCents: 1_250_000,
    category: ProductCategory.ANCHOR,
    volumeScore: 35,
    stock: 40,
    sortOrder: 1,
  },
  {
    slug: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro",
    description: "Noise-cancelling daily drivers.",
    priceCents: 1_890_000,
    category: ProductCategory.ANCHOR,
    volumeScore: 20,
    stock: 30,
    sortOrder: 2,
  },
  {
    slug: "fitness-smartwatch",
    name: "Fitness Smartwatch",
    description: "Health tracking with a premium finish.",
    priceCents: 2_490_000,
    category: ProductCategory.ANCHOR,
    volumeScore: 25,
    stock: 20,
    sortOrder: 3,
  },
  {
    slug: "slim-leather-wallet",
    name: "Slim Leather Wallet",
    description: "Vegetable-tanned, Colombo-made.",
    priceCents: 450_000,
    category: ProductCategory.LEATHER,
    volumeScore: 12,
    stock: 50,
    sortOrder: 10,
  },
  {
    slug: "cedar-grooming-duo",
    name: "Cedar Grooming Duo",
    description: "Beard oil + hand cream set.",
    priceCents: 320_000,
    category: ProductCategory.GROOMING,
    volumeScore: 15,
    stock: 45,
    sortOrder: 20,
  },
  {
    slug: "artisan-chocolate-tin",
    name: "Artisan Chocolate Tin",
    description: "Single-origin Sri Lankan cacao.",
    priceCents: 280_000,
    category: ProductCategory.TREATS,
    volumeScore: 18,
    stock: 60,
    sortOrder: 30,
  },
] as const

async function main() {
  console.log("Seeding box templates…")
  for (const template of BOX_TEMPLATES) {
    await prisma.boxTemplate.upsert({
      where: { slug: template.slug },
      create: { ...template },
      update: {
        name: template.name,
        description: template.description,
        basePriceCents: template.basePriceCents,
        maxVolume: template.maxVolume,
        swatchClass: template.swatchClass,
        sortOrder: template.sortOrder,
        isActive: true,
      },
    })
  }

  console.log("Seeding products…")
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: { ...product },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        category: product.category,
        volumeScore: product.volumeScore,
        stock: product.stock,
        sortOrder: product.sortOrder,
        isActive: true,
      },
    })
  }

  const [productCount, templateCount] = await Promise.all([
    prisma.product.count(),
    prisma.boxTemplate.count(),
  ])

  console.log(`Done. ${templateCount} box templates, ${productCount} products.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
