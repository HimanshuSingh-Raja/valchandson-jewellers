"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Minus,
  History,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
  Check,
} from "lucide-react";

interface Variant {
  id: string;
  name: string;
  size: string | null;
  sku: string;
  stockQuantity: number;
}

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categorySlug: string;
  material: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: string;
  images: Array<{ url: string }>;
  variants: Variant[];
}

interface InventoryHistoryItem {
  id: string;
  productId: string;
  quantityDelta: number;
  newBalance: number;
  reason: string;
  note: string | null;
  adminUserEmail: string;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    sku: string;
    images: Array<{ url: string }>;
  };
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<ProductItem[]>([]);
  const [history, setHistory] = useState<InventoryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "low-stock", "out-of-stock"
  const [activeTab, setActiveTab] = useState<"items" | "history">("items");

  // Modal State for Stock Adjustment
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [adjustmentType, setAdjustmentType] = useState<"ADD" | "SUBTRACT">("ADD");
  const [quantityInput, setQuantityInput] = useState<string>("5");
  const [reason, setReason] = useState<string>("PURCHASE_RESTOCK");
  const [note, setNote] = useState<string>("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const REASON_OPTIONS = [
    { value: "PURCHASE_RESTOCK", label: "New Shipment / Supplier Restock" },
    { value: "RETURN_RESTOCK", label: "Customer Return (Restocked to Inventory)" },
    { value: "DAMAGE_WRITEOFF", label: "Damaged / QC Rejection" },
    { value: "AUDIT_CORRECTION", label: "Physical Stocktake Correction" },
    { value: "THEFT_OR_LOSS", label: "Shrinkage / Loss Discrepancy" },
    { value: "PROMOTIONAL", label: "Marketing / VIP Concierge Gifting" },
  ];

  // Fetch Inventory and History
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/inventory?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  // Metric Computations
  const totalUnits = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
  const lowStockCount = inventory.filter(
    (item) => item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold
  ).length;
  const outOfStockCount = inventory.filter((item) => item.stockQuantity <= 0).length;
  const inStockCount = inventory.filter(
    (item) => item.stockQuantity > item.lowStockThreshold
  ).length;

  // Open modal for a product
  const handleOpenAdjustModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants.length > 0 ? product.variants[0].id : "");
    setAdjustmentType("ADD");
    setQuantityInput("5");
    setReason("PURCHASE_RESTOCK");
    setNote("");
    setModalError(null);
  };

  // Submit Stock Adjustment
  const handlePerformAdjustment = async () => {
    if (!selectedProduct) return;
    setModalError(null);

    const qty = parseInt(quantityInput, 10);
    if (isNaN(qty) || qty <= 0) {
      setModalError("Please enter a valid quantity greater than zero.");
      return;
    }

    const delta = adjustmentType === "ADD" ? qty : -qty;

    // Check if new balance would drop below zero
    if (selectedProduct.stockQuantity + delta < 0) {
      setModalError(
        `Cannot reduce stock below 0. Current balance is ${selectedProduct.stockQuantity} units.`
      );
      return;
    }

    setIsAdjusting(true);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          variantId: selectedVariantId || undefined,
          quantityDelta: delta,
          reason,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage(`Stock updated for ${selectedProduct.title}!`);
        setSelectedProduct(null);
        fetchInventory();
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setModalError(data.error || "Failed to adjust stock.");
      }
    } catch (err) {
      console.error("Adjustment error:", err);
      setModalError("An unexpected network error occurred.");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl lg:text-3xl text-[#1C1917] tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time atelier vault tracking, automated low-stock warnings, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Stock
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs rounded-r flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Total Vault Units
            </span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif-luxury font-bold text-[#1C1917]">
            {totalUnits.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Across all hallmarked pieces</p>
        </div>

        {/* In Stock */}
        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Optimal Stock
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif-luxury font-bold text-emerald-700">
            {inStockCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Sufficient customer supply</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif-luxury font-bold text-amber-700">
            {lowStockCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Below safety threshold</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-serif-luxury font-bold text-rose-700">
            {outOfStockCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Zero units remaining</p>
        </div>
      </div>

      {/* Tabs: Vault Stock vs Movement History */}
      <div className="border-b border-[#E8E2D8] flex items-center gap-6">
        <button
          onClick={() => setActiveTab("items")}
          className={`pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "items"
              ? "border-[#1C1917] text-[#1C1917]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Package className="w-4 h-4" /> Vault Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "history"
              ? "border-[#1C1917] text-[#1C1917]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <History className="w-4 h-4" /> Audit Movement Ledger ({history.length})
        </button>
      </div>

      {activeTab === "items" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-[#E8E2D8] rounded shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery by title, SKU..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-800 focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="all">All Stock Statuses</option>
                <option value="low-stock">Low Stock Alerts Only</option>
                <option value="out-of-stock">Out of Stock Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E8E2D8] rounded overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#A68A5D] animate-spin" />
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  Loading vault stock...
                </p>
              </div>
            ) : inventory.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-700">No stock entries found</h3>
                <p className="text-xs text-stone-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-4">Jewellery Item</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-center">Current Stock</th>
                      <th className="py-3 px-4 text-center">Threshold</th>
                      <th className="py-3 px-4">Health Status</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]">
                    {inventory.map((item) => {
                      const isOut = item.stockQuantity <= 0;
                      const isLow = !isOut && item.stockQuantity <= item.lowStockThreshold;

                      return (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-stone-100 rounded overflow-hidden shrink-0 border border-[#E8E2D8]">
                                {item.images && item.images[0] ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.images[0].url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <Package className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-stone-900 hover:text-[#A68A5D] transition-colors">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  ₹{item.price.toLocaleString("en-IN")} • {item.material}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-stone-600 text-[11px]">
                            {item.sku}
                          </td>

                          <td className="py-3 px-4 text-stone-600 capitalize">
                            {item.categorySlug.replace("-", " ")}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`font-mono text-sm font-bold ${
                                isOut
                                  ? "text-rose-600"
                                  : isLow
                                  ? "text-amber-600"
                                  : "text-stone-900"
                              }`}
                            >
                              {item.stockQuantity}
                            </span>
                            {item.variants && item.variants.length > 0 && (
                              <span className="block text-[10px] text-stone-400">
                                {item.variants.length} sizes
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center font-mono text-stone-500">
                            {item.lowStockThreshold}
                          </td>

                          <td className="py-3 px-4">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                                <XCircle className="w-3 h-3" /> Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
                                <AlertTriangle className="w-3 h-3" /> Low Stock Warning
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenAdjustModal(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#A68A5D]/60 hover:bg-[#A68A5D] hover:text-white text-stone-800 text-[11px] uppercase tracking-wider font-semibold transition-colors rounded shadow-xs"
                            >
                              <RotateCcw className="w-3 h-3" /> Adjust Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movement Audit Ledger View */}
      {activeTab === "history" && (
        <div className="bg-white border border-[#E8E2D8] rounded overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917]">
                Global Inventory Movement Audit Ledger
              </h3>
              <p className="text-[11px] text-stone-500">
                Immutable chronological log of all stock receipts, customer checkouts, returns, and physical audit adjustments.
              </p>
            </div>
            <button
              onClick={fetchInventory}
              className="px-3 py-1 text-xs border border-[#E8E2D8] bg-white hover:bg-stone-50 text-stone-700"
            >
              Refresh Logs
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <History className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">No movement transactions logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Product / SKU</th>
                    <th className="py-3 px-4 text-center">Quantity Delta</th>
                    <th className="py-3 px-4 text-center">Vault Balance</th>
                    <th className="py-3 px-4">Audit Reason</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap font-mono text-[11px]">
                        {new Date(h.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-800">
                          {h.product?.title || "Jewellery piece"}
                        </div>
                        <div className="font-mono text-[10px] text-stone-400">
                          {h.product?.sku || h.productId}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            h.quantityDelta > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {h.quantityDelta > 0 ? `+${h.quantityDelta}` : h.quantityDelta}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-semibold text-stone-800">
                        {h.newBalance}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-medium text-stone-700">
                          {h.reason}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {h.note || "—"}
                      </td>

                      <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                        {h.adminUserEmail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D8] rounded space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <h3 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                  Adjust Vault Stock
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {selectedProduct.title} ({selectedProduct.sku})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Current vs Projected Balance Card */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded flex items-center justify-around text-center">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  Current Stock
                </span>
                <span className="font-mono text-xl font-bold text-stone-800">
                  {selectedProduct.stockQuantity}
                </span>
              </div>

              <div className="text-stone-400 font-serif text-lg">→</div>

              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  New Projected Balance
                </span>
                <span className="font-mono text-xl font-bold text-[#A68A5D]">
                  {adjustmentType === "ADD"
                    ? selectedProduct.stockQuantity + (parseInt(quantityInput, 10) || 0)
                    : Math.max(
                        0,
                        selectedProduct.stockQuantity - (parseInt(quantityInput, 10) || 0)
                      )}
                </span>
              </div>
            </div>

            {/* Adjustment Type Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType("ADD")}
                className={`py-2 text-xs uppercase tracking-wider font-semibold rounded border flex items-center justify-center gap-2 transition-colors ${
                  adjustmentType === "ADD"
                    ? "bg-[#1C1917] text-white border-[#1C1917]"
                    : "bg-white text-stone-600 border-[#E8E2D8] hover:bg-stone-50"
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Increase Stock (+)
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType("SUBTRACT")}
                className={`py-2 text-xs uppercase tracking-wider font-semibold rounded border flex items-center justify-center gap-2 transition-colors ${
                  adjustmentType === "SUBTRACT"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-stone-600 border-[#E8E2D8] hover:bg-stone-50"
                }`}
              >
                <Minus className="w-3.5 h-3.5" /> Decrease Stock (−)
              </button>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Units to {adjustmentType === "ADD" ? "Add" : "Deduct"} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-sm font-mono text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                required
              />
            </div>

            {/* Reason Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Reason for Adjustment <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              >
                {REASON_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Audit Note / Reference (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. PO-8491 restock from Jaipur foundry, or QC defect return"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-[#E8E2D8] text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePerformAdjustment}
                disabled={isAdjusting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] disabled:opacity-50 shadow-sm"
              >
                {isAdjusting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" /> Confirm Adjustment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
