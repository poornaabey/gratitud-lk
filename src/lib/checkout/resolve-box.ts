import { addDays, startOfDay } from "date-fns"

import { prisma } from "@/lib/db"
import type { CheckoutBox } from "@/lib/validations/checkout"
import { OrderItemKind } from "@/generated/prisma/client"

export type ResolvedCheckoutLine = {
  productId: string | null
  kind: OrderItemKind
  nameSnapshot: string
  priceCents: number
  volumeScore: number
  quantity: number
}

export type ResolvedCheckoutBox = {
  boxTemplateId: string
  packagingName: string
  lines: ResolvedCheckoutLine[]
  totalAmountCents: number
  volumeUsed: number
  maxVolume: number
  itemsLabel: string
}

/**
 * Resolve builder slugs → priced line items from the live catalog.
 * Never trust client-sent prices.
 */
export async function resolveCheckoutBox(box: CheckoutBox): Promise<ResolvedCheckoutBox> {
  const packaging = await prisma.boxTemplate.findFirst({
    where: { slug: box.packagingSlug, isActive: true },
  })
  if (!packaging) {
    throw new Error("Selected packaging is unavailable.")
  }

  const anchor = await prisma.product.findFirst({
    where: { slug: box.anchorSlug, isActive: true, category: "ANCHOR" },
  })
  if (!anchor) {
    throw new Error("Selected anchor item is unavailable.")
  }

  const addons =
    box.addonSlugs.length > 0
      ? await prisma.product.findMany({
          where: {
            slug: { in: box.addonSlugs },
            isActive: true,
            category: { in: ["LEATHER", "GROOMING", "TREATS", "OTHER"] },
          },
        })
      : []

  if (addons.length !== box.addonSlugs.length) {
    throw new Error("One or more add-ons are unavailable.")
  }

  const lines: ResolvedCheckoutLine[] = [
    {
      productId: null,
      kind: OrderItemKind.PACKAGING,
      nameSnapshot: packaging.name,
      priceCents: packaging.basePriceCents,
      volumeScore: 0,
      quantity: 1,
    },
    {
      productId: anchor.id,
      kind: OrderItemKind.ANCHOR,
      nameSnapshot: anchor.name,
      priceCents: anchor.priceCents,
      volumeScore: anchor.volumeScore,
      quantity: 1,
    },
    ...addons.map((addon) => ({
      productId: addon.id,
      kind: OrderItemKind.ADDON,
      nameSnapshot: addon.name,
      priceCents: addon.priceCents,
      volumeScore: addon.volumeScore,
      quantity: 1,
    })),
  ]

  const volumeUsed = lines.reduce((sum, line) => sum + line.volumeScore * line.quantity, 0)
  if (volumeUsed > packaging.maxVolume) {
    throw new Error("This box is over capacity. Remove an add-on and try again.")
  }

  const totalAmountCents = lines.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  )

  if (totalAmountCents <= 0) {
    throw new Error("Order total must be greater than zero.")
  }

  const itemsLabel = [packaging.name, anchor.name, ...addons.map((a) => a.name)].join(", ")

  return {
    boxTemplateId: packaging.id,
    packagingName: packaging.name,
    lines,
    totalAmountCents,
    volumeUsed,
    maxVolume: packaging.maxVolume,
    itemsLabel,
  }
}

export function assertDeliveryDate(date: Date) {
  const min = startOfDay(addDays(new Date(), 2))
  if (startOfDay(date) < min) {
    throw new Error("Delivery date must be at least 2 days from today.")
  }
}
