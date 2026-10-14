import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const slug = searchParams.get("slug");

    if (slug) {
      const product = await prisma.product.findFirst({
        where: { slug, status: "ACTIVE" },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
      });
      return NextResponse.json({ product });
    }

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (category && category !== "all" && category !== "shop-all") {
      where.categorySlug = category;
    }

    if (collection && collection !== "all" && collection !== "shop-all") {
      if (collection === "new-arrivals") {
        where.isNew = true;
      } else if (collection === "best-sellers") {
        where.isBestSeller = true;
      } else {
        where.collection = collection;
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Store products query error:", error);
    return NextResponse.json({ error: "Failed to query storefront products" }, { status: 500 });
  }
}
