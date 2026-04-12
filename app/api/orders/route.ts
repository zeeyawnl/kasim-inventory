import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/order.service";
import { orderSchema } from "@/lib/validators/order.schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;

    const orders = await orderService.getAll({ type, status });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);
    const order = await orderService.create(validated);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 400 });
  }
}
