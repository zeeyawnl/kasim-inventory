import { NextResponse } from "next/server";
import { productService } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: any
) {
  try {
    const { id } = context.params;
    const product = await productService.getById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: any
) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const product = await productService.update(id, body);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: any
) {
  try {
    const { id } = context.params;
    await productService.delete(id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
