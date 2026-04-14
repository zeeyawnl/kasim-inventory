import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: any
) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = context.params;
    await prisma.$transaction(async (tx: any) => {
      // Find all orders for this customer
      const orders = await (tx as any).order.findMany({ where: { customerId: id }, select: { id: true } });
      const orderIds = orders.map((o: any) => o.id);
      // Delete order items for those orders
      if (orderIds.length > 0) {
        await (tx as any).orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      }
      // Delete orders
      await (tx as any).order.deleteMany({ where: { customerId: id } });
      // Delete customer
      await (tx as any).customer.delete({ where: { id } });
    });
    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
