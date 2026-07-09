import { z } from "zod"

export const productCategorySchema = z.enum([
  "ANCHOR",
  "LEATHER",
  "GROOMING",
  "TREATS",
  "OTHER",
])

export const orderStatusSchema = z.enum([
  "PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
])

export const orderItemKindSchema = z.enum(["PACKAGING", "ANCHOR", "ADDON"])

export const createOrderItemSchema = z.object({
  productId: z.string().min(1).optional().nullable(),
  kind: orderItemKindSchema,
  nameSnapshot: z.string().min(1).max(200),
  priceCents: z.number().int().nonnegative(),
  volumeScore: z.number().int().nonnegative().default(0),
  quantity: z.number().int().positive().default(1),
})

export const createOrderSchema = z.object({
  boxTemplateId: z.string().min(1).optional().nullable(),
  message: z.string().max(500).optional().nullable(),
  isSurprise: z.boolean().default(true),

  recipientName: z.string().min(2).max(120),
  recipientPhone: z.string().min(7).max(30),
  recipientEmail: z.email().optional().nullable(),
  recipientAddress: z.string().min(5).max(500),
  recipientCity: z.string().min(2).max(80).default("Colombo"),
  deliveryDate: z.coerce.date(),

  billingName: z.string().min(2).max(120),
  billingEmail: z.email(),
  billingPhone: z.string().min(7).max(30),
  billingAddress: z.string().max(500).optional().nullable(),

  items: z.array(createOrderItemSchema).min(1),
  userId: z.string().optional().nullable(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
