"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Package, Sparkles, Award } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"signin" | "privileges">("signin");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoggedIn(true);
    showToast(`Welcome back to Valchandson Atelier Privileges`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E8E2D8] shadow-2xl rounded p-6 sm:p-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Close account modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold">
            Valchandson Atelier
          </span>
          <h3 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#1C1917] mt-1 font-semibold">
            Client Privileges & Account
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E2D8] mb-6">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "signin"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            {isLoggedIn ? "My Profile" : "Sign In / Register"}
          </button>
          <button
            onClick={() => setActiveTab("privileges")}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "privileges"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Atelier Guarantee
          </button>
        </div>

        {/* Content */}
        {activeTab === "signin" ? (
          <div>
            {!isLoggedIn ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed text-center mb-4">
                  Sign in with your email or mobile to track orders, access hallmarking certificates, and enjoy bespoke concierge appointments.
                </p>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Email Address or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. heirloom@valchandson.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A68A5D] transition-colors rounded"
                >
                  Request OTP / Continue
                </button>
                <p className="text-[10px] text-stone-500 text-center mt-3">
                  (Demo Mode: Any test email will sign you straight in)
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#F4EFEB] p-4 rounded border border-[#E8E2D8] text-center">
                  <span className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center mx-auto text-sm font-semibold mb-2">
                    VJ
                  </span>
                  <p className="text-sm font-semibold text-stone-900">{email || "Valued Heirloom Collector"}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#A68A5D] text-white text-[10px] uppercase tracking-widest font-semibold rounded-full">
                    Atelier Gold Member
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#E8E2D8] rounded">
                    <span className="flex items-center gap-2 text-stone-700">
                      <Package className="w-4 h-4 text-[#A68A5D]" /> Active Orders (Demo)
                    </span>
                    <span className="font-semibold text-stone-900">0 in transit</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-[#E8E2D8] rounded">
                    <span className="flex items-center gap-2 text-stone-700">
                      <Award className="w-4 h-4 text-[#A68A5D]" /> Hallmarking Vault
                    </span>
                    <span className="font-semibold text-[#A68A5D]">BIS 916 / 925 Verified</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setEmail("");
                    showToast("Signed out successfully", "info");
                  }}
                  className="w-full py-2 text-xs text-stone-500 hover:text-red-600 underline text-center"
                >
                  Sign Out of Atelier
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-stone-600">
            <div className="flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-stone-900">100% Certified BIS Hallmarking</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Every silver creation bears the official BIS 925 stamp; gold pieces carry BIS 916 (22K) or 750 (18K) unique HUID tracking.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-stone-900">Complimentary Lifetime Cleaning</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Bring your Valchandson heirloom to any showroom for complimentary ultrasonic refurbishment and prong inspection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
