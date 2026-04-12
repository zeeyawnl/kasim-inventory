import { NextResponse } from "next/server";
import { stockService } from "@/lib/services/stock.service";
import { stockMovementSchema } from "@/lib/validators/stock.schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;

    const movements = await stockService.getMovements(productId);
    return NextResponse.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = stockMovementSchema.parse(body);

    let result;
    if (validated.type === "in") {
      result = await stockService.addStock(
        validated.productId,
        validated.quantity,
        validated.reason,
        validated.reference
      );
    } else {
      result = await stockService.removeStock(
        validated.productId,
        validated.quantity,
        validated.reason,
        validated.reference
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error processing stock movement:", error);
    return NextResponse.json({ error: "Failed to process stock movement" }, { status: 400 });
  }
}
