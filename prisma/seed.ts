import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS, CATEGORIES } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("💎 Seeding Valchandson Jewellers database...");

  // 1. Create Initial Master Administrator
  const adminEmail = "admin@valchandson.com";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Valchandson@2026", 10);
    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: "Master Atelier Administrator",
        role: "SUPER_ADMIN",
        passwordHash,
      },
    });
    console.log(`✅ Master Admin created: ${admin.email}`);
  } else {
    console.log(`ℹ️ Master Admin already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Categories
  console.log("📂 Seeding Categories...");
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        bannerImage: cat.image,
        displayOrder: i + 1,
        isFeatured: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        bannerImage: cat.image,
        displayOrder: i + 1,
        isFeatured: true,
      },
    });
  }

  // 3. Seed Products with Images, Variants, and Initial Stock Movements
  console.log("✨ Seeding Products...");
  for (const p of PRODUCTS) {
    const initialStock = 12;
    const lowStockThreshold = 3;

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
    });

    if (!existing) {
      const createdProduct = await prisma.product.create({
        data: {
          id: p.id,
          slug: p.slug,
          sku: p.id.toUpperCase(),
          title: p.title,
          subtitle: p.subtitle,
          categorySlug: p.category,
          collection: p.collection,
          material: p.material,
          availableMaterials: JSON.stringify(p.availableMaterials),
          price: p.price,
          compareAtPrice: p.originalPrice || null,
          status: "ACTIVE",
          isFeatured: true,
          isBestSeller: Boolean(p.isBestSeller),
          isNew: Boolean(p.isNew),
          stockQuantity: initialStock,
          lowStockThreshold,
          rating: p.rating,
          reviewCount: p.reviewCount,
          description: p.description,
          story: p.story,
          grossWeight: p.specifications.grossWeightApprox,
          hallmark: p.specifications.hallmark,
          dimensions: p.specifications.dimensions,
          gemstones: p.specifications.gemstones || null,
          closureType: p.specifications.closureType || null,
          sizes: JSON.stringify(p.sizes || []),
          tags: JSON.stringify(p.tags),
          seoTitle: `${p.title} | Valchandson Jewellers`,
          seoDescription: p.description.slice(0, 150),
        },
      });

      // Insert Images
      for (let idx = 0; idx < p.images.length; idx++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: p.images[idx],
            altText: `${p.title} - angle ${idx + 1}`,
            displayOrder: idx,
            isHoverImage: false,
          },
        });
      }

      // Hover Image if exists
      if (p.hoverImage && !p.images.includes(p.hoverImage)) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: p.hoverImage,
            altText: `${p.title} - lifestyle on model`,
            displayOrder: 99,
            isHoverImage: true,
          },
        });
      }

      // Insert Variants
      if (p.sizes && p.sizes.length > 0) {
        for (const sz of p.sizes) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              name: `${p.material} - ${sz}`,
              material: p.material,
              size: sz,
              sku: `${p.id.toUpperCase()}-${sz.replace(/\s+/g, "")}`,
              stockQuantity: Math.floor(initialStock / p.sizes.length) || 2,
            },
          });
        }
      }

      // Record initial inventory movement audit trail
      await prisma.inventoryMovement.create({
        data: {
          productId: createdProduct.id,
          quantityDelta: initialStock,
          newBalance: initialStock,
          reason: "INITIAL_STOCK",
          note: "Initial atelier stock cataloging",
          adminUserEmail: adminEmail,
        },
      });

      console.log(`  + Product: ${p.title} (${createdProduct.sku})`);
    }
  }

  // 4. Seed Store Settings
  console.log("⚙️ Seeding Store Settings...");
  const defaultSettings = [
    { key: "store_name", value: "Valchandson Jewellers", category: "general" },
    { key: "store_tagline", value: "Handcrafted 925 Silver & Solid Gold Heirlooms", category: "general" },
    { key: "store_phone", value: "+91 (0) 141 256 8900", category: "general" },
    { key: "store_email", value: "atelier@valchandsonjewellers.com", category: "general" },
    { key: "whatsapp_number", value: "919829012345", category: "general" },
    { key: "announcement_text", value: "Complimentary Insured Express Delivery across India on orders above ₹5,000 | 100% BIS Hallmarked Purity Guarantee", category: "announcement" },
    { key: "currency_symbol", value: "₹", category: "general" },
    { key: "tax_percentage", value: "3", category: "financial" },
    { key: "low_stock_threshold", value: "3", category: "inventory" },
    { key: "free_shipping_threshold", value: "5000", category: "shipping" },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category },
      create: { key: s.key, value: s.value, category: s.category },
    });
  }

  // 5. Seed Sample Orders for Dashboard
  console.log("📦 Seeding Sample Orders...");
  const sampleOrders = [
    {
      id: "VJ-2026-94812",
      customerName: "Aditi S. Varma",
      customerEmail: "aditi.varma@example.com",
      customerPhone: "9810123456",
      shippingAddress: "B-14, Defence Colony",
      shippingCity: "New Delhi",
      shippingState: "Delhi",
      shippingPincode: "110024",
      shippingMethod: "standard",
      shippingCost: 0,
      paymentMethod: "upi",
      paymentStatus: "PAID",
      orderStatus: "DELIVERED",
      subtotal: 14850,
      discountAmount: 1485,
      taxAmount: 401,
      totalAmount: 13766,
      appliedPromo: "VALCHAND10",
      trackingNumber: "BD-DEL-984210",
      adminNotes: "Delivered via BlueDart Platinum Vault. Customer confirmed receipt.",
      items: [
        {
          productId: "vj-ring-01",
          productTitle: "Fortress of Aurora Solitaire Ring",
          selectedMaterial: "925 Sterling Silver",
          selectedSize: "US 6",
          unitPrice: 14850,
          quantity: 1,
          totalPrice: 14850,
        },
      ],
    },
    {
      id: "VJ-2026-88301",
      customerName: "Vikramaditya Rathore",
      customerEmail: "vikram.rathore@heritage.in",
      customerPhone: "9829055443",
      shippingAddress: "Heritage Haveli, C-Scheme",
      shippingCity: "Jaipur",
      shippingState: "Rajasthan",
      shippingPincode: "302001",
      shippingMethod: "priority",
      shippingCost: 350,
      paymentMethod: "card",
      paymentStatus: "PAID",
      orderStatus: "QC_HALLMARKING",
      subtotal: 48900,
      discountAmount: 0,
      taxAmount: 1467,
      totalAmount: 50717,
      appliedPromo: null,
      trackingNumber: "BD-JPR-771920",
      adminNotes: "Custom intaglio engraving requested on band interior.",
      items: [
        {
          productId: "vj-ring-02",
          productTitle: "Chola Heritage Intaglio Band",
          selectedMaterial: "22K Yellow Gold",
          selectedSize: "US 9",
          unitPrice: 48900,
          quantity: 1,
          totalPrice: 48900,
        },
      ],
    },
    {
      id: "VJ-2026-77419",
      customerName: "Meera K. Nambiar",
      customerEmail: "meera.nambiar@techcorp.io",
      customerPhone: "9900112233",
      shippingAddress: "Villa 8, Palm Meadows, Whitefield",
      shippingCity: "Bengaluru",
      shippingState: "Karnataka",
      shippingPincode: "560066",
      shippingMethod: "standard",
      shippingCost: 0,
      paymentMethod: "netbanking",
      paymentStatus: "AUTHORIZED",
      orderStatus: "CONFIRMED",
      subtotal: 19800,
      discountAmount: 1980,
      taxAmount: 535,
      totalAmount: 18355,
      appliedPromo: "VALCHAND10",
      trackingNumber: null,
      adminNotes: "Queued for packing under security surveillance.",
      items: [
        {
          productId: "vj-neck-01",
          productTitle: "Nocturne Layered Choker Necklace",
          selectedMaterial: "925 Sterling Silver",
          selectedSize: "16 inch",
          unitPrice: 19800,
          quantity: 1,
          totalPrice: 19800,
        },
      ],
    },
  ];

  for (const o of sampleOrders) {
    const existingOrder = await prisma.order.findUnique({
      where: { id: o.id },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id: o.id,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          shippingAddress: o.shippingAddress,
          shippingCity: o.shippingCity,
          shippingState: o.shippingState,
          shippingPincode: o.shippingPincode,
          shippingMethod: o.shippingMethod,
          shippingCost: o.shippingCost,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          subtotal: o.subtotal,
          discountAmount: o.discountAmount,
          taxAmount: o.taxAmount,
          totalAmount: o.totalAmount,
          appliedPromo: o.appliedPromo,
          trackingNumber: o.trackingNumber,
          adminNotes: o.adminNotes,
          items: {
            create: o.items.map((it) => ({
              productId: it.productId,
              productTitle: it.productTitle,
              selectedMaterial: it.selectedMaterial,
              selectedSize: it.selectedSize,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
              totalPrice: it.totalPrice,
            })),
          },
        },
      });
      console.log(`  + Sample Order: ${o.id}`);
    }
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
