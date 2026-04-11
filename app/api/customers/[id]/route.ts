import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.$transaction(async (tx) => {
      // Find all orders for this customer
      const orders = await tx.order.findMany({ where: { customerId: id }, select: { id: true } });
      const orderIds = orders.map(o => o.id);
      // Delete order items for those orders
      if (orderIds.length > 0) {
        await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      }
      // Delete orders
      await tx.order.deleteMany({ where: { customerId: id } });
      // Delete customer
      await tx.customer.delete({ where: { id } });
    });
    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
