import { NextResponse } from "next/server";
import { productService } from "@/lib/services/product.service";
import { productSchema } from "@/lib/validators/product.schema";
import { stackServerApp } from "@/stack/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const lowStock = searchParams.get("lowStock") === "true";

    const products = await productService.getAll({ search, category, lowStock });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validated = productSchema.parse(body);
    const product = await productService.create(validated);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
