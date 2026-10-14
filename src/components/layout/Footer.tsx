"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Mail,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setIsSubscribed(true);
    showToast("Welcome to Valchandson Atelier. Use code VALCHAND10 for 10% off your order.", "success");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-10 border-t border-[#2D2A26]">
      {/* Brand Value Guarantees Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#2D2A26]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#D8C29D] shrink-0" />
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold tracking-wide text-white uppercase">
                100% Certified BIS Hallmark
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Govt. hallmarked 925 sterling silver & 916 gold purity stamp.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <Truck className="w-6 h-6 text-[#D8C29D] shrink-0" />
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold tracking-wide text-white uppercase">
                Insured Doorstep Delivery
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Tamper-evident transit insurance on every precious shipment.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <RotateCcw className="w-6 h-6 text-[#D8C29D] shrink-0" />
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold tracking-wide text-white uppercase">
                15-Day Atelier Exchange
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Hassle-free sizing exchanges & complimentary polishing.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <Award className="w-6 h-6 text-[#D8C29D] shrink-0" />
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold tracking-wide text-white uppercase">
                Legacy Craftsmanship
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Over 50 years of master goldsmithing heritage since 1974.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Column 1: Brand & Newsletter (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.14em] uppercase text-white font-semibold">
                Valchandson
              </span>
              <span className="block text-[9px] tracking-[0.38em] uppercase text-[#D8C29D] font-light mt-0.5">
                Jewellers • Est. 1974
              </span>
            </Link>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Crafting conscious fine jewellery with generational precision. Inspired by architectural symmetry, imperial Indian motifs, and modern minimalism.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Join the Valchandson Gazette
              </p>
              <p className="text-[11px] text-stone-400 mb-3">
                Receive private invitations to preview new capsule collections & enjoy 10% off your first heirloom order.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3 py-2.5 bg-[#262320] border border-[#3A3530] text-xs text-white placeholder:text-stone-500 rounded focus:outline-none focus:border-[#D8C29D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D8C29D] text-[#1C1917] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors rounded shrink-0 flex items-center gap-1"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {isSubscribed && (
                <p className="text-[11px] text-[#D8C29D] mt-2">
                  Thank you for subscribing! Your private code is <strong className="font-mono">VALCHAND10</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif-luxury text-sm font-semibold tracking-[0.18em] uppercase text-[#D8C29D] mb-4">
              Curated Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/collections/silver-collection" className="hover:text-white transition-colors">
                  925 Sterling Silver Edition
                </Link>
              </li>
              <li>
                <Link href="/collections/gold" className="hover:text-white transition-colors">
                  18K & 22K Solid Gold
                </Link>
              </li>
              <li>
                <Link href="/collections/rings" className="hover:text-white transition-colors">
                  Solitaire & Pavé Rings
                </Link>
              </li>
              <li>
                <Link href="/collections/necklaces" className="hover:text-white transition-colors">
                  Articulated Chokers & Necklaces
                </Link>
              </li>
              <li>
                <Link href="/collections/earrings" className="hover:text-white transition-colors">
                  Architectural Drops & Hoops
                </Link>
              </li>
              <li>
                <Link href="/collections/bracelets" className="hover:text-white transition-colors">
                  Sculpted Cuffs & Tennis Chains
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-white transition-colors">
                  Festive 2026 Unveilings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div>
            <h4 className="font-serif-luxury text-sm font-semibold tracking-[0.18em] uppercase text-[#D8C29D] mb-4">
              Client Care & Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  The Valchandson Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Bespoke Bridal Consultations
                </Link>
              </li>
              <li>
                <Link href="/about#hallmark" className="hover:text-white transition-colors">
                  BIS Hallmark & Purity Assurance
                </Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-white transition-colors">
                  Insured Delivery & Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/about#returns" className="hover:text-white transition-colors">
                  Exchange & Return Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Jewellery Care & Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom & Contact */}
          <div>
            <h4 className="font-serif-luxury text-sm font-semibold tracking-[0.18em] uppercase text-[#D8C29D] mb-4">
              Boutique Concierge
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D8C29D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white block font-medium">Boutique Atelier:</strong>
                  Guru Vidya Building 07, Hill Rd, Santosh Nagar, Bandra West, Mumbai, Maharashtra 400050
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D8C29D] shrink-0 mt-0.5" />
                <p>Mon - Sat: 10:30 AM – 8:00 PM IST<br />Sunday: By Private Appointment</p>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D8C29D] shrink-0 mt-0.5" />
                <a
                  href="tel:09833522819"
                  className="hover:text-white transition-colors"
                >
                  098335 22819
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D8C29D] shrink-0 mt-0.5" />
                <a
                  href="mailto:akashzewar@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  akashzewar@gmail.com
                </a>
              </div>

              {/* Social icons */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/valchandson_jewellers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#262320] flex items-center justify-center text-stone-400 hover:text-white hover:bg-[#A68A5D] transition-colors"
                  aria-label="Valchandson Jewellers Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/ValchandsonJewellers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#262320] flex items-center justify-center text-stone-400 hover:text-white hover:bg-[#A68A5D] transition-colors"
                  aria-label="Valchandson Jewellers Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[#2D2A26] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            © {new Date().getFullYear()} Valchandson Jewellers Private Limited. All Rights Reserved. Demo Showcase.
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>BIS Registration: HM/C-7590123 (Demo)</span>
            <span>•</span>
            <Link href="/about#privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link href="/about#terms" className="hover:text-white">Terms of Heritage Service</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#D8C29D] font-medium">Atelier Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
