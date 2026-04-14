import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/order.service";
import { stackServerApp } from "@/stack/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const order = await orderService.getById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const { status } = await request.json();
    const order = await orderService.updateStatus(id, status);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    await orderService.delete(id);
    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
