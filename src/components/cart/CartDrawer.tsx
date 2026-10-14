"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    itemCount,
    updateQuantity,
    removeItem,
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
  const [showNoteField, setShowNoteField] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromo(promoInput);
    if (ok) {
      showToast(`Voucher ${promoInput.toUpperCase()} applied!`, "success");
      setPromoInput("");
    } else {
      showToast("Invalid promotion code", "error");
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over drawer container */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out z-50 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
            <h2 className="font-serif-luxury text-xl tracking-wider uppercase font-semibold text-[#1C1917]">
              Shopping Bag
            </h2>
            <span className="text-xs text-stone-500 font-medium">({itemCount})</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#F4EFEB] px-5 py-3 border-b border-[#E8E2D8]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {amountNeeded > 0 ? (
              <span className="text-stone-700">
                Add <strong className="text-[#1C1917]">₹{amountNeeded.toLocaleString("en-IN")}</strong> for Complimentary Insured Express Shipping
              </span>
            ) : (
              <span className="text-[#2E6F40] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> You&apos;ve unlocked Free Insured Express Delivery!
              </span>
            )}
            <span className="text-[11px] font-mono text-stone-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A68A5D] h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8E2D8]/70">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F4EFEB] flex items-center justify-center mb-4 text-[#A68A5D]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#1C1917] mb-2 font-medium">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mb-6 leading-relaxed">
                Explore our hallmarked 925 silver and solid gold creations handcrafted for lifetime memories.
              </p>
              <Link
                href="/collections/shop-all"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#A68A5D] transition-colors"
              >
                Discover Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="py-4 flex gap-4 first:pt-0">
                {/* Product thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-20 h-24 bg-stone-100 shrink-0 overflow-hidden rounded relative border border-[#E8E2D8]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="font-serif-luxury text-base text-[#1C1917] hover:text-[#A68A5D] transition-colors font-medium leading-tight"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-1 space-y-0.5">
                      <p>Metal: <span className="text-stone-800 font-medium">{item.selectedMaterial}</span></p>
                      {item.selectedSize && (
                        <p>Size: <span className="text-stone-800 font-medium">{item.selectedSize}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8E2D8] bg-white rounded">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 px-2 text-stone-600 hover:text-black hover:bg-stone-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium text-[#1C1917]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 px-2 text-stone-600 hover:text-black hover:bg-stone-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-xs font-medium tracking-wide text-[#1C1917]">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout actions when items exist */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D8] bg-white space-y-3.5">
            {/* Promo Code input */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-[#F4EFEB] px-3 py-2 rounded text-xs border border-[#D8C29D]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#A68A5D]" />
                    <span className="font-semibold text-stone-900 tracking-wider">
                      {appliedPromo} (-₹{discountAmount.toLocaleString("en-IN")})
                    </span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-[11px] text-stone-500 hover:text-red-600 underline"
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
                    placeholder="Enter voucher code (e.g. VALCHAND10)"
                    className="flex-1 px-3 py-2 text-xs border border-[#E8E2D8] bg-[#FAF8F5] rounded uppercase tracking-wider focus:outline-none focus:border-[#A68A5D]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-[#A68A5D] transition-colors rounded"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}
            </div>

            {/* Gift packaging toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowNoteField(!showNoteField)}
                className="text-[11px] text-stone-600 hover:text-black underline underline-offset-2 flex items-center gap-1"
              >
                {showNoteField ? "- Hide complimentary gift message" : "+ Add complimentary luxury gift packaging note"}
              </button>
              {showNoteField && (
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Enter your personal gift note to be handwritten on Valchandson parchment..."
                  rows={2}
                  className="w-full mt-2 p-2 text-xs border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-[#E8E2D8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2E6F40]">
                  <span>Voucher Privilege</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Doorstep Shipping</span>
                <span>{shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (3% Hallmarked)</span>
                <span>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1C1917] pt-2 border-t border-[#E8E2D8]">
                <span className="font-serif-luxury tracking-wide">Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3.5 bg-[#1C1917] text-white text-center text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A68A5D] transition-colors flex items-center justify-center gap-2 rounded"
              >
                Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2.5 bg-transparent border border-[#E8E2D8] text-stone-800 text-center text-[11px] uppercase tracking-widest font-medium hover:bg-stone-50 transition-colors block rounded"
              >
                View Full Bag & Summary
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
