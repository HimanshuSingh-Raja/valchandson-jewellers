import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PROMO_CODES } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      customer,
      shippingMethod = "standard",
      paymentMethod = "upi",
      appliedPromo,
      orderNote,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customer?.email || !customer?.phone || !customer?.firstName || !customer?.address) {
      return NextResponse.json(
        { error: "Customer contact and complete shipping address are required" },
        { status: 400 }
      );
    }

    // 1. Fetch live products from database to validate price and stock
    const validatedItems: Array<{
      productId: string;
      productTitle: string;
      selectedMaterial: string;
      selectedSize?: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      currentStock: number;
    }> = [];

    for (const item of items) {
      const identifier = item.product?.id || item.productId;
      const slug = item.product?.slug;

      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            ...(identifier ? [{ id: identifier }] : []),
            ...(slug ? [{ slug }] : []),
          ],
        },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product "${item.product?.title || identifier || 'Selected item'}" is no longer available.` },
          { status: 400 }
        );
      }

      if (dbProduct.status !== "ACTIVE") {
        return NextResponse.json(
          { error: `"${dbProduct.title}" is currently unpublished or in draft mode.` },
          { status: 400 }
        );
      }

      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${dbProduct.title}". Only ${dbProduct.stockQuantity} pieces remaining.`,
          },
          { status: 400 }
        );
      }

      // Use strictly server-side verified price
      const unitPrice = dbProduct.price;
      const totalPrice = unitPrice * item.quantity;

      validatedItems.push({
        productId: dbProduct.id,
        productTitle: dbProduct.title,
        selectedMaterial: item.selectedMaterial || dbProduct.material,
        selectedSize: item.selectedSize || undefined,
        unitPrice,
        quantity: item.quantity,
        totalPrice,
        currentStock: dbProduct.stockQuantity,
      });
    }

    // 2. Compute financial totals server-side
    const subtotal = validatedItems.reduce((acc, it) => acc + it.totalPrice, 0);

    let discountAmount = 0;
    if (appliedPromo && PROMO_CODES[appliedPromo.toUpperCase()]) {
      const promo = PROMO_CODES[appliedPromo.toUpperCase()];
      if (promo.type === "percent") {
        discountAmount = Math.round((subtotal * promo.value) / 100);
      } else {
        discountAmount = Math.min(subtotal, promo.value);
      }
    }

    const freeShippingThreshold = 5000;
    const baseShipping = subtotal >= freeShippingThreshold ? 0 : 350;
    const shippingCost = shippingMethod === "priority" ? baseShipping + 350 : baseShipping;

    const taxableBase = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableBase * 0.03); // 3% GST
    const totalAmount = taxableBase + shippingCost + taxAmount;

    // 3. Generate unique Order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VJ-2026-${randomSuffix}`;

    // 4. Atomic Database Transaction: Order creation + stock decrement + inventory movement audit
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          id: orderId,
          customerName: `${customer.firstName} ${customer.lastName || ""}`.trim(),
          customerEmail: customer.email.trim().toLowerCase(),
          customerPhone: customer.phone.trim(),
          shippingAddress: customer.address.trim(),
          shippingApartment: customer.apartment?.trim() || null,
          shippingCity: customer.city.trim(),
          shippingState: customer.state.trim(),
          shippingPincode: customer.pincode.trim(),
          shippingMethod,
          shippingCost,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "PENDING" : "AUTHORIZED",
          orderStatus: "CONFIRMED",
          subtotal,
          discountAmount,
          taxAmount,
          totalAmount,
          appliedPromo: appliedPromo || null,
          giftNote: orderNote?.trim() || null,
          items: {
            create: validatedItems.map((it) => ({
              productId: it.productId,
              productTitle: it.productTitle,
              selectedMaterial: it.selectedMaterial,
              selectedSize: it.selectedSize || null,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
              totalPrice: it.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      // Atomic stock reduction & audit movements
      for (const it of validatedItems) {
        const newBalance = it.currentStock - it.quantity;

        // Decrement product stock
        await tx.product.update({
          where: { id: it.productId },
          data: { stockQuantity: newBalance },
        });

        // Record inventory audit movement
        await tx.inventoryMovement.create({
          data: {
            productId: it.productId,
            quantityDelta: -it.quantity,
            newBalance,
            reason: "CUSTOMER_ORDER",
            note: `Fulfilled in customer order ${orderId}`,
            adminUserEmail: `system@valchandson.com`,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (error) {
    console.error("Store checkout error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please review your cart and details." },
      { status: 500 }
    );
  }
}
