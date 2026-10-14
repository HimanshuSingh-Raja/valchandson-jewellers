"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlistProducts, clearWishlist, wishlistCount } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((product) => {
      addItem(product);
    });
    showToast(`Moved all ${wishlistProducts.length} items to your shopping bag`, "success");
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F4EFEB] flex items-center justify-center mx-auto mb-6 text-[#A68A5D]">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl uppercase tracking-wider text-[#1C1917] mb-3 font-medium">
          Your Wishlist is Empty
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Tap the heart icon on any heirloom piece to save it for your celebratory milestones or consultation appointments.
        </p>
        <Link
          href="/collections/shop-all"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A68A5D] transition-colors rounded shadow-sm"
        >
          Explore All Heirlooms <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Title */}
      <div className="border-b border-[#E8E2D8] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Saved Curations
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium mt-0.5">
            My Wishlist ({wishlistCount})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMoveAllToBag}
            className="px-4 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors rounded flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Move All to Bag
          </button>
          <button
            onClick={clearWishlist}
            className="text-xs text-stone-500 hover:text-red-600 underline"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
