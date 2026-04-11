import { prisma } from "@/lib/prisma";
import LowStockClient from "./LowStockClient";

export default async function LowStockList() {
  const products = await prisma.product.findMany();
  const lowStockItems = products
    .filter(p => p.currentStock <= p.minStock)
    .map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.currentStock,
      min: p.minStock
    }))
    .slice(0, 5);

  return <LowStockClient items={lowStockItems} />;
}

