"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Authentication failed. Please verify credentials.");
        return;
      }

      showToast(`Welcome back, ${data.user.name}`, "success");
      router.push(from);
      router.refresh();
    } catch {
      setErrorMsg("Network error connecting to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@valchandson.com");
    setPassword("Valchandson@2026");
  };

  return (
    <div className="w-full max-w-md bg-[#1E293B] border border-slate-700/80 rounded-xl shadow-2xl p-8 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#D8C29D]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-[#D8C29D] mb-3 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif-luxury text-2xl tracking-[0.14em] uppercase text-white font-semibold">
          Valchandson
        </h1>
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#D8C29D] mt-0.5">
          Atelier Management Console
        </p>
        <p className="text-xs text-slate-400 mt-2 font-light">
          Authenticate to access product inventory, customer dispatch, and financial analytics.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@valchandson.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-[#D8C29D] focus:ring-1 focus:ring-[#D8C29D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-[#D8C29D] focus:ring-1 focus:ring-[#D8C29D]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 bg-[#D8C29D] text-[#0F172A] font-semibold uppercase tracking-[0.2em] rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isLoading ? "Verifying Credentials..." : "Authenticate Access"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Fast-fill helper */}
      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <p className="text-[11px] text-slate-400 mb-2">
          Initial Seed Admin Credentials Available
        </p>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#D8C29D] text-[11px] rounded border border-slate-700 transition-colors inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Fill Master Credentials (admin@valchandson.com)
        </button>
      </div>

      {/* Back to store */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; Return to Customer Storefront
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-4 selection:bg-[#D8C29D] selection:text-black">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 p-8 rounded-xl text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D8C29D] mb-2" />
            <p className="text-xs uppercase tracking-wider">Loading Security Console...</p>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
