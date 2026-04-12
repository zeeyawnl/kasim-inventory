import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: any
) {
  try {
    const { id } = context.params;
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ message: "Supplier deleted" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
  }
}
