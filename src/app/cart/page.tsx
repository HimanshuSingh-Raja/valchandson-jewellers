"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
  const {
    items,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    total,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
    freeShippingThreshold,
    orderNote,
    setOrderNote,
  } = useCart();

  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromo(promoInput);
    if (success) {
      showToast(`Voucher ${promoInput.toUpperCase()} applied!`, "success");
      setPromoInput("");
    } else {
      showToast("Invalid promotion code", "error");
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F4EFEB] flex items-center justify-center mx-auto mb-6 text-[#A68A5D]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl uppercase tracking-wider text-[#1C1917] mb-3 font-medium">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Discover our hallmarked 925 sterling silver and 18K/22K gold creations, each piece certified and handcrafted in Jaipur.
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
      {/* Page Title */}
      <div className="border-b border-[#E8E2D8] pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Order Review
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium mt-0.5">
            Shopping Bag ({itemCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-red-600 underline font-light"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-[#F4EFEB] p-4 rounded border border-[#E8E2D8]">
        <div className="flex items-center justify-between text-xs mb-2">
          {amountNeeded > 0 ? (
            <span className="text-stone-800">
              Add <strong className="font-semibold text-[#1C1917]">₹{amountNeeded.toLocaleString("en-IN")}</strong> more to qualify for Complimentary Insured Express Shipping
            </span>
          ) : (
            <span className="text-[#2E6F40] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> You&apos;ve unlocked Complimentary Insured Express Delivery!
            </span>
          )}
          <span className="text-[11px] font-mono text-stone-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#E8E2D8] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#A68A5D] h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Items Table (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E2D8] rounded divide-y divide-[#E8E2D8]">
          {items.map((item) => (
            <div key={item.cartItemId} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
              {/* Thumbnail */}
              <Link
                href={`/product/${item.product.slug}`}
                className="w-24 sm:w-28 aspect-card bg-stone-100 rounded overflow-hidden shrink-0 border border-[#E8E2D8]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A68A5D] font-semibold">
                        {item.product.category}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block font-serif-luxury text-lg sm:text-xl text-[#1C1917] hover:text-[#A68A5D] font-medium leading-snug transition-colors"
                      >
                        {item.product.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-500 mt-1.5 space-y-0.5">
                    <p>Metal: <strong className="text-stone-800">{item.selectedMaterial}</strong></p>
                    {item.selectedSize && (
                      <p>Size: <strong className="text-stone-800">{item.selectedSize}</strong></p>
                    )}
                    <p className="text-[11px] text-stone-400 font-mono">
                      Hallmark: {item.product.specifications.hallmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E8E2D8] bg-white rounded">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 px-3 text-stone-600 hover:text-black transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-semibold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 px-3 text-stone-600 hover:text-black transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="font-serif-luxury text-lg sm:text-xl font-semibold text-[#1C1917]">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-stone-400">
                        ₹{item.product.price.toLocaleString("en-IN")} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Complimentary packaging note */}
          <div className="p-4 sm:p-6 bg-[#FAF8F5]">
            <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1.5">
              Complimentary Heirloom Gift Packaging Note
            </label>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Provide a personal message to be handwritten on gold-foiled Valchandson parchment paper..."
              rows={2}
              className="w-full p-3 text-xs bg-white border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
            />
          </div>
        </div>

        {/* Order Summary Sidebar (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D8] rounded p-6 space-y-6 shadow-sm sticky top-28">
          <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#1C1917] font-semibold pb-3 border-b border-[#E8E2D8]">
            Order Summary
          </h3>

          {/* Voucher input */}
          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium">
              Promotional Voucher
            </label>
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-[#F4EFEB] p-3 rounded border border-[#D8C29D] text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#A68A5D]" />
                  <span className="font-semibold text-stone-900 tracking-wider">
                    {appliedPromo} (-₹{discountAmount.toLocaleString("en-IN")})
                  </span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-[11px] text-stone-500 hover:text-red-600 underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. VALCHAND10"
                  className="flex-1 px-3 py-2 text-xs border border-[#E8E2D8] bg-[#FAF8F5] rounded uppercase tracking-wider focus:outline-none focus:border-[#A68A5D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#A68A5D] transition-colors rounded"
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-[#E8E2D8]">
            <div className="flex justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-medium text-stone-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#2E6F40]">
                <span>Promotional Voucher Privilege</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Insured Doorstep Shipping</span>
              <span>{shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Hallmark Regulatory GST (3%)</span>
              <span>₹{taxAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-baseline pt-4 border-t border-[#E8E2D8] text-[#1C1917]">
              <span className="font-serif-luxury text-xl font-semibold">Total Amount</span>
              <span className="font-serif-luxury text-2xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full py-4 bg-[#1C1917] text-white text-xs uppercase tracking-[0.24em] font-semibold hover:bg-[#A68A5D] transition-colors flex items-center justify-center gap-2 rounded shadow-md"
          >
            <Lock className="w-3.5 h-3.5" /> Proceed to Secure Checkout
          </Link>

          {/* Reassurance Badges */}
          <div className="pt-2 border-t border-[#E8E2D8] space-y-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A68A5D] shrink-0" />
              <span>100% Certified BIS Hallmark 925 & 916</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A68A5D] shrink-0" />
              <span>256-Bit Encrypted Transit Insurance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
