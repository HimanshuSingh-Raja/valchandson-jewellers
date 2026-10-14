"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Check,
  Clock,
} from "lucide-react";
import { PRODUCTS, Product, MaterialType } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { ProductCard } from "@/components/product/ProductCard";
import { SizeGuideModal } from "@/components/ui/SizeGuideModal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const slug = resolvedParams.slug;
  const product = PRODUCTS.find((p) => p.slug === slug);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Delivery Estimator
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string>("specifications");

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedMaterial(product.material);
      setSelectedSize(product.sizes ? product.sizes[0] : null);
      setActiveImageIndex(0);
      setQuantity(1);

      // Track recently viewed in localStorage
      try {
        const stored = localStorage.getItem("vj_recently_viewed");
        const list: string[] = stored ? JSON.parse(stored) : [];
        const updated = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 5);
        localStorage.setItem("vj_recently_viewed", JSON.stringify(updated));

        const recentProducts = PRODUCTS.filter(
          (p) => updated.includes(p.id) && p.id !== product.id
        );
        setRecentlyViewed(recentProducts);
      } catch {
        // Ignore
      }
    }
  }, [product]);

  if (!product) {
    notFound();
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(
      product,
      quantity,
      selectedSize || undefined,
      selectedMaterial || product.material
    );
    showToast(`Added "${product.title}" to your shopping bag`, "success");
  };

  const handleBuyNow = () => {
    addItem(
      product,
      quantity,
      selectedSize || undefined,
      selectedMaterial || product.material
    );
    router.push("/checkout");
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      // Calculate delivery date 3-5 days from now
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 4);
      const formatted = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setDeliveryEstimate(`Complimentary Insured Delivery by ${formatted} to PIN ${pincode}`);
    } else {
      showToast("Please enter a valid 6-digit Indian PIN code", "error");
    }
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const whatsappInquiryUrl = `https://wa.me/919829012345?text=${encodeURIComponent(
    `Hello Valchandson Atelier, I am inquiring about the "${product.title}" (SKU: ${product.id}) priced at ₹${product.price.toLocaleString("en-IN")}. Could you assist me with customization and delivery?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link
          href={`/collections/${product.collection}`}
          className="hover:text-black transition-colors"
        >
          {product.collection === "silver-collection" ? "Silver Collection" : "Gold Collection"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link
          href={`/collections/${product.category}`}
          className="hover:text-black transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Visual */}
          <div className="relative aspect-card w-full overflow-hidden bg-stone-100 rounded border border-[#E8E2D8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="bg-[#1C1917]/90 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium shadow-sm">
                  Iconic Bestseller
                </span>
              )}
              {product.isNew && (
                <span className="bg-[#A68A5D]/90 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium shadow-sm">
                  New Unveiling
                </span>
              )}
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-colors"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? "fill-current text-red-600" : ""}`}
              />
            </button>
          </div>

          {/* Thumbnail Selector */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 sm:w-24 aspect-card shrink-0 rounded overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#1C1917] shadow-sm scale-95"
                      : "border-[#E8E2D8] opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.title} angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Product Info (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Subtitle */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
              <span>{product.specifications.hallmark}</span>
              <span>SKU: {product.id.toUpperCase()}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              {product.subtitle}
            </p>
          </div>

          {/* Price & Savings */}
          <div className="py-3 border-y border-[#E8E2D8] flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif-luxury text-3xl text-[#1C1917] font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Price inclusive of all taxes (3% GST hallmarked)
              </p>
            </div>

            {product.originalPrice && (
              <span className="text-[11px] font-semibold text-[#2E6F40] bg-[#E8F3EA] px-2.5 py-1 rounded">
                Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Metal Finish Selector */}
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-2">
              <span className="font-semibold text-stone-900">
                Metal Finish: <span className="font-normal text-stone-600">{selectedMaterial}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.availableMaterials.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-3.5 py-2 text-xs rounded border transition-all ${
                    selectedMaterial === mat
                      ? "bg-[#1C1917] text-white border-[#1C1917] font-medium"
                      : "bg-white text-stone-700 border-[#E8E2D8] hover:border-stone-400"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Size Guide Trigger */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-2">
                <span className="font-semibold text-stone-900">
                  Select Size: <span className="font-normal text-stone-600">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[#A68A5D] hover:underline flex items-center gap-1 font-medium text-[11px]"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-14 py-2 px-3 text-xs rounded border transition-all ${
                      selectedSize === sz
                        ? "bg-[#1C1917] text-white border-[#1C1917] font-medium"
                        : "bg-white text-stone-700 border-[#E8E2D8] hover:border-stone-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Add to Bag / Buy Now CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8E2D8] bg-white rounded h-12">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 text-stone-600 hover:text-black transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 text-stone-600 hover:text-black transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A68A5D] transition-colors flex items-center justify-center gap-2 rounded shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              className="w-full h-12 bg-[#FAF8F5] border-2 border-[#1C1917] text-[#1C1917] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#1C1917] hover:text-white transition-colors flex items-center justify-center gap-2 rounded"
            >
              <Zap className="w-4 h-4 text-[#A68A5D]" /> Express Buy Now
            </button>
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="bg-[#F4EFEB] p-4 rounded border border-[#E8E2D8] space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#A68A5D]" /> Estimate Insured Transit Delivery
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium rounded hover:bg-[#A68A5D] transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-xs text-[#2E6F40] font-medium flex items-center gap-1.5 pt-1">
                <Check className="w-4 h-4 shrink-0" /> {deliveryEstimate}
              </p>
            )}
          </div>

          {/* Direct WhatsApp Atelier Consultation */}
          <div className="flex items-center justify-between p-3.5 bg-white border border-[#E8E2D8] rounded">
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Questions about sizing or hallmarking?</span>
            </div>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-[#A68A5D] hover:underline"
            >
              Chat with Atelier &rarr;
            </a>
          </div>

          {/* Accordion Tabs */}
          <div className="divide-y divide-[#E8E2D8] border-y border-[#E8E2D8] pt-2 text-xs">
            {/* 1. Specifications */}
            <div className="py-3.5">
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === "specifications" ? "" : "specifications")
                }
                className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-stone-900"
              >
                <span>Product Details & Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openAccordion === "specifications" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "specifications" && (
                <div className="pt-3 text-stone-600 space-y-1.5 text-xs">
                  <p><strong>Metal Purity:</strong> {product.specifications.metalPurity}</p>
                  <p><strong>Hallmarking:</strong> {product.specifications.hallmark}</p>
                  <p><strong>Approx Gross Weight:</strong> {product.specifications.grossWeightApprox}</p>
                  <p><strong>Dimensions:</strong> {product.specifications.dimensions}</p>
                  {product.specifications.gemstones && (
                    <p><strong>Gemstones:</strong> {product.specifications.gemstones}</p>
                  )}
                  {product.specifications.closureType && (
                    <p><strong>Lock/Closure:</strong> {product.specifications.closureType}</p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Craftsmanship */}
            <div className="py-3.5">
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === "craftsmanship" ? "" : "craftsmanship")
                }
                className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-stone-900"
              >
                <span>Atelier Heritage & Craftsmanship</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openAccordion === "craftsmanship" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "craftsmanship" && (
                <div className="pt-3 text-stone-600 space-y-2 text-xs leading-relaxed">
                  <p>{product.story}</p>
                  <p>
                    Every piece is crafted in small batches using non-toxic casting practices. Finished with triple-rhodium coats for lasting tarnish resistance.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Shipping & Returns */}
            <div className="py-3.5">
              <button
                onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-stone-900"
              >
                <span>Insured Shipping & 15-Day Exchange</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openAccordion === "shipping" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="pt-3 text-stone-600 space-y-2 text-xs leading-relaxed">
                  <p>
                    • Complimentary insured door-to-door express delivery on all orders over ₹5,000.
                  </p>
                  <p>
                    • Delivered in discrete, tamper-proof security cases requiring physical OTP verification upon receipt.
                  </p>
                  <p>
                    • Enjoy 15-day complimentary ring resizing or product exchange at our flagship atelier.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Care Guide */}
            <div className="py-3.5">
              <button
                onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-stone-900"
              >
                <span>Heirloom Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openAccordion === "care" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "care" && (
                <div className="pt-3 text-stone-600 space-y-2 text-xs leading-relaxed">
                  <p>
                    • Keep away from direct spray of perfumes, alcohol sanitizers, and harsh chlorine pools.
                  </p>
                  <p>
                    • Gently wipe with the complimentary microfiber polishing cloth included in your order.
                  </p>
                  <p>
                    • Store individually inside the Valchandson suede pouch to prevent friction abrasions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#E8E2D8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
                Harmonious Pairings
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] mt-1 font-normal">
                Complete The Look
              </h2>
            </div>
            <Link
              href={`/collections/${product.category}`}
              className="text-xs uppercase tracking-widest font-medium text-[#1C1917] hover:text-[#A68A5D]"
            >
              View More &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="pt-12 border-t border-[#E8E2D8]">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
              Your Atelier Journey
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] mt-1 font-normal">
              Recently Viewed
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sizing Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category === "bracelets" ? "bracelets" : "rings"}
      />
    </div>
  );
}
