"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { PRODUCTS, Product, MaterialType, CategoryType } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

interface CollectionMeta {
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
}

const COLLECTION_METAS: Record<string, CollectionMeta> = {
  "shop-all": {
    title: "All Heirloom Jewellery",
    subtitle: "The Complete Valchandson Catalog",
    description:
      "Explore our entire archive of certified 925 sterling silver and 18K/22K solid gold creations, each handcrafted with precision and stamped with national hallmark certification.",
    bannerImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80",
  },
  "silver-collection": {
    title: "The Silver Collection",
    subtitle: "Luminous 925 Sterling Silver Edition",
    description:
      "Inspired by the fluid brilliance of the Beyond Larissa silver aesthetic. Sculpted in recycled solid 925 silver with diamond-bright rhodium seals and pavé settings.",
    bannerImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2000&q=80",
  },
  gold: {
    title: "Solid Gold Creations",
    subtitle: "BIS 916 & 750 Hallmarked Masterpieces",
    description:
      "Impeccably finished in solid 18-karat and 22-karat yellow and rose gold. Hand-engraved with ancestral temple motifs and set with fine polki and radiant solitaire stones.",
    bannerImage:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=2000&q=80",
  },
  rings: {
    title: "Artisan Rings & Solitaires",
    subtitle: "Pavé Crowns, Eternity Bands & Cocktails",
    description:
      "Engineered for daily ergonomics and ceremonial majesty. Every ring features hand-set stones and comfort-fit interior contours.",
    bannerImage:
      "/images/ring-solitaire.jpg",
  },
  necklaces: {
    title: "Chokers & Necklaces",
    subtitle: "Articulated Collars & Heritage Pendants",
    description:
      "From fluid liquid-silver chokers to regal uncut polki medallions, discover neckwear sculpted to rest like molten silk against the collarbone.",
    bannerImage:
      "/images/necklace-chain.jpg",
  },
  earrings: {
    title: "Earrings & Drops",
    subtitle: "Architectural Falls, Filigrees & Everyday Huggies",
    description:
      "Lightweight articulated earrings engineered to catch every subtle flicker of light with graceful day-to-night movement.",
    bannerImage:
      "/images/earrings-cascade.jpg",
  },
  bracelets: {
    title: "Bracelets & Cuffs",
    subtitle: "Solid Sterling Tension Cuffs & Tennis Chains",
    description:
      "Modern minimalism meets classic luxury with dual-safety clasps and architectural curves designed for lifelong wear.",
    bannerImage:
      "/images/bracelet-cuff.jpg",
  },
  "new-arrivals": {
    title: "New Festive Arrivals",
    subtitle: "Fresh From The Jaipur Atelier",
    description:
      "The latest ceremonial additions and minimalist silver everyday essentials curated for the upcoming season.",
    bannerImage:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=2000&q=80",
  },
  "best-sellers": {
    title: "Bestselling Icons",
    subtitle: "Most Cherished Valchandson Heirlooms",
    description:
      "The definitive pieces loved by our discerning collectors across India and worldwide.",
    bannerImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2000&q=80",
  },
};

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const meta = COLLECTION_METAS[slug] || COLLECTION_METAS["shop-all"];

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Initial products filtering based on route slug
  const baseProducts = useMemo(() => {
    if (slug === "silver-collection") {
      return PRODUCTS.filter((p) => p.collection === "silver-collection");
    }
    if (slug === "gold") {
      return PRODUCTS.filter((p) => p.collection === "gold");
    }
    if (slug === "rings" || slug === "necklaces" || slug === "earrings" || slug === "bracelets") {
      return PRODUCTS.filter((p) => p.category === slug);
    }
    if (slug === "new-arrivals") {
      return PRODUCTS.filter((p) => p.isNew);
    }
    if (slug === "best-sellers") {
      return PRODUCTS.filter((p) => p.isBestSeller);
    }
    return PRODUCTS;
  }, [slug]);

  // Apply user-selected filters
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      // Material filter
      if (
        selectedMaterial !== "all" &&
        product.material !== selectedMaterial &&
        !product.availableMaterials.includes(selectedMaterial as MaterialType)
      ) {
        return false;
      }
      // Price range
      if (selectedPriceRange === "under-15000" && product.price >= 15000) return false;
      if (selectedPriceRange === "15000-35000" && (product.price < 15000 || product.price > 35000))
        return false;
      if (selectedPriceRange === "35000-60000" && (product.price < 35000 || product.price > 60000))
        return false;
      if (selectedPriceRange === "above-60000" && product.price <= 60000) return false;

      // In stock
      if (inStockOnly && !product.inStock) return false;

      return true;
    });
  }, [baseProducts, selectedCategory, selectedMaterial, selectedPriceRange, inStockOnly]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedMaterial !== "all" ? 1 : 0) +
    (selectedPriceRange !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMaterial("all");
    setSelectedPriceRange("all");
    setInStockOnly(false);
  };

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Collection Banner */}
      <section className="relative bg-[#F4EFEB] border-b border-[#E8E2D8] py-14 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A68A5D] font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> {meta.subtitle}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1C1917] font-light tracking-tight mb-4 uppercase">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto font-light leading-relaxed mb-4">
            {meta.description}
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-400 font-mono">
            <span>Showing {sortedProducts.length} Handcrafted Creations</span>
          </div>
        </div>
      </section>

      {/* 2. Sticky Filter & Sorting Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 border-b border-[#E8E2D8] bg-[#FAF8F5]/90 backdrop-blur-sm sticky top-[72px] z-30">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-[#E8E2D8] bg-white rounded text-xs uppercase tracking-wider text-stone-800 font-medium"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#A68A5D]" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>

          {/* Desktop Filter Chips */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            {/* Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 uppercase tracking-wider text-[11px]">Type:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-[#E8E2D8] rounded px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="all">All Types</option>
                <option value="rings">Rings</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="pendants">Pendants</option>
              </select>
            </div>

            {/* Material */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 uppercase tracking-wider text-[11px]">Metal:</span>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="bg-white border border-[#E8E2D8] rounded px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="all">All Metals</option>
                <option value="925 Sterling Silver">925 Sterling Silver</option>
                <option value="18K Yellow Gold">18K Solid Gold</option>
                <option value="22K Yellow Gold">22K Solid Gold</option>
                <option value="18K Rose Gold">18K Rose Gold</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 uppercase tracking-wider text-[11px]">Price:</span>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="bg-white border border-[#E8E2D8] rounded px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="all">All Prices</option>
                <option value="under-15000">Under ₹15,000</option>
                <option value="15000-35000">₹15,000 – ₹35,000</option>
                <option value="35000-60000">₹35,000 – ₹60,000</option>
                <option value="above-60000">Above ₹60,000</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#E8E2D8] text-[#1C1917] focus:ring-0"
              />
              <span className="text-[11px] uppercase tracking-wider text-stone-700">In Stock Only</span>
            </label>

            {/* Reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#A68A5D] hover:underline uppercase tracking-wider font-semibold ml-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 uppercase tracking-wider text-[11px] hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-[#E8E2D8] rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#A68A5D] uppercase tracking-wider"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 pt-3 flex-wrap text-xs">
            <span className="text-stone-400 text-[11px] uppercase tracking-wider">Active:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E2D8] rounded-full text-stone-700 text-[11px]">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("all")}><X className="w-3 h-3 text-stone-400" /></button>
              </span>
            )}
            {selectedMaterial !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E2D8] rounded-full text-stone-700 text-[11px]">
                {selectedMaterial}
                <button onClick={() => setSelectedMaterial("all")}><X className="w-3 h-3 text-stone-400" /></button>
              </span>
            )}
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E2D8] rounded-full text-stone-700 text-[11px]">
                {selectedPriceRange}
                <button onClick={() => setSelectedPriceRange("all")}><X className="w-3 h-3 text-stone-400" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E2D8] rounded-full text-stone-700 text-[11px]">
                In Stock
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-stone-400" /></button>
              </span>
            )}
          </div>
        )}
      </section>

      {/* 3. Responsive Products Grid (2-column on mobile, 4-column on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E8E2D8] rounded p-8">
            <h3 className="font-serif-luxury text-2xl text-stone-800 mb-2 font-medium">
              No matching heirloom pieces
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              We couldn&apos;t find pieces matching all selected filters. Try broadening your criteria.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#A68A5D] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < sortedProducts.length && (
          <div className="text-center pt-12">
            <p className="text-xs text-stone-500 mb-3 font-mono">
              Showing {displayedProducts.length} of {sortedProducts.length} heirloom creations
            </p>
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-8 py-3.5 bg-white border border-[#1C1917] text-[#1C1917] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              Load More Pieces
            </button>
          </div>
        )}
      </section>

      {/* Mobile Filter Drawer Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity lg:hidden ${
          isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileFilterOpen(false)}
        />
        <div
          className={`absolute bottom-0 inset-x-0 bg-[#FAF8F5] rounded-t-xl max-h-[80vh] flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
            isMobileFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#E8E2D8] flex items-center justify-between">
            <h3 className="font-serif-luxury text-lg font-semibold uppercase tracking-wider text-stone-900">
              Filter Collection
            </h3>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-1 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 overflow-y-auto space-y-6 text-xs">
            {/* Category */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">
                Jewellery Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["all", "rings", "necklaces", "earrings", "bracelets", "pendants"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-3 text-center rounded border uppercase text-[11px] ${
                      selectedCategory === cat
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-white text-stone-700 border-[#E8E2D8]"
                    }`}
                  >
                    {cat === "all" ? "All Types" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">
                Metal Purity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "all",
                  "925 Sterling Silver",
                  "18K Yellow Gold",
                  "22K Yellow Gold",
                  "18K Rose Gold",
                ].map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`py-2 px-2 text-center rounded border uppercase text-[10px] leading-tight ${
                      selectedMaterial === mat
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-white text-stone-700 border-[#E8E2D8]"
                    }`}
                  >
                    {mat === "all" ? "All Metals" : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#E8E2D8] text-[#1C1917]"
                />
                <span className="uppercase tracking-wider text-stone-800 font-medium">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E8E2D8] flex gap-3 bg-white">
            <button
              onClick={resetFilters}
              className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold text-stone-600 border border-[#E8E2D8] rounded"
            >
              Reset
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-semibold rounded"
            >
              View ({sortedProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
