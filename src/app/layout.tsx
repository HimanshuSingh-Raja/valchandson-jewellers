import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export const metadata: Metadata = {
  title: "Valchandson Jewellers | Handcrafted 925 Silver & Solid Gold Heirlooms",
  description:
    "Explore timeless fine jewellery handcrafted by generational master goldsmiths. Featuring certified 925 sterling silver, 18K/22K gold, solitaire rings, chokers, and bespoke bridal creations.",
  keywords: [
    "Valchandson Jewellers",
    "silver jewellery",
    "925 sterling silver",
    "gold solitaire rings",
    "heirloom jewellery",
    "bridal jewellery jaipur",
    "beyond larissa inspired",
  ],
  openGraph: {
    title: "Valchandson Jewellers | Timeless Craftsmanship",
    description: "Handcrafted certified fine jewellery designed for generations.",
    siteName: "Valchandson Jewellers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#D8C29D] selection:text-[#1C1917]">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <StorefrontShell>{children}</StorefrontShell>
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
