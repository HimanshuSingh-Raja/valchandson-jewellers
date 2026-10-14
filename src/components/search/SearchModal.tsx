"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results: Product[] = trimmed
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.material.toLowerCase().includes(trimmed) ||
          p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
          p.description.toLowerCase().includes(trimmed)
      )
    : [];

  const popularSearches = ["Solitaire Ring", "925 Silver", "Gold Hoops", "Polki", "Tennis Bracelet", "Choker"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start items-center bg-black/60 backdrop-blur-md transition-opacity">
      {/* Search Header Container */}
      <div className="w-full bg-[#FAF8F5] border-b border-[#E8E2D8] shadow-2xl py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A68A5D]" /> Valchandson Predictive Atelier Search
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
              aria-label="Close search modal"
            >
              <span>Esc</span>
              <X className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative mt-4 flex items-center">
            <Search className="w-6 h-6 text-stone-400 absolute left-2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by jewellery piece, metal (Silver, Gold), or gemstone..."
              className="w-full pl-12 pr-10 py-3.5 bg-transparent font-serif-luxury text-xl md:text-2xl text-[#1C1917] placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 p-1 text-stone-400 hover:text-stone-700"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Tags */}
          <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
            <span className="text-stone-500 text-[11px] uppercase tracking-wider">Trending:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 bg-white border border-[#E8E2D8] rounded-full text-stone-700 hover:border-[#A68A5D] hover:text-[#1C1917] transition-colors text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div
        className="w-full flex-1 overflow-y-auto px-4 py-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="max-w-4xl mx-auto bg-white/95 rounded-lg border border-[#E8E2D8] p-6 shadow-2xl backdrop-blur-sm">
          {query.trim() === "" ? (
            <div className="text-center py-8">
              <p className="font-serif-luxury text-xl text-stone-700 mb-2">
                Discover exceptional craftsmanship
              </p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Type an item name, diamond cut, or explore our signature 925 Silver and Solid Gold collections.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif-luxury text-2xl text-stone-800 mb-2">
                No pieces found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                Please try searching for &ldquo;rings&rdquo;, &ldquo;silver&rdquo;, &ldquo;earrings&rdquo;, or &ldquo;gold&rdquo;.
              </p>
              <Link
                href="/collections/shop-all"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-widest hover:bg-[#A68A5D] transition-colors"
              >
                View All Jewellery <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2D8] text-xs text-stone-500 uppercase tracking-wider">
                <span>{results.length} Heirloom {results.length === 1 ? "Piece" : "Pieces"} Found</span>
                <Link
                  href="/collections/shop-all"
                  onClick={onClose}
                  className="text-[#1C1917] hover:text-[#A68A5D] font-medium"
                >
                  View All Collections &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group flex gap-3 p-2 rounded hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E8E2D8]"
                  >
                    <div className="w-16 h-20 bg-stone-100 rounded overflow-hidden shrink-0 border border-[#E8E2D8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400">
                        {product.material}
                      </span>
                      <h4 className="font-serif-luxury text-sm font-semibold text-stone-900 group-hover:text-[#A68A5D] transition-colors line-clamp-1">
                        {product.title}
                      </h4>
                      <span className="text-xs font-medium text-stone-800 mt-1">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
