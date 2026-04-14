import { prisma } from "@/lib/prisma";

export const stockService = {
  async addStock(productId: string, quantity: number, reason?: string, reference?: string) {
    return prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productId,
          type: "in",
          quantity,
          reason,
          reference,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { currentStock: { increment: quantity } },
      }),
    ]);
  },

  async removeStock(productId: string, quantity: number, reason?: string, reference?: string) {
    return prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productId,
          type: "out",
          quantity,
          reason,
          reference,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { currentStock: { decrement: quantity } },
      }),
    ]);
  },

  async getMovements(productId?: string) {
    const where = productId ? { productId } : {};
    return prisma.stockMovement.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
