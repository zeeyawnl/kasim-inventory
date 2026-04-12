import { prisma } from "@/lib/prisma";

export const productService = {
  async getAll(filters?: {
    search?: string;
    category?: string;
    lowStock?: boolean;
  }) {
    const where: Record<string, unknown> = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { sku: { contains: filters.search } },
      ];
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    let products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });

    if (filters?.lowStock) {
      products = products.filter((p: any) => p.currentStock <= p.minStock);
    }

    return products;
  },

  async getById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  async create(data: {
    name: string;
    sku: string;
    description?: string;
    category: string;
    unit: string;
    retailPrice: number;
    wholesalePrice: number;
    costPrice: number;
    currentStock?: number;
    minStock?: number;
    salesChannel?: string;
  }) {
    return prisma.product.create({ data });
  },

  async update(id: string, data: Record<string, unknown>) {
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.$transaction(async (tx: any) => {
      // Delete related order items first
      await (tx as any).orderItem.deleteMany({ where: { productId: id } });
      // Delete related stock movements
      await (tx as any).stockMovement.deleteMany({ where: { productId: id } });
      // Now delete the product
      return (tx as any).product.delete({ where: { id } });
    });
  },

  async getLowStock() {
    const products = await prisma.product.findMany();
    return products.filter((p: any) => p.currentStock <= p.minStock);
  },
};
