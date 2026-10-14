"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    total,
    appliedPromo,
    orderNote,
    clearCart,
  } = useCart();
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    email: "patron@valchandson.com",
    phone: "9829012345",
    firstName: "Himanshu",
    lastName: "Sharma",
    address: "42, Civil Lines Heritage Enclave",
    apartment: "Suite 4B",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302006",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "priority">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // If cart is empty and user visits /checkout directly
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-luxury text-3xl text-stone-900 mb-4">
          No Items in Bag for Checkout
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Please add heirloom pieces to your shopping bag before proceeding.
        </p>
        <Link
          href="/collections/shop-all"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#A68A5D]"
        >
          Explore Collections <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculatedShipping =
    shippingMethod === "priority" ? shippingCost + 350 : shippingCost;
  const calculatedTotal = total + (shippingMethod === "priority" ? 350 : 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          shippingMethod,
          paymentMethod,
          appliedPromo,
          orderNote,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCheckoutError(data.error || "Failed to place order. Please review your details.");
        showToast(data.error || "Failed to place order.", "error");
        setIsSubmitting(false);
        return;
      }

      const orderId = data.orderId;
      const orderData = {
        orderId,
        date: new Date().toISOString(),
        items: [...items],
        customer: formData,
        subtotal: data.order?.subtotal || subtotal,
        discountAmount: data.order?.discountAmount || discountAmount,
        shippingCost: data.order?.shippingCost || calculatedShipping,
        taxAmount: data.order?.taxAmount || taxAmount,
        total: data.order?.totalAmount || calculatedTotal,
        appliedPromo,
        orderNote,
        paymentMethod,
      };

      try {
        localStorage.setItem(`vj_order_${orderId}`, JSON.stringify(orderData));
        localStorage.setItem("vj_latest_order_id", orderId);
      } catch {
        // Ignore
      }

      clearCart();
      showToast(`Order ${orderId} placed successfully!`, "success");
      router.push(`/order-success/${orderId}`);
    } catch (err) {
      console.error("Order submission error:", err);
      setCheckoutError("Network error placing order. Please try again.");
      showToast("Network error placing order.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Error alert if validation failed */}
      {checkoutError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs rounded-r flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-red-800">
              Checkout Validation Notice
            </h4>
            <p className="mt-0.5 text-red-700 leading-relaxed">
              {checkoutError}
            </p>
          </div>
        </div>
      )}

      {/* Demo Disclaimer Alert */}
      <div className="p-4 bg-[#FFF8EB] border-l-4 border-[#A68A5D] text-stone-800 text-xs rounded-r flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-[#A68A5D]">
            Demo Storefront Checkout Notice
          </h4>
          <p className="mt-0.5 text-stone-600 leading-relaxed">
            This is an interactive luxury showcase. <strong>No real monetary payment is processed</strong>. Placing an order will generate a realistic, authenticated Valchandson order confirmation receipt with tracking information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Checkout Form (Span 7) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white border border-[#E8E2D8] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif-luxury text-lg font-semibold uppercase tracking-wider text-[#1C1917]">
                1. Contact Information
              </h3>
              <span className="text-[11px] text-stone-400">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  Email Address for Receipt
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  Phone (for OTP & Courier Transit)
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white border border-[#E8E2D8] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif-luxury text-lg font-semibold uppercase tracking-wider text-[#1C1917]">
                2. Insured Delivery Address
              </h3>
              <span className="text-[11px] text-stone-400">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  Street Address & House / Building Name
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E8E2D8] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#A68A5D] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Method */}
          <div className="bg-white border border-[#E8E2D8] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif-luxury text-lg font-semibold uppercase tracking-wider text-[#1C1917]">
                3. Shipping Method
              </h3>
              <span className="text-[11px] text-stone-400">Step 3 of 4</span>
            </div>

            <div className="space-y-3 text-xs">
              <label
                className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                  shippingMethod === "standard"
                    ? "border-[#1C1917] bg-[#FAF8F5]"
                    : "border-[#E8E2D8] bg-white hover:border-stone-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="text-[#1C1917]"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">
                      Standard Insured Courier (BlueDart Secure)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      3 - 5 Business Days • Tamper-evident transit insurance
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-stone-900">
                  {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                  shippingMethod === "priority"
                    ? "border-[#1C1917] bg-[#FAF8F5]"
                    : "border-[#E8E2D8] bg-white hover:border-stone-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "priority"}
                    onChange={() => setShippingMethod("priority")}
                    className="text-[#1C1917]"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">
                      Priority Atelier White-Glove Dispatch
                    </p>
                    <p className="text-[11px] text-stone-500">
                      24-48 Hours Express Dispatch with Priority Hallmarking Verification
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-stone-900">₹350</span>
              </label>
            </div>
          </div>

          {/* Step 4: Demo Payment Selection */}
          <div className="bg-white border border-[#E8E2D8] rounded p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif-luxury text-lg font-semibold uppercase tracking-wider text-[#1C1917]">
                4. Select Payment Method (Demo)
              </h3>
              <span className="text-[11px] text-stone-400">Step 4 of 4</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-3.5 border rounded flex flex-col items-center text-center gap-1.5 transition-colors ${
                  paymentMethod === "upi"
                    ? "border-[#1C1917] bg-[#FAF8F5] text-stone-900 font-semibold"
                    : "border-[#E8E2D8] bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                <QrCode className="w-5 h-5 text-[#A68A5D]" />
                <span>UPI / QR Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3.5 border rounded flex flex-col items-center text-center gap-1.5 transition-colors ${
                  paymentMethod === "card"
                    ? "border-[#1C1917] bg-[#FAF8F5] text-stone-900 font-semibold"
                    : "border-[#E8E2D8] bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#A68A5D]" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`p-3.5 border rounded flex flex-col items-center text-center gap-1.5 transition-colors ${
                  paymentMethod === "netbanking"
                    ? "border-[#1C1917] bg-[#FAF8F5] text-stone-900 font-semibold"
                    : "border-[#E8E2D8] bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                <Building className="w-5 h-5 text-[#A68A5D]" />
                <span>NetBanking / NEFT</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-3.5 border rounded flex flex-col items-center text-center gap-1.5 transition-colors ${
                  paymentMethod === "cod"
                    ? "border-[#1C1917] bg-[#FAF8F5] text-stone-900 font-semibold"
                    : "border-[#E8E2D8] bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                <Truck className="w-5 h-5 text-[#A68A5D]" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8] text-[11px] text-stone-600">
              {paymentMethod === "upi" && (
                <p>Simulating UPI Authorization via GPay / PhonePe / Paytm in Demo Mode.</p>
              )}
              {paymentMethod === "card" && (
                <p>Simulating 3D-Secure 256-bit Visa / MasterCard / RuPay checkout authorization.</p>
              )}
              {paymentMethod === "netbanking" && (
                <p>Simulating HDFC, ICICI, SBI direct atelier wire confirmation.</p>
              )}
              {paymentMethod === "cod" && (
                <p>Cash on Delivery available up to ₹50,000 with phone verification.</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1C1917] text-white text-xs uppercase tracking-[0.24em] font-semibold hover:bg-[#A68A5D] transition-colors rounded shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Valchandson Heirloom Receipt...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Demo Order • ₹{calculatedTotal.toLocaleString("en-IN")}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right: Order Summary Sidebar (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D8] rounded p-6 space-y-6 shadow-sm sticky top-28">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
            <h3 className="font-serif-luxury text-xl uppercase tracking-wider text-[#1C1917] font-semibold">
              Items in Order ({itemCount})
            </h3>
            <Link href="/cart" className="text-xs text-[#A68A5D] hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Item List */}
          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.cartItemId} className="py-3 flex gap-3 text-xs first:pt-0">
                <div className="w-14 h-16 bg-stone-100 rounded overflow-hidden shrink-0 border border-[#E8E2D8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-medium text-stone-900 leading-snug">
                      {item.product.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {item.selectedMaterial} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold text-stone-900">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-stone-600 pt-4 border-t border-[#E8E2D8]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#2E6F40]">
                <span>Promotional Voucher Privilege</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Transit Insurance & Shipping</span>
              <span>
                {calculatedShipping === 0 ? "Complimentary" : `₹${calculatedShipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>BIS Hallmarking Regulatory GST (3%)</span>
              <span>₹{taxAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8] text-[#1C1917]">
              <span className="font-serif-luxury text-lg font-semibold">Total Payable</span>
              <span className="font-serif-luxury text-2xl font-bold">
                ₹{calculatedTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Security stamp */}
          <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8] text-[11px] text-stone-500 space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-[#A68A5D]" /> 100% Hallmarking & Delivery Assurance
            </p>
            <p>
              Every parcel is recorded on high-definition packing cameras and transported under sealed electronic tamper envelopes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
