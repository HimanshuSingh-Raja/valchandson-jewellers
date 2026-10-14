"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  RotateCcw,
  Star,
  Quote,
  ChevronRight,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function HomePage() {
  const [activeNewArrivalTab, setActiveNewArrivalTab] = useState<"all" | "silver" | "gold">("all");
  const [brandStoryVideoError, setBrandStoryVideoError] = useState(false);

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  const newArrivals = PRODUCTS.filter((p) => {
    if (activeNewArrivalTab === "silver") return p.collection === "silver-collection";
    if (activeNewArrivalTab === "gold") return p.collection === "gold";
    return p.isNew || p.isBestSeller;
  }).slice(0, 4);

  const testimonials = [
    {
      quote:
        "The Fortress of Aurora Solitaire exceeded every expectation. The 925 silver finish has a mesmerizing moonlit glow and the craft is identical to high jewellery from luxury European houses.",
      author: "Aditi S. Varma",
      location: "New Delhi",
      rating: 5,
      item: "Fortress of Aurora Solitaire Ring",
    },
    {
      quote:
        "Valchandson's Chola Intaglio band is a work of art. You can feel the weight of genuine 22K gold and the hand-graving details are sublime. Truly an heirloom piece for generations.",
      author: "Vikramaditya Rathore",
      location: "Jaipur",
      rating: 5,
      item: "Chola Heritage Intaglio Band",
    },
    {
      quote:
        "The Nocturne Choker sits like liquid silk against the neck. Packaging arrived within 3 days with transit insurance, BIS certificate, and a handwritten atelier note. Extraordinary shopping experience.",
      author: "Meera K. Nambiar",
      location: "Bengaluru",
      rating: 5,
      item: "Nocturne Layered Choker Necklace",
    },
  ];

  const instagramPosts = [
    {
      image: "/images/ring-solitaire.jpg",
      tag: "Solitaire Pavé Edit",
    },
    {
      image: "/images/necklace-chain.jpg",
      tag: "The Heritage Choker",
    },
    {
      image: "/images/earrings-cascade.jpg",
      tag: "Cascade Drop Shimmer",
    },
    {
      image: "/images/bracelet-cuff.jpg",
      tag: "Sterling Silver Cuffs",
    },
    {
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80",
      tag: "22K Solid Gold Intaglio",
    },
    {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      tag: "Polki Medallions",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Full-width Editorial Hero Section */}
      <section className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[680px] xl:min-h-[740px] flex items-center overflow-hidden bg-[#261A13]">
        {/* Full-bleed Editorial Background Image with Top-Aligned Focal Positioning to preserve model's face, eyes & jewellery */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-banner.png"
            alt="Valchandson Jewellers — Jewellery That Defines You"
            className="w-full h-full hero-banner-image transition-transform duration-1000"
          />
          {/* Studio Shadow Gradient: Enhances text legibility on the left while preserving model & jewellery brilliance on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E140E]/85 via-[#1E140E]/45 to-transparent sm:from-[#1E140E]/80 sm:via-[#1E140E]/30 sm:to-transparent lg:from-[#1E140E]/85 lg:via-[#1E140E]/25 lg:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-black/20 sm:hidden pointer-events-none" />
        </div>

        {/* Content Box (Left-Aligned, Full Luxury Editorial) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 flex">
          <div className="max-w-[300px] sm:max-w-md lg:max-w-xl text-left text-white">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.38em] uppercase text-[#D8C29D] font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D8C29D]" /> Atelier Signature Edition
            </span>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] mb-4 sm:mb-6 text-[#FAF8F5]">
              Jewellery That <br className="hidden sm:inline" />
              <span className="italic font-normal">Defines You</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#F3EEEA] font-light max-w-md mb-8 sm:mb-10 leading-relaxed tracking-wide">
              Discover timeless elegance in every detail.
            </p>

            <div>
              <Link
                href="/collections/shop-all"
                className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FAF8F5] text-[#1C1917] text-xs uppercase tracking-[0.26em] font-semibold hover:bg-[#D8C29D] hover:text-[#1C1917] transition-all duration-300 shadow-xl group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom subtle assurance indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-8 lg:left-12 text-stone-300 text-[10px] tracking-[0.28em] uppercase flex items-center gap-2 opacity-80 pointer-events-none">
          <span>BIS Hallmarked • 100% Certified Heirlooms</span>
        </div>
      </section>

      {/* 2. Four Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#E8E2D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-3.5 p-2">
            <ShieldCheck className="w-6 h-6 text-[#A68A5D] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-stone-900">
                BIS Hallmarked
              </h4>
              <p className="text-[11px] text-stone-500 font-light">100% Certified 925 & 916</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <Award className="w-6 h-6 text-[#A68A5D] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-stone-900">
                Atelier Handcrafted
              </h4>
              <p className="text-[11px] text-stone-500 font-light">Generational Jaipur Artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <Truck className="w-6 h-6 text-[#A68A5D] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-stone-900">
                Insured Delivery
              </h4>
              <p className="text-[11px] text-stone-500 font-light">Free over ₹5,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <RotateCcw className="w-6 h-6 text-[#A68A5D] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-stone-900">
                Lifetime Care
              </h4>
              <p className="text-[11px] text-stone-500 font-light">Complimentary Polish & Check</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            The Atelier Directory
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-light">
            Indulge in meticulously sculpted forms designed to elevate every celebratory milestone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group flex flex-col text-center"
            >
              <div className="aspect-card w-full overflow-hidden bg-stone-100 rounded-none relative border border-[#E8E2D8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-stone-900 mt-3 group-hover:text-[#A68A5D] transition-colors">
                {category.name}
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-light mt-0.5">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
              Iconic Masterpieces
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
              Featured Best Sellers
            </h2>
          </div>
          <Link
            href="/collections/shop-all"
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#1C1917] hover:text-[#A68A5D] transition-colors flex items-center gap-1.5 mt-3 sm:mt-0"
          >
            View All Pieces <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Editorial Campaign Banner (Beyond Larissa inspired split feature) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#F4EFEB] border border-[#E8E2D8] rounded-lg overflow-hidden shadow-sm">
          {/* Editorial Visual */}
          <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-full max-h-[440px] overflow-hidden bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial-spotlight.jpg"
              alt="The Silver & Solitaire Campaign"
              className="w-full h-full object-cover object-[center_20%]"
            />
          </div>

          {/* Editorial Story */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold mb-2">
              Editorial Spotlight
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#1C1917] leading-tight font-light mb-4">
              The Fortress of Solitaire <br />
              <span className="italic font-normal">& Liquid Silver Edition</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-4">
              Refined by our master gem-setters, each pavé crown is hand-drilled under stereo microscopes to maximize light refractions through open-gallery windows. Sourced sustainably in recycled 925 silver with a diamond-bright rhodium seal.
            </p>
            <div className="space-y-2 mb-6 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A68A5D] shrink-0" />
                <span>BIS 925 Hallmark certification with unique serial tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A68A5D] shrink-0" />
                <span>Hypoallergenic nickel-free plating with triple anti-tarnish barrier</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A68A5D] shrink-0" />
                <span>Engineered ergonomic comfort-fit band contours</span>
              </div>
            </div>
            <div>
              <Link
                href="/collections/silver-collection"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A68A5D] transition-colors"
              >
                Discover The Silver Edition <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals with category filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Freshly Unveiled
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
            New Arrivals
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {(
            [
              { id: "all", label: "All Curations" },
              { id: "silver", label: "Silver Collection" },
              { id: "gold", label: "Solid Gold" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveNewArrivalTab(tab.id)}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-colors rounded-full ${
                activeNewArrivalTab === tab.id
                  ? "bg-[#1C1917] text-white font-semibold"
                  : "bg-white text-stone-600 border border-[#E8E2D8] hover:border-stone-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Brand Story & Craftsmanship Section */}
      <section className="bg-[#1C1917] text-white py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Media Container prepared for Brand Story Video (approx 330 × 520 px) */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[330px] h-[480px] sm:h-[520px] rounded-lg overflow-hidden bg-stone-900 border border-[#2D2A26] shadow-2xl">
                {/* Responsive HTML5 Video Element */}
                <video
                  ref={(el) => {
                    if (el) {
                      el.muted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  src="/videos/brand-story.mp4"
                  poster="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    brandStoryVideoError ? "hidden" : "block"
                  }`}
                  onError={() => setBrandStoryVideoError(true)}
                />

                {/* Graceful Fallback Image (displayed if video file is missing or still loading) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80"
                  alt="Valchandson Atelier Heritage & Craftsmanship"
                  className="w-full h-full object-cover absolute inset-0 -z-10"
                />
              </div>
            </div>

            {/* Right: Story copy */}
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#D8C29D] font-medium">
                The Heritage Since 1974
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light leading-tight text-[#FAF8F5]">
                Generational Mastery, <br />
                <span className="italic font-normal">Conscious Heritage</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Founded fifty years ago in Jaipur&apos;s historic jeweler lanes, Valchandson began with an unwavering oath: to protect ancient Indian metalcraft techniques while innovating lightweight ergonomics for the modern cosmopolitan collector.
              </p>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Every gemstone is hand-inspected for optical symmetry, and every silver and gold bar is melted in-house to ensure strict compliance with Bureau of Indian Standards (BIS) hallmarking protocols.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#D8C29D] hover:text-white transition-colors"
                >
                  Read Our Full Atelier Story <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Collector Experiences
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
            Voices of Our Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-white border border-[#E8E2D8] rounded flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <Quote className="w-6 h-6 text-[#A68A5D] mb-4 opacity-70" />
                <div className="flex gap-1 text-[#A68A5D] mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif-luxury text-base text-stone-800 italic leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#E8E2D8] text-xs">
                <p className="font-semibold text-stone-900">{item.author}</p>
                <p className="text-[11px] text-stone-400">{item.location} • Verified Buyer</p>
                <span className="inline-block mt-1 text-[10px] text-[#A68A5D] font-mono">
                  {item.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Instagram / Social Editorial Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Curated Visuals
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
            @valchandsonjewellers
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tag us in your heirloom moments to be featured in our quarterly gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-stone-100 block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.tag}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                <InstagramIcon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium tracking-wider">{post.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
