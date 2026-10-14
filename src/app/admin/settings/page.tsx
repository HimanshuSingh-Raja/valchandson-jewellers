"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  Loader2,
  Store,
  Phone,
  MessageSquare,
  Truck,
  ShieldCheck,
  Megaphone,
  Percent,
  Sparkles,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "Valchandson Jewellers",
    store_tagline: "High Jewellery & Certified Heirlooms",
    store_email: "concierge@valchandson.com",
    store_phone: "+91 98290 12345",
    whatsapp_concierge: "+91 98290 12345",
    whatsapp_message: "Hello Valchandson Atelier, I would like to inquire regarding...",
    announcement_bar_enabled: "true",
    announcement_bar_text:
      "Complimentary Insured Shipping Across India • 100% BIS Hallmarked 925 Silver & Solid Gold",
    tax_rate_percent: "3",
    free_shipping_threshold: "5000",
    standard_shipping_cost: "350",
    low_stock_default_threshold: "3",
    hallmark_guarantee_note:
      "Every piece carries certified national hallmark laser-stamps and an authentic certificate of provenance.",
    exchange_policy_note:
      "Complimentary 15-day bespoke resize or exchange for unworn pieces with security tags intact.",
  });

  // Fetch settings from API
  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Object.keys(data.settings).length > 0) {
            setSettings((prev) => ({ ...prev, ...data.settings }));
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setToastMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage("Store settings saved successfully!");
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setErrorMessage(data.error || "Failed to update store settings.");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#A68A5D] animate-spin" />
        <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">
          Loading store configurations...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl lg:text-3xl text-[#1C1917] tracking-tight">
            Storefront & Atelier Configuration
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage global concierge contact information, top announcement banner, and financial tax parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors disabled:opacity-50 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Configurations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs rounded-r flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs rounded-r flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Brand & Communication */}
        <div className="space-y-6">
          {/* Brand Identity */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#A68A5D]" /> 1. Store Identity & Concierge
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Store Brand Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Atelier Tagline
              </label>
              <input
                type="text"
                value={settings.store_tagline}
                onChange={(e) => handleChange("store_tagline", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Concierge Support Email
                </label>
                <input
                  type="email"
                  value={settings.store_email}
                  onChange={(e) => handleChange("store_email", e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Atelier Phone
                </label>
                <input
                  type="text"
                  value={settings.store_phone}
                  onChange={(e) => handleChange("store_phone", e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Concierge */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#A68A5D]" /> 2. WhatsApp Private Concierge
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="text"
                value={settings.whatsapp_concierge}
                onChange={(e) => handleChange("whatsapp_concierge", e.target.value)}
                placeholder="+91 98290 12345"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Default In-Chat Pre-filled Message
              </label>
              <textarea
                rows={2}
                value={settings.whatsapp_message}
                onChange={(e) => handleChange("whatsapp_message", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>
          </div>

          {/* Top Announcement Bar */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#A68A5D]" /> 3. Storefront Announcement Bar
            </h2>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="announcement_enabled"
                checked={settings.announcement_bar_enabled === "true"}
                onChange={(e) =>
                  handleChange("announcement_bar_enabled", e.target.checked ? "true" : "false")
                }
                className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
              />
              <label
                htmlFor="announcement_enabled"
                className="text-xs font-semibold uppercase tracking-wider text-stone-800 cursor-pointer"
              >
                Display Announcement Bar on Storefront
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Announcement Text Content
              </label>
              <input
                type="text"
                value={settings.announcement_bar_text}
                onChange={(e) => handleChange("announcement_bar_text", e.target.value)}
                placeholder="Complimentary Insured Shipping Across India • 100% BIS Hallmarked Silver"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            {/* Live Banner Preview */}
            <div className="pt-2">
              <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                Storefront Preview
              </span>
              <div className="bg-[#1C1917] text-[#D4C3A3] text-[11px] py-2 px-4 text-center font-serif tracking-wider rounded">
                {settings.announcement_bar_text}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Finance, Shipping & Policies */}
        <div className="space-y-6">
          {/* Commercial & Inventory Defaults */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#A68A5D]" /> 4. Taxes & Inventory Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  National GST Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tax_rate_percent}
                    onChange={(e) => handleChange("tax_rate_percent", e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                  <span className="absolute right-3 top-2 text-stone-500 text-xs font-bold">%</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Mandatory 3% GST on precious metals & bullion.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Default Low-Stock Warning
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.low_stock_default_threshold}
                  onChange={(e) => handleChange("low_stock_default_threshold", e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Trigger alert when stock drops to or below this.
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Configuration */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#A68A5D]" /> 5. Insured Logistics & Delivery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Free Shipping Minimum (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Standard Shipping Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={settings.standard_shipping_cost}
                    onChange={(e) => handleChange("standard_shipping_cost", e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Policies & Guarantees */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A68A5D]" /> 6. Guarantees & Patron Assurance
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                BIS Hallmarking Guarantee Statement
              </label>
              <textarea
                rows={2}
                value={settings.hallmark_guarantee_note}
                onChange={(e) => handleChange("hallmark_guarantee_note", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Exchange & Resize Policy
              </label>
              <textarea
                rows={2}
                value={settings.exchange_policy_note}
                onChange={(e) => handleChange("exchange_policy_note", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
