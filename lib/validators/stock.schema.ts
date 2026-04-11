import { z } from "zod";

export const stockMovementSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  type: z.enum(["in", "out"]),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export type StockMovementInput = z.infer<typeof stockMovementSchema>;
