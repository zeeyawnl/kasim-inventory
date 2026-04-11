import prisma from "@/lib/prisma";

export const customerService = {
  async getAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    return prisma.customer.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async getById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async create(data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    type?: string;
  }) {
    return prisma.customer.create({ data });
  },

  async update(id: string, data: Record<string, unknown>) {
    return prisma.customer.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.customer.delete({ where: { id } });
  },
};
