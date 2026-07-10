import { z } from "zod"
import { orderItemKindSchema } from "@/lib/validations/order"

/** Box payload carried from the builder into checkout (slugs, not prices). */
export const checkoutBoxSchema = z.object({
  packagingSlug: z.string().min(1),
  anchorSlug: z.string().min(1),
  addonSlugs: z.array(z.string().min(1)).default([]),
  message: z.string().max(500).optional().nullable(),
})

export const checkoutRequestSchema = z.object({
  box: checkoutBoxSchema,
  isSurprise: z.boolean().default(true),

  recipientName: z.string().min(2).max(120),
  recipientPhone: z.string().min(7).max(30),
  recipientEmail: z.email().optional().nullable().or(z.literal("")),
  recipientAddress: z.string().min(5).max(500),
  recipientCity: z.string().min(2).max(80).default("Colombo"),
  deliveryDate: z.coerce.date(),

  billingName: z.string().min(2).max(120),
  billingEmail: z.email(),
  billingPhone: z.string().min(7).max(30),
  billingAddress: z.string().max(500).optional().nullable().or(z.literal("")),

  /** Skip PayHere and mark as demo success (sandbox / unconfigured only). */
  demoMode: z.boolean().optional().default(false),
})

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
export type CheckoutBox = z.infer<typeof checkoutBoxSchema>

export { orderItemKindSchema }
