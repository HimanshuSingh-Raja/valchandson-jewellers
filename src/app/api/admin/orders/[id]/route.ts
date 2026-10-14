import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                sku: true,
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Fetch single order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber, adminNotes } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: orderStatus !== undefined ? orderStatus : existing.orderStatus,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existing.paymentStatus,
        trackingNumber: trackingNumber !== undefined ? trackingNumber?.trim() || null : existing.trackingNumber,
        adminNotes: adminNotes !== undefined ? adminNotes?.trim() || null : existing.adminNotes,
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: `Order ${id} updated to ${updated.orderStatus}`,
      order: updated,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
