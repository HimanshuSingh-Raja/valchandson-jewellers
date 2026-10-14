"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { QuickAddModal } from "@/components/product/QuickAddModal";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isFavorited) {
      showToast(`Saved "${product.title}" to your wishlist`, "success");
    } else {
      showToast(`Removed "${product.title}" from wishlist`, "info");
    }
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickAddOpen(true);
  };

  // Color swatch mappings
  const getSwatchColor = (metal: string) => {
    if (metal.includes("Rose")) return "bg-[#E6B8A2]";
    if (metal.includes("Gold")) return "bg-[#E5C158]";
    if (metal.includes("Silver") || metal.includes("Platinum")) return "bg-[#D6D6D4]";
    return "bg-stone-300";
  };

  return (
    <>
      <div className="group relative flex flex-col bg-transparent">
        {/* Image Container with 4:5 portrait ratio */}
        <div className="relative aspect-card w-full overflow-hidden bg-[#F4EFEB] rounded-none">
          <Link
            href={`/product/${product.slug}`}
            className="block w-full h-full relative overflow-hidden"
            aria-label={product.title}
          >
            {/* Primary Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                product.hoverImage ? "group-hover:opacity-0" : ""
              }`}
              loading="lazy"
            />

            {/* Secondary Image on Hover */}
            {product.hoverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.hoverImage}
                alt={`${product.title} lifestyle view`}
                className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
                loading="lazy"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            {product.isBestSeller && (
              <span className="bg-[#1C1917]/90 backdrop-blur-sm text-[#FAF8F5] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase px-2 py-0.5 font-medium shadow-sm">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="bg-[#A68A5D]/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] tracking-[0.16em] uppercase px-2 py-0.5 font-medium shadow-sm">
                New Edition
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-[#8B0000]/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] tracking-[0.16em] uppercase px-2 py-0.5 font-medium shadow-sm">
                Festive Offer
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
              isFavorited
                ? "bg-white text-red-600 shadow-md"
                : "bg-white/80 hover:bg-white text-stone-700 hover:text-black shadow-sm"
            }`}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-red-600" : ""}`} />
          </button>

          {/* Quick Add Button sliding up on hover */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:block">
            <button
              type="button"
              onClick={handleQuickAddClick}
              className="w-full py-2.5 bg-white/95 backdrop-blur-md text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-1.5 shadow-md border border-[#E8E2D8]"
            >
              <Plus className="w-3.5 h-3.5" /> Quick Add
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-3 pb-2 flex flex-col flex-1 justify-between">
          <div>
            {/* Available Metal Swatches */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {product.availableMaterials.map((mat) => (
                <span
                  key={mat}
                  title={mat}
                  className={`w-2.5 h-2.5 rounded-full border border-black/10 inline-block ${getSwatchColor(
                    mat
                  )}`}
                />
              ))}
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-light ml-1">
                {product.collection === "silver-collection" ? "925 Silver" : "Gold"}
              </span>
            </div>

            {/* Title */}
            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#A68A5D] transition-colors">
              <h3 className="font-serif-luxury text-sm sm:text-base font-medium text-[#1C1917] line-clamp-1 leading-snug">
                {product.title}
              </h3>
            </Link>

            {/* Subtitle */}
            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-light">
              {product.subtitle}
            </p>
          </div>

          {/* Price & Mobile Quick Add trigger */}
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E8E2D8]/40">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-[#1C1917] tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Mobile-only Quick Add Icon Button */}
            <button
              onClick={handleQuickAddClick}
              className="sm:hidden p-1.5 text-stone-700 hover:text-black border border-[#E8E2D8] rounded bg-white text-[10px] uppercase font-semibold flex items-center gap-1"
              aria-label="Quick Add"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
};
