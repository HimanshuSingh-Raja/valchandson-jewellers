"use client";

import React, { useState } from "react";
import { X, Ruler, HelpCircle } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: "rings" | "bracelets" | "necklaces";
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category = "rings",
}) => {
  const [activeTab, setActiveTab] = useState<"rings" | "bracelets">("rings");

  if (!isOpen) return null;

  const ringSizes = [
    { us: "US 5", indian: "Size 9 - 10", dia: "15.7 mm", circum: "49.3 mm" },
    { us: "US 6", indian: "Size 11 - 12", dia: "16.5 mm", circum: "51.8 mm" },
    { us: "US 7", indian: "Size 13 - 14", dia: "17.3 mm", circum: "54.4 mm" },
    { us: "US 8", indian: "Size 15 - 16", dia: "18.1 mm", circum: "56.9 mm" },
    { us: "US 9", indian: "Size 17 - 18", dia: "19.0 mm", circum: "59.5 mm" },
    { us: "US 10", indian: "Size 19 - 20", dia: "19.8 mm", circum: "62.1 mm" },
  ];

  const bangleSizes = [
    { size: "2-4 (Small)", dia: "57.2 mm (2.25 inches)", wrist: "Up to 6.2 inches" },
    { size: "2-6 (Standard)", dia: "60.3 mm (2.37 inches)", wrist: "6.3 - 6.7 inches" },
    { size: "2-8 (Large)", dia: "63.5 mm (2.50 inches)", wrist: "6.8 - 7.2 inches" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-2xl rounded p-6 sm:p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Close size guide modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold flex items-center justify-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" /> Valchandson Atelier Fitting
          </span>
          <h3 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#1C1917] mt-1 font-semibold">
            Heirloom Size Guide
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E2D8] mb-6">
          <button
            onClick={() => setActiveTab("rings")}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "rings"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Ring Sizing Chart
          </button>
          <button
            onClick={() => setActiveTab("bracelets")}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "bracelets"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Bangle & Bracelet Sizing
          </button>
        </div>

        {/* Content */}
        {activeTab === "rings" ? (
          <div>
            <div className="overflow-x-auto border border-[#E8E2D8] rounded bg-white mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4EFEB] text-stone-700 font-semibold border-b border-[#E8E2D8]">
                  <tr>
                    <th className="p-3">US Size</th>
                    <th className="p-3">Indian Size</th>
                    <th className="p-3">Inside Diameter</th>
                    <th className="p-3">Finger Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] text-stone-700 font-mono text-[11px]">
                  {ringSizes.map((row) => (
                    <tr key={row.us} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-[#1C1917]">{row.us}</td>
                      <td className="p-3">{row.indian}</td>
                      <td className="p-3">{row.dia}</td>
                      <td className="p-3">{row.circum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#F4EFEB] p-4 rounded border border-[#E8E2D8] text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#A68A5D]" /> How to measure at home:
              </p>
              <p>
                1. Wrap a strip of non-stretching paper snugly around the base of your intended finger.
              </p>
              <p>
                2. Mark the exact spot where the paper overlaps and measure the millimeters with a ruler.
              </p>
              <p>
                3. If in between two sizes, we recommend ordering the larger size for maximum comfort.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto border border-[#E8E2D8] rounded bg-white mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4EFEB] text-stone-700 font-semibold border-b border-[#E8E2D8]">
                  <tr>
                    <th className="p-3">Traditional Indian Size</th>
                    <th className="p-3">Inner Diameter</th>
                    <th className="p-3">Recommended Wrist Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8] text-stone-700 font-mono text-[11px]">
                  {bangleSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-[#1C1917]">{row.size}</td>
                      <td className="p-3">{row.dia}</td>
                      <td className="p-3">{row.wrist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#F4EFEB] p-4 rounded border border-[#E8E2D8] text-xs text-stone-600">
              <p className="font-semibold text-stone-900 mb-1">Bespoke Atelier Sizing Assistance</p>
              <p>
                Need a custom size? Our Jaipur craftsmen craft bespoke lengths upon request. Contact our WhatsApp concierge for tailored assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
