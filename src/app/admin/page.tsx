"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gem,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  Clock,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Boxes,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

interface DashboardData {
  metrics: {
    totalProducts: number;
    activeProducts: number;
    outOfStockCount: number;
    lowStockCount: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  lowStockProducts: Array<{
    id: string;
    title: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
    price: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    items: Array<{ productTitle: string; quantity: number }>;
  }>;
  recentMovements: Array<{
    id: string;
    quantityDelta: number;
    newBalance: number;
    reason: string;
    note: string | null;
    adminUserEmail: string | null;
    createdAt: string;
    product: { id: string; title: string; sku: string };
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#D8C29D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
          Loading Atelier Metrics from Database...
        </p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalProducts: 0,
    activeProducts: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#A68A5D] font-bold">
            Atelier Executive Overview
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Store Performance & Operations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synchronization across database inventory, products catalog, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-slate-900 hover:bg-[#A68A5D] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4" /> Stock Control
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Total Products
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{metrics.totalProducts}</h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {metrics.activeProducts} Active & Live
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Gem className="w-6 h-6 text-[#A68A5D]" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Low Stock Warnings
            </p>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{metrics.lowStockCount}</h3>
            <span className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <XCircle className="w-3.5 h-3.5" /> {metrics.outOfStockCount} Out of Stock
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Total Patron Orders
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{metrics.totalOrders}</h3>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> {metrics.pendingOrders} In Preparation/QC
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <ShoppingBag className="w-6 h-6 text-[#A68A5D]" />
          </div>
        </div>

        {/* Sales Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Total Order Revenue
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Live Database Receipts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Inventory Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Orders (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Patron Orders</h3>
              <p className="text-xs text-slate-500">Latest customer purchases across India</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#A68A5D] hover:underline font-semibold flex items-center gap-1"
            >
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentOrders || data.recentOrders.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">{order.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.orderStatus.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      {order.customerName} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-[10px] font-mono ${
                        order.paymentStatus === "PAID"
                          ? "text-emerald-600 font-semibold"
                          : "text-amber-600 font-medium"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Inventory Movements (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inventory Audit History</h3>
              <p className="text-xs text-slate-500">Atomic stock movements & adjustments</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-[#A68A5D] hover:underline font-semibold flex items-center gap-1"
            >
              All Movements <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentMovements || data.recentMovements.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">No inventory changes recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {data.recentMovements.map((move) => (
                <div key={move.id} className="py-2.5 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <p className="font-medium text-slate-900 truncate">{move.product.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {move.reason} • {new Date(move.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        move.quantityDelta > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {move.quantityDelta > 0 ? `+${move.quantityDelta}` : move.quantityDelta}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Bal: {move.newBalance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
