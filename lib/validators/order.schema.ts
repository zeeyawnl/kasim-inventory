import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  price: z.number().positive("Price must be positive"),
  total: z.number().positive("Total must be positive"),
});

export const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().optional(),
  type: z.enum(["retail", "wholesale"]),
  status: z.string().optional(),
  subtotal: z.number().positive(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  total: z.number().positive(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
