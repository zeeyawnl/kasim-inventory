import { prisma } from "@/lib/prisma";

export const orderService = {
  async getAll(filters?: { type?: string; status?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;

    return prisma.order.findMany({
      where,
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
  },

  async create(data: {
    orderNumber: string;
    customerId?: string;
    type: string;
    status?: string;
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    notes?: string;
    items: { productId: string; quantity: number; price: number; total: number }[];
  }) {
    const { items, ...orderData } = data;

    const createOrder = prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
    });

    const stockUpdates = items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { currentStock: { decrement: item.quantity } },
      })
    );

    const movementCreates = items.map((item) =>
      prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: "out",
          quantity: item.quantity,
          reason: "Sale",
          reference: data.orderNumber,
        },
      })
    );

    const [order] = await prisma.$transaction([
      createOrder,
      ...stockUpdates,
      ...movementCreates,
    ]);

    return order;
  },

  async updateStatus(id: string, status: string) {
    return prisma.order.update({ where: { id }, data: { status } });
  },

  async delete(id: string) {
    return prisma.order.delete({ where: { id } });
  },
};
