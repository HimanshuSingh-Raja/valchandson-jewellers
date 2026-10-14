"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  PlusCircle,
  Boxes,
  FolderTree,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Sparkles,
} from "lucide-react";
import { ToastProvider, useToast } from "@/context/ToastContext";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render plain content
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/admin/auth/me")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Unauthenticated");
        })
        .then((data) => setAdminUser(data.user))
        .catch(() => {
          // Handled by middleware redirection
        });
    }
  }, [isLoginPage]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("Logged out of Admin Portal", "info");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Gem },
    { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
    { label: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif-luxury text-lg tracking-wider uppercase font-semibold text-[#D8C29D]">
            Valchandson
          </span>
          <span className="text-[9px] uppercase tracking-widest bg-[#1E293B] text-slate-400 px-1.5 py-0.5 rounded font-mono">
            Admin
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D8C29D]" />
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen shrink-0 border-r border-slate-800 overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="block">
              <span className="font-serif-luxury text-xl tracking-[0.14em] uppercase text-white font-semibold">
                Valchandson
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#D8C29D] font-light mt-0.5">
                Atelier Control Center
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Store Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? "bg-[#1E293B] text-[#D8C29D] font-semibold shadow-sm border-l-2 border-[#D8C29D]"
                      : "text-slate-300 hover:bg-[#1E293B]/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & User Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-[#0B1120]">
          {/* Live Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D8C29D]" /> View Live Storefront
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Profile Card */}
          <div className="px-3 py-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {adminUser?.name || "Atelier Master"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{adminUser?.email || "admin"}</p>
            </div>
            <span className="text-[9px] uppercase tracking-wider bg-[#A68A5D]/20 text-[#D8C29D] px-1.5 py-0.5 rounded font-mono font-semibold">
              {adminUser?.role || "ADMIN"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors border border-red-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
              {navItems.find((n) => n.href === pathname)?.label || "Valchandson Control Center"}
            </h1>
            <p className="text-[11px] text-slate-400">
              Connected to Production Database • Single Source of Truth
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[11px]">Database Synchronized</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs uppercase tracking-wider font-medium hover:bg-[#A68A5D] transition-colors flex items-center gap-1.5"
            >
              <span>Preview Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ToastProvider>
  );
}
