"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchModal } from "@/components/search/SearchModal";
import { AccountModal } from "@/components/ui/AccountModal";
import { CATEGORIES } from "@/data/products";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShopEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShopMenuOpen(true);
  };

  const handleShopLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopMenuOpen(false);
    }, 150);
  };

  const handleOtherEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShopMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShopMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/collections/shop-all", hasMega: true },
    { label: "Silver Collection", href: "/collections/silver-collection", isHighlight: true },
    { label: "Gold", href: "/collections/gold" },
    { label: "Rings", href: "/collections/rings" },
    { label: "Earrings", href: "/collections/earrings" },
    { label: "Necklaces", href: "/collections/necklaces" },
    { label: "Bracelets", href: "/collections/bracelets" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-[#FAF8F5]/95 backdrop-blur-md border-b ${
          isScrolled ? "shadow-sm border-[#E8E2D8] py-2.5" : "border-[#E8E2D8]/70 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between">
            {/* Left: Mobile Hamburger & Search Trigger */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 lg:flex-none">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#1C1917] hover:text-[#A68A5D] transition-colors focus:outline-none"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-stone-700 hover:text-[#1C1917] p-2 text-xs uppercase tracking-wider transition-colors"
                aria-label="Search jewelry collections"
              >
                <Search className="w-4 h-4 text-stone-600" />
                <span className="hidden md:inline font-medium text-[11px] tracking-widest">Search</span>
              </button>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="group inline-flex flex-col items-center">
                <span className="font-serif-luxury text-2xl sm:text-3xl md:text-3xl lg:text-4xl tracking-[0.14em] uppercase text-[#1C1917] font-semibold transition-colors group-hover:text-[#A68A5D]">
                  Valchandson
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.38em] uppercase text-stone-500 font-light mt-0.5">
                  Jewellers • Est. 1974
                </span>
              </Link>
            </div>

            {/* Right: Wishlist, Account, Cart */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1 lg:flex-none">
              {/* Account icon */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-2 text-stone-700 hover:text-[#1C1917] transition-colors relative"
                aria-label="Customer Account Profile"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist icon */}
              <Link
                href="/wishlist"
                className="p-2 text-stone-700 hover:text-[#1C1917] transition-colors relative"
                aria-label="Saved Wishlist Items"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#A68A5D] text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-fade-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Bag trigger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 text-stone-700 hover:text-[#1C1917] transition-colors relative flex items-center gap-1.5"
                aria-label={`Shopping bag containing ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1917]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C1917] text-[#FAF8F5] border border-[#D8C29D] text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-[11px] uppercase tracking-widest font-medium text-stone-800">
                  Bag ({itemCount})
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-7 pt-4 pb-1 border-t border-[#E8E2D8]/50 mt-3 text-[12px] uppercase tracking-[0.18em] font-medium text-stone-700 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.href}
                  className="py-1"
                  onMouseEnter={() => link.hasMega ? handleShopEnter() : handleOtherEnter()}
                  onMouseLeave={() => link.hasMega && handleShopLeave()}
                >
                  <Link
                    href={link.href}
                    className={`transition-colors flex items-center gap-1 py-1 ${
                      isActive
                        ? "text-[#1C1917] font-semibold underline underline-offset-8 decoration-[#A68A5D]"
                        : link.isHighlight
                        ? "text-[#A68A5D] font-semibold hover:text-[#1C1917]"
                        : "hover:text-[#1C1917]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasMega && (
                      <ChevronDown
                        className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
                          shopMenuOpen ? "rotate-180 text-[#A68A5D]" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}

            {/* Centered Luxury Mega Menu Dropdown */}
            {shopMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[840px] max-w-[calc(100vw-3rem)] z-50 animate-fade-in"
                onMouseEnter={handleShopEnter}
                onMouseLeave={handleShopLeave}
              >
                <div className="bg-[#FAF8F5] shadow-2xl border border-[#E8E2D8] p-6 rounded-lg">
                  <div className="grid grid-cols-4 gap-6">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/${cat.slug}`}
                        onClick={() => setShopMenuOpen(false)}
                        className="group/cat flex flex-col items-center text-center"
                      >
                        <div className="aspect-card w-full overflow-hidden bg-stone-100 rounded mb-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover/cat:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[12px] font-semibold tracking-wider text-stone-900 group-hover/cat:text-[#A68A5D] transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-normal mt-0.5">
                          {cat.count} Pieces
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs normal-case tracking-normal text-stone-600">
                    <span className="font-serif italic text-stone-800">
                      &ldquo;Every creation certified with BIS Hallmark purity&rdquo;
                    </span>
                    <Link
                      href="/collections/shop-all"
                      onClick={() => setShopMenuOpen(false)}
                      className="font-medium text-[#1C1917] hover:text-[#A68A5D] flex items-center gap-1 uppercase tracking-wider text-[11px]"
                    >
                      Explore All Collections <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-over panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-full max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col justify-between transition-transform duration-300 z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif-luxury text-xl tracking-widest uppercase text-[#1C1917] font-semibold"
            >
              Valchandson
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-stone-600 hover:text-stone-900"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar in Mobile Drawer */}
          <div className="p-4 border-b border-[#E8E2D8]/60 bg-[#F4EFEB]/50">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-white border border-[#E8E2D8] rounded text-stone-500 text-xs tracking-wider uppercase text-left"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span>Search heirloom pieces...</span>
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold mb-2">
              Collections & Curations
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 text-sm uppercase tracking-widest transition-colors border-b border-[#E8E2D8]/40 ${
                  pathname === link.href
                    ? "font-bold text-[#1C1917] pl-1 border-l-2 border-[#A68A5D]"
                    : link.isHighlight
                    ? "text-[#A68A5D] font-semibold"
                    : "text-stone-800 hover:text-[#1C1917]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold mb-2">
                Atelier Client Services
              </p>
              <div className="space-y-2 text-xs text-stone-600">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-1.5 hover:text-black"
                >
                  <Heart className="w-4 h-4 text-[#A68A5D]" /> Saved Heirloom Wishlist ({wishlistCount})
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="flex items-center gap-2 py-1.5 hover:text-black w-full text-left"
                >
                  <User className="w-4 h-4 text-[#A68A5D]" /> Customer Account & Orders
                </button>
                <div className="flex items-center gap-2 py-1.5 text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-[#A68A5D]" /> 100% BIS Hallmarked Purity Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-[#E8E2D8] bg-[#F4EFEB]/70">
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <PhoneCall className="w-4 h-4 text-[#A68A5D]" />
              <div>
                <p className="font-semibold text-stone-800">Flagship Atelier Concierge</p>
                <p className="text-[11px] text-stone-500">+91 (0) 141 256 8900 • 10am - 8pm IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
};
