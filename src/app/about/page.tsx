"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#1C1917] text-white py-16 px-4">
        <div className="absolute inset-0 z-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=2000&q=80"
            alt="Valchandson Jaipur Atelier Heritage"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.38em] text-[#D8C29D] font-medium">
            The Atelier Legacy • Est. 1974
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-[#FAF8F5]">
            Generational Mastery, <br />
            <span className="italic font-normal">Modern Minimalism</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            For half a century, Valchandson Jewellers has bridged imperial Rajasthani gold artistry with contemporary architectural silhouettes in pure 925 silver and solid gold.
          </p>
        </div>
      </section>

      {/* Brand Story Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
              Our Journey
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium">
              A Legacy Born in Jaipur&apos;s Historic Quarter
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Founded in 1974 by master craftsman Valchand Ji in the gemstone heart of Rajasthan, our atelier originated as a bespoke commission house for royal families and connoisseurs of hand-graved gold temple jewelry.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Today, our second and third generation artisan families preserve the lost arts of hand-chiseled intaglio, micro-pavé optical setting, and liquid-linked articulation—reinterpreted into modern fine jewellery designed for daily grace.
            </p>
          </div>

          <div className="aspect-card rounded bg-stone-100 overflow-hidden border border-[#E8E2D8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/necklace-chain.jpg"
              alt="Artisan at workbench"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-[#F4EFEB] py-16 border-y border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
              Our Principles
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium">
              The Valchandson Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-[#E8E2D8] rounded text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#A68A5D] border border-[#D8C29D] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-semibold uppercase text-stone-900">
                100% Certified BIS Hallmark
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Every silver piece carries the BIS 925 stamp. Every gold creation features BIS 916 (22K) or 750 (18K) purity with individual HUID tracking numbers.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E2D8] rounded text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#A68A5D] border border-[#D8C29D] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-semibold uppercase text-stone-900">
                Triple Rhodium Shield
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Our 925 sterling silver is sealed with an electrostatic triple-rhodium protective barrier to safeguard against daily oxidation, tarnish, and wear.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8E2D8] rounded text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#A68A5D] border border-[#D8C29D] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-semibold uppercase text-stone-900">
                Conscious Sourcing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                We utilize ethically recycled noble metals and conflict-free gemstones, crafted within safe artisan collectives paying dignified wages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policies section with anchors */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div id="hallmark" className="space-y-3 border-b border-[#E8E2D8] pb-8">
          <h3 className="font-serif-luxury text-2xl font-semibold text-[#1C1917]">
            BIS Hallmark Certification Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Hallmarking is the accurate determination and official recording of the proportionate content of precious metal. In accordance with the Bureau of Indian Standards (BIS) regulations, every piece purchased from Valchandson Jewellers comes with government recognized hallmarking certification clearly displayed on your delivery invoice.
          </p>
        </div>

        <div id="shipping" className="space-y-3 border-b border-[#E8E2D8] pb-8">
          <h3 className="font-serif-luxury text-2xl font-semibold text-[#1C1917]">
            Complimentary Insured Doorstep Delivery
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Orders above ₹5,000 qualify for complimentary courier delivery across 19,000+ Indian PIN codes. Every parcel is 100% insured against loss or damage during transit, securely packaged in tamper-evident electronic seals requiring one-time physical verification upon handover.
          </p>
        </div>

        <div id="returns" className="space-y-3 border-b border-[#E8E2D8] pb-8">
          <h3 className="font-serif-luxury text-2xl font-semibold text-[#1C1917]">
            15-Day Atelier Exchange Policy
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            If you need a different ring size or prefer to exchange your unworn piece, our atelier facilitates a seamless 15-day exchange. Custom-engraved or personalized bespoke commissions are handcrafted uniquely for you and are eligible for complimentary size adjustments.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#1C1917] text-white p-12 sm:p-16 rounded space-y-4">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light">
            Experience Valchandson Craftsmanship
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto mb-6">
            Explore our signature 925 silver and solid gold collections, or arrange a private consultation with our master jewelers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/collections/shop-all"
              className="px-8 py-3.5 bg-[#FAF8F5] text-[#1C1917] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D8C29D]"
            >
              Shop Collections
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 border border-white/60 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black"
            >
              Book Atelier Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
