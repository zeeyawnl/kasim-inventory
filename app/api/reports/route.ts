import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "summary";

    if (type === "summary") {
      const [totalProducts, totalCustomers, totalOrders, lowStockCount] =
        await Promise.all([
          prisma.product.count(),
          prisma.customer.count(),
          prisma.order.count(),
          prisma.product.count({
            where: {
              currentStock: { lte: 10 }, // simplified low stock check
            },
          }),
        ]);

      return NextResponse.json({
        totalProducts,
        totalCustomers,
        totalOrders,
        lowStockCount,
      });
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
