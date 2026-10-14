import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });

    // Count products per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.product.count({
          where: { categorySlug: cat.slug },
        });
        return { ...cat, productCount: count };
      })
    );

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, bannerImage, displayOrder, isFeatured } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const categorySlug =
      slug?.trim().toLowerCase() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const existing = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Category slug "${categorySlug}" already exists` },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: categorySlug,
        description: description?.trim() || null,
        bannerImage: bannerImage?.trim() || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, bannerImage, displayOrder, isFeatured } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
        bannerImage: bannerImage?.trim() || null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if products exist in category
    const productsCount = await prisma.product.count({
      where: { categorySlug: category.slug },
    });
    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${productsCount} products are currently assigned to it. Reassign them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: `Category "${category.name}" removed.` });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
