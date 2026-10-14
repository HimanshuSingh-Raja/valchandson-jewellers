# Valchandson Jewellers — Admin & Storefront Architecture Guide

Welcome to the **Valchandson Jewellers** full-stack e-commerce system. The project features a unified architecture where the luxury storefront (inspired by Beyond Larissa) and the complete administrative management console share the exact same database engine.

---

## 1. Quick Start & Credentials

### Master Admin Login
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@valchandson.com`
- **Password**: `Valchandson@2026`
- **Role**: `SUPER_ADMIN`

*(The login screen also includes a one-click "Fill Master Credentials" quick-action button for swift local development testing.)*

### Running the Application
```bash
# 1. Install dependencies
npm install

# 2. Push schema to database (SQLite dev.db)
npx prisma db push

# 3. Seed initial master admin, categories, 12 luxury pieces, sample orders, and settings
npm run seed

# 4. Start local development server (Webpack mode recommended for Next.js 16)
npm run dev
```

---

## 2. Security & Route Protection Architecture

- **Middleware Guard**: `src/middleware.ts` runs at the Edge, intercepting all requests to `/admin/*` and `/api/admin/*`.
- **JWT Verification**: Validates the `vj_admin_token` stored in an **HTTP-only, SameSite=Lax, Secure** cookie. Unauthenticated visits to `/admin` routes are automatically redirected to `/admin/login?from=[destination]`.
- **API Defense**: Server-side routes in `src/app/api/admin/*` reject unauthorized API calls with `401 Unauthorized`.
- **Password Hashing**: Passwords are encrypted with `bcryptjs` (salt rounds: 10).

---

## 3. Administrative Capabilities

### 📊 Atelier Dashboard (`/admin`)
- Real-time aggregated statistics: Active products, Low-stock alerts, Out-of-stock count, Orders pending dispatch, Total cumulative revenue.
- Low-stock inventory alert banners with immediate action links.
- Recent order transactions and immutable stock movement audit logs.

### 💍 Product Management (`/admin/products`)
- Search by title, SKU, or editorial description.
- Multi-filter by category, status (`ACTIVE`, `DRAFT`, `ARCHIVED`), and stock health.
- Quick inline publish/unpublish toggle.
- Quick product preview modal with images and variant list.
- Safe deletion with modal confirmation.

### 📸 Add & Edit Product (`/admin/products/new` & `/admin/products/[id]/edit`)
- **Multi-image upload**: Integrated with `/api/upload`, supporting drag-and-drop or file selection up to 8MB. Automatically stores to `/public/uploads` (or Supabase Storage if configured).
- **Image Reordering**: Display order controls, primary image badge, and secondary hover-image badge.
- **Luxury Specifications**: Metal purity, BIS hallmark certification, approximate gross weight, dimensions, gemstone carats, and closure mechanism.
- **Product Variants**: Add multiple sizes (e.g. US 5, US 6, US 7) and materials with individual SKU, stock allocation, and price modifiers.
- **Draft Mode & SEO**: Previews of Google search engine snippet and editorial atelier story.

### 📦 Vault Inventory & Stock Control (`/admin/inventory`)
- Live vault units count and low-stock warning indicators.
- **Quick Stock Adjustment Modal**:
  - Increase or decrease stock atomically.
  - Reason logging: `PURCHASE_RESTOCK`, `RETURN_RESTOCK`, `DAMAGE_WRITEOFF`, `AUDIT_CORRECTION`, `THEFT_OR_LOSS`, `PROMOTIONAL`.
  - Balance validation: Prevents reducing inventory below zero.
- **Global Inventory Audit Ledger**: Chronological log of every single stock event with logged-by admin email, reason, delta, and new vault balance.

### 📂 Categories & Collections (`/admin/categories`)
- Create and edit categories and curated collections.
- Banner image upload or URL.
- Homepage featured status toggle.
- Display order priority.
- **Safety check**: Blocks deletion of categories that have active products assigned.

### 🚚 Order Dispatch & Fulfillment (`/admin/orders`)
- Status tabs: `All`, `Confirmed`, `QC & Hallmarking`, `In Transit`, `Delivered`, `Cancelled`.
- Search orders by Order ID (`VJ-2026-XXXXX`), patron name, phone, or tracking number.
- **Inspection Drawer**: Full shipping address, line items breakdown, promotional discounts applied, and financial calculation.
- **Fulfillment Controls**: Change status, update payment status, assign BlueDart/Delhivery tracking AWB numbers, and save internal atelier notes.

### ⚙️ Atelier Settings (`/admin/settings`)
- Brand identity: Atelier name, tagline, email, and phone.
- **WhatsApp Private Concierge**: Direct telephone number and pre-filled consultation message.
- **Top Announcement Bar**: Enable/disable toggle, live text editing with instant storefront preview.
- **Financial & Shipping Rules**: National GST tax rate (% GST), Free shipping threshold, Standard shipping fee, and Low-stock threshold default.

---

## 4. Single Source of Truth & Database Unification

The customer storefront and admin dashboard interact seamlessly with the unified Prisma database:
1. **Catalog Sync**: Creating or updating products in `/admin/products` or categories in `/admin/categories` immediately impacts storefront collection pages and detail views.
2. **Atomic Checkout**: When a customer places an order on `/checkout`:
   - `/api/store/checkout` verifies current database pricing and checks inventory availability.
   - It atomically decrements the stock quantity and writes an immutable `CUSTOMER_ORDER` movement to the `InventoryMovement` audit ledger.
   - The order immediately appears on the Admin Orders board for QC hallmarking and dispatch.

---

## 5. Production Database: Switching to PostgreSQL

The project is currently configured with SQLite for seamless zero-setup local execution (`DATABASE_URL="file:./dev.db"`). To connect to a cloud PostgreSQL database (Supabase, Neon, or AWS RDS):

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   ```
3. Run `npx prisma db push && npm run seed`.
