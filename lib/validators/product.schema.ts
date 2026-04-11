import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional().catch(""),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  retailPrice: z.coerce.number().nonnegative("Retail price cannot be negative").catch(0),
  wholesalePrice: z.coerce.number().nonnegative("Wholesale price cannot be negative").catch(0),
  costPrice: z.coerce.number().nonnegative("Cost price cannot be negative").catch(0),
  currentStock: z.coerce.number().min(0).optional().catch(0),
  minStock: z.coerce.number().min(0).optional().catch(10),
  salesChannel: z.string().optional().catch("both"),
}).passthrough();

export type ProductInput = z.infer<typeof productSchema>;
