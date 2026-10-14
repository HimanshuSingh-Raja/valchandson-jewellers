"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { CartItem } from "@/context/CartContext";

interface StoredOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  appliedPromo?: string;
  paymentMethod: string;
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`vj_order_${orderId}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#F4EFEB] border border-[#D8C29D] text-[#A68A5D] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A68A5D] font-semibold">
          Atelier Order Confirmed • Demo Showcase
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#1C1917] font-medium">
          Thank You For Your Patronage
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your order has been allocated to our Jaipur master workshop. A digital invoice and hallmarking certificate have been generated.
        </p>
        <div className="inline-block mt-2 px-4 py-1.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded font-mono text-xs text-[#1C1917]">
          Order Reference: <strong>{orderId}</strong>
        </div>
      </div>

      {/* Order Status Progress Bar */}
      <div className="bg-white border border-[#E8E2D8] rounded p-6 sm:p-8">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-6">
          Heirloom Preparation Timeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="flex sm:flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#D8C29D]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Order Placed</p>
              <p className="text-[10px] text-stone-500">Verified & Queued</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEB] text-[#A68A5D] border border-[#D8C29D] flex items-center justify-center shrink-0 animate-pulse">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#A68A5D]">Hallmarking QC</p>
              <p className="text-[10px] text-stone-500">BIS 925/916 Laser Check</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center text-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-800">Insured Dispatch</p>
              <p className="text-[10px] text-stone-500">BlueDart Vault Security</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center text-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-800">Estimated Delivery</p>
              <p className="text-[10px] text-stone-500">By {formattedDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      {order && (
        <div className="bg-white border border-[#E8E2D8] rounded divide-y divide-[#E8E2D8]">
          <div className="p-6">
            <h3 className="font-serif-luxury text-xl text-[#1C1917] font-semibold uppercase tracking-wider mb-4">
              Itemized Receipt
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4 text-xs first:pt-0">
                  <div className="w-16 h-20 bg-stone-100 rounded overflow-hidden shrink-0 border border-[#E8E2D8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-base font-medium text-stone-900">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Metal: {item.selectedMaterial} {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {item.product.specifications.hallmark}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-stone-700">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-semibold text-stone-900">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-6 bg-[#FAF8F5] space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#2E6F40]">
                <span>Promotional Voucher ({order.appliedPromo})</span>
                <span>-₹{order.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Doorstep Shipping</span>
              <span>{order.shippingCost === 0 ? "Complimentary" : `₹${order.shippingCost}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Regulatory GST (3% Hallmarked)</span>
              <span>₹{order.taxAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8] text-[#1C1917]">
              <span className="font-serif-luxury text-lg font-semibold">Total Paid (Demo)</span>
              <span className="font-serif-luxury text-2xl font-bold">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-900 uppercase tracking-wider mb-1">
                Insured Destination
              </p>
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.customer.address}</p>
              {order.customer.apartment && <p>{order.customer.apartment}</p>}
              <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="mt-1 text-stone-500">Phone: {order.customer.phone}</p>
            </div>

            <div>
              <p className="font-semibold text-stone-900 uppercase tracking-wider mb-1">
                Dispatch Protocol
              </p>
              <p>Insured Courier Partner: BlueDart Platinum Vault</p>
              <p>Payment Mode: Demo Authorization ({order.paymentMethod.toUpperCase()})</p>
              <p>Estimated Arrival: {formattedDelivery}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 border border-[#E8E2D8] bg-white text-stone-800 text-xs uppercase tracking-widest font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 rounded"
        >
          <Printer className="w-4 h-4" /> Print / Save Order Receipt
        </button>
        <Link
          href="/collections/shop-all"
          className="w-full sm:w-auto px-8 py-3 bg-[#1C1917] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#A68A5D] transition-colors flex items-center justify-center gap-2 rounded"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
