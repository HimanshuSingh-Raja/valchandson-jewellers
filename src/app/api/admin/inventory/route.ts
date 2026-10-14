import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase();
    const stockStatus = searchParams.get("status"); // "all", "low-stock", "out-of-stock"

    const products = await prisma.product.findMany({
      orderBy: { stockQuantity: "asc" },
      include: {
        images: { take: 1, orderBy: { displayOrder: "asc" } },
        variants: true,
        inventoryMovements: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    let filtered = products;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    if (stockStatus === "out-of-stock") {
      filtered = filtered.filter((p) => p.stockQuantity <= 0);
    } else if (stockStatus === "low-stock") {
      filtered = filtered.filter(
        (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
      );
    }

    // Also fetch the global recent inventory movement history
    const recentHistory = await prisma.inventoryMovement.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            sku: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
    });

    return NextResponse.json({
      inventory: filtered,
      history: recentHistory,
    });
  } catch (error) {
    console.error("Fetch inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const body = await request.json();
    const { productId, variantId, quantityDelta, reason, note } = body;

    if (!productId || quantityDelta === undefined || !reason) {
      return NextResponse.json(
        { error: "Product ID, quantity adjustment, and reason are required" },
        { status: 400 }
      );
    }

    const delta = parseInt(quantityDelta, 10);
    if (isNaN(delta) || delta === 0) {
      return NextResponse.json(
        { error: "Quantity delta must be a non-zero number" },
        { status: 400 }
      );
    }

    // Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const newBalance = product.stockQuantity + delta;
      if (newBalance < 0) {
        throw new Error(`Insufficient inventory: Cannot reduce stock below 0 (current: ${product.stockQuantity})`);
      }

      // Update product stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: newBalance },
      });

      // Update variant stock if variantId is provided
      if (variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (variant) {
          await tx.productVariant.update({
            where: { id: variantId },
            data: { stockQuantity: Math.max(0, variant.stockQuantity + delta) },
          });
        }
      }

      // Record audit trail
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          variantId: variantId || null,
          quantityDelta: delta,
          newBalance,
          reason,
          note: note?.trim() || `Inventory adjustment of ${delta > 0 ? "+" : ""}${delta}`,
          adminUserEmail: session?.email || "admin@valchandson.com",
        },
      });

      return { product: updatedProduct, movement };
    });

    return NextResponse.json({
      success: true,
      message: `Stock updated successfully to ${result.product.stockQuantity}`,
      product: result.product,
      movement: result.movement,
    });
  } catch (error: any) {
    console.error("Adjust inventory error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to adjust inventory" },
      { status: 400 }
    );
  }
}
