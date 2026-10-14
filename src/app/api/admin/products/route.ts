import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase();
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const stock = searchParams.get("stock");
    const sortBy = searchParams.get("sortBy") || "createdAt-desc";

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category && category !== "all") {
      where.categorySlug = category;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (stock === "out-of-stock") {
      where.stockQuantity = { lte: 0 };
    }

    // Build orderBy
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sortBy === "createdAt-asc") orderBy = { createdAt: "asc" };
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "title-asc") orderBy = { title: "asc" };
    if (sortBy === "stock-asc") orderBy = { stockQuantity: "asc" };
    if (sortBy === "stock-desc") orderBy = { stockQuantity: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });

    // If stock filter was "low-stock" (needs lowStockThreshold evaluation)
    let result = products;
    if (stock === "low-stock") {
      result = products.filter(
        (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
      );
    } else if (stock === "in-stock") {
      result = products.filter((p) => p.stockQuantity > p.lowStockThreshold);
    }

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const body = await request.json();

    const {
      title,
      subtitle,
      categorySlug,
      collection = "silver-collection",
      material,
      availableMaterials = [],
      price,
      compareAtPrice,
      status = "ACTIVE",
      isFeatured = false,
      isBestSeller = false,
      isNew = true,
      stockQuantity = 10,
      lowStockThreshold = 3,
      description,
      story,
      grossWeight,
      hallmark,
      dimensions,
      gemstones,
      closureType,
      sizes = [],
      tags = [],
      seoTitle,
      seoDescription,
      images = [],
      variants = [],
    } = body;

    if (!title || !price || !categorySlug || !material || !description) {
      return NextResponse.json(
        { error: "Title, category, material, price, and description are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    let slug = baseSlug;
    let count = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Generate unique SKU
    const skuPrefix = `VJ-${categorySlug.slice(0, 3).toUpperCase()}`;
    const randomSkuSuffix = Math.floor(100 + Math.random() * 900);
    const sku = body.sku?.trim().toUpperCase() || `${skuPrefix}-${randomSkuSuffix}`;

    // Create product in transaction
    const newProduct = await prisma.product.create({
      data: {
        slug,
        sku,
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        categorySlug,
        collection,
        material,
        availableMaterials: JSON.stringify(
          availableMaterials.length > 0 ? availableMaterials : [material]
        ),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        status,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNew: Boolean(isNew),
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 3,
        description: description.trim(),
        story: story?.trim() || null,
        grossWeight: grossWeight?.trim() || null,
        hallmark: hallmark?.trim() || "BIS Hallmarked",
        dimensions: dimensions?.trim() || null,
        gemstones: gemstones?.trim() || null,
        closureType: closureType?.trim() || null,
        sizes: JSON.stringify(sizes),
        tags: JSON.stringify(tags),
        seoTitle: seoTitle?.trim() || `${title} | Valchandson Jewellers`,
        seoDescription: seoDescription?.trim() || description.slice(0, 150),
      },
    });

    // Save images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: newProduct.id,
            url: typeof img === "string" ? img : img.url,
            altText: typeof img === "object" ? img.altText : `${newProduct.title} photo ${i + 1}`,
            displayOrder: i,
            isHoverImage: i === 1,
          },
        });
      }
    }

    // Save variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: newProduct.id,
            name: v.name || `${material} - ${v.size || "Standard"}`,
            material: v.material || material,
            size: v.size || null,
            sku: v.sku || `${newProduct.sku}-${(v.size || "STD").replace(/\s+/g, "")}`,
            stockQuantity: parseInt(v.stockQuantity, 10) || Math.floor(stockQuantity / variants.length) || 1,
            priceModifier: parseFloat(v.priceModifier) || 0,
          },
        });
      }
    }

    // Record initial inventory movement audit
    await prisma.inventoryMovement.create({
      data: {
        productId: newProduct.id,
        quantityDelta: parseInt(stockQuantity, 10) || 0,
        newBalance: parseInt(stockQuantity, 10) || 0,
        reason: "INITIAL_STOCK",
        note: `New product created: ${newProduct.title}`,
        adminUserEmail: session?.email || "admin@valchandson.com",
      },
    });

    const fullProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: { images: true, variants: true },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
