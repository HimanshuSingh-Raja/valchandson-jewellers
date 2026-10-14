# 💎 Valchandson Jewellers — Luxury Heritage E-Commerce & Admin Suite

A modern, full-stack luxury jewellery e-commerce platform and back-office management portal built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

---

## ✨ Features

### 🛍️ Client Storefront
- **Heritage Luxury Design**: Custom typography, gold leaf accents, smooth transitions, and high-resolution asset displays.
- **Dynamic Mega Menu**: Interactive nested navigation with visual featured picks, instant hover previews, and quick category jumps.
- **Interactive Product Catalog**:
  - Filter by category, metal purity (18K, 22K, Platinum), gemstone, price, and in-stock availability.
  - Dual-image hover preview on ring showcases.
  - Image zoom, size selector, metal breakdown, and live hallmark certification badges.
- **Live Gold & Silver Ticker**: Real-time market bullion rates bar.
- **WhatsApp Concierge**: 1-click floating VIP concierge for bespoke consultations.
- **Editorial Spotlight & Brand Film**: Embedded cinematic video and editorial storytelling sections.
- **Shopping Bag & Wishlist**: Persistent cart, coupon code calculation, free insured shipping threshold progress bar.
- **Checkout & Order Tracking**: Multi-step checkout with address validation and real-time status tracker (`/track-order`).

### 👑 Admin Management Portal (`/admin`)
- **Isolated Back-Office Layout**: Dedicated dashboard view with fixed luxury sidebar navigation and separate full-screen workspace.
- **Executive Dashboard**: Revenue summaries, order status charts, customer retention metrics, and top-selling collections.
- **Product Inventory Manager**: Add, edit, archive products, manage SKU stocks, upload image galleries, and toggle featured spotlight.
- **Order Pipeline**: Track orders across fulfillment stages (*Placed*, *Processing*, *Hallmarking*, *Dispatched*, *Delivered*).
- **Customer CRM**: Customer lifetime spend, purchase history, and contact directory.
- **Live Store Settings & Bullion Pricing**: Update 22K/24K gold rates, silver rates, shipping rules, and contact info.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Forms & State**: React Hooks & Local Storage persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd "Valchandson Jewellers"

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client and apply migrations
npx prisma db push

# Seed sample jewellery products, categories, and admin credentials
npm run prisma:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the storefront.  
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin portal.

---

## 🔐 Default Admin Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@valchandson.com` | `admin123` |

*(Refer to [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for administrative instructions.)*

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
Private & Proprietary — Valchandson Jewellers. All rights reserved.
