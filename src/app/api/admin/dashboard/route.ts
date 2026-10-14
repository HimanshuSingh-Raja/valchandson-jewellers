import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockCount,
      allProducts,
      totalOrders,
      pendingOrders,
      orders,
      recentMovements,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.count({ where: { stockQuantity: { lte: 0 } } }),
      prisma.product.findMany({
        select: {
          id: true,
          title: true,
          sku: true,
          stockQuantity: true,
          lowStockThreshold: true,
          price: true,
        },
      }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          orderStatus: { in: ["PENDING", "CONFIRMED", "QC_HALLMARKING"] },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.inventoryMovement.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: { id: true, title: true, sku: true },
          },
        },
      }),
    ]);

    // Calculate low stock items (where stock <= lowStockThreshold and > 0)
    const lowStockItems = allProducts.filter(
      (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
    );

    // Calculate revenue
    const allCompletedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: { in: ["PAID", "AUTHORIZED"] },
        orderStatus: { not: "CANCELLED" },
      },
      select: { totalAmount: true },
    });
    const totalRevenue = allCompletedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      metrics: {
        totalProducts,
        activeProducts,
        outOfStockCount,
        lowStockCount: lowStockItems.length,
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
      lowStockProducts: lowStockItems.slice(0, 5),
      recentOrders: orders,
      recentMovements,
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
