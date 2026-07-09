/**
 * Shared domain types for GratituD.lk.
 * Prisma enums/models are the source of truth after generate.
 */

export type {
  Product,
  BoxTemplate,
  Order,
  OrderItem,
  ProductCategory,
  OrderStatus,
  OrderItemKind,
} from "@/generated/prisma/client"

export type CatalogResponse = {
  products: import("@/generated/prisma/client").Product[]
  boxTemplates: import("@/generated/prisma/client").BoxTemplate[]
}
