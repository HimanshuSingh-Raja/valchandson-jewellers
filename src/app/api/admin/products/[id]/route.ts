import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        inventoryMovements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      title,
      subtitle,
      categorySlug,
      collection,
      material,
      availableMaterials,
      price,
      compareAtPrice,
      status,
      isFeatured,
      isBestSeller,
      isNew,
      stockQuantity,
      lowStockThreshold,
      description,
      story,
      grossWeight,
      hallmark,
      dimensions,
      gemstones,
      closureType,
      sizes,
      tags,
      seoTitle,
      seoDescription,
      images,
      variants,
    } = body;

    // Check if stock quantity changed, log an inventory movement audit
    const newStock = stockQuantity !== undefined ? parseInt(stockQuantity, 10) : existing.stockQuantity;
    if (newStock !== existing.stockQuantity) {
      const delta = newStock - existing.stockQuantity;
      await prisma.inventoryMovement.create({
        data: {
          productId: id,
          quantityDelta: delta,
          newBalance: newStock,
          reason: "MANUAL_ADJUSTMENT",
          note: `Stock adjusted during product edit (${delta > 0 ? "+" : ""}${delta})`,
          adminUserEmail: session?.email || "admin@valchandson.com",
        },
      });
    }

    // Update Product Details
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        subtitle: subtitle !== undefined ? subtitle?.trim() || null : existing.subtitle,
        categorySlug: categorySlug !== undefined ? categorySlug : existing.categorySlug,
        collection: collection !== undefined ? collection : existing.collection,
        material: material !== undefined ? material : existing.material,
        availableMaterials:
          availableMaterials !== undefined
            ? JSON.stringify(availableMaterials)
            : existing.availableMaterials,
        price: price !== undefined ? parseFloat(price) : existing.price,
        compareAtPrice:
          compareAtPrice !== undefined
            ? compareAtPrice ? parseFloat(compareAtPrice) : null
            : existing.compareAtPrice,
        status: status !== undefined ? status : existing.status,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : existing.isBestSeller,
        isNew: isNew !== undefined ? Boolean(isNew) : existing.isNew,
        stockQuantity: newStock,
        lowStockThreshold:
          lowStockThreshold !== undefined
            ? parseInt(lowStockThreshold, 10)
            : existing.lowStockThreshold,
        description: description !== undefined ? description.trim() : existing.description,
        story: story !== undefined ? story?.trim() || null : existing.story,
        grossWeight: grossWeight !== undefined ? grossWeight?.trim() || null : existing.grossWeight,
        hallmark: hallmark !== undefined ? hallmark?.trim() || null : existing.hallmark,
        dimensions: dimensions !== undefined ? dimensions?.trim() || null : existing.dimensions,
        gemstones: gemstones !== undefined ? gemstones?.trim() || null : existing.gemstones,
        closureType: closureType !== undefined ? closureType?.trim() || null : existing.closureType,
        sizes: sizes !== undefined ? JSON.stringify(sizes) : existing.sizes,
        tags: tags !== undefined ? JSON.stringify(tags) : existing.tags,
        seoTitle: seoTitle !== undefined ? seoTitle?.trim() || null : existing.seoTitle,
        seoDescription:
          seoDescription !== undefined ? seoDescription?.trim() || null : existing.seoDescription,
      },
    });

    // Update Images if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            url: typeof img === "string" ? img : img.url,
            altText: typeof img === "object" ? img.altText : `${updated.title} photo ${i + 1}`,
            displayOrder: i,
            isHoverImage: i === 1,
          },
        });
      }
    }

    // Update Variants if provided
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: id,
            name: v.name || `${updated.material} - ${v.size || "Standard"}`,
            material: v.material || updated.material,
            size: v.size || null,
            sku: v.sku || `${updated.sku}-${(v.size || "STD").replace(/\s+/g, "")}`,
            stockQuantity: parseInt(v.stockQuantity, 10) || 5,
            priceModifier: parseFloat(v.priceModifier) || 0,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: `Product "${existing.title}" deleted.` });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
