import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const nextStatus = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    const updated = await prisma.product.update({
      where: { id },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      message: `Product is now ${updated.status === "ACTIVE" ? "Published (Live on storefront)" : "Draft (Hidden from storefront)"}`,
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
