"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ProductItem {
  id: string;
  slug: string;
  sku: string;
  title: string;
  subtitle: string | null;
  categorySlug: string;
  collection: string;
  material: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  images: Array<{ id: string; url: string; isHoverImage: boolean }>;
  variants: Array<{ id: string; name: string; stockQuantity: number }>;
  createdAt: string;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt-desc");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (stockFilter !== "all") params.set("stock", stockFilter);
    if (sortBy) params.set("sortBy", sortBy);

    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load products error:", err);
        setLoading(false);
      });
  }, [search, categoryFilter, statusFilter, stockFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  // Toggle Publish Status
  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/publish`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        loadProducts();
      } else {
        showToast(data.error || "Failed to update publish status", "error");
      }
    } catch {
      showToast("Network error updating product status", "error");
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Product deleted successfully", "success");
        setDeleteProduct(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteProduct.id));
        loadProducts();
      } else {
        showToast(data.error || "Failed to delete product", "error");
      }
    } catch {
      showToast("Network error deleting product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk actions
  const handleBulkPublish = async (targetStatus: "ACTIVE" | "DRAFT") => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
    }
    showToast(`Bulk updated ${selectedIds.length} products to ${targetStatus}`, "success");
    setSelectedIds([]);
    loadProducts();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your jewellery collections, publish statuses, pricing, and live inventory.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-slate-900 hover:bg-[#A68A5D] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Piece
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU (e.g. VJ-RING)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#A68A5D]"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#A68A5D]"
            >
              <option value="all">All Categories</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="earrings">Earrings</option>
              <option value="bracelets">Bracelets</option>
              <option value="pendants">Pendants</option>
              <option value="silver-collection">Silver Collection</option>
              <option value="gold">Gold Collection</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#A68A5D]"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Published (Active)</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#A68A5D]"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock (&gt;3)</option>
              <option value="low-stock">Low Stock (1-3)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Sort and Bulk Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700 font-mono">
              {products.length} Products Found
            </span>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="font-semibold text-slate-900">
                  {selectedIds.length} Selected
                </span>
                <button
                  onClick={() => handleBulkPublish("ACTIVE")}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-semibold"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkPublish("DRAFT")}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold"
                >
                  Unpublish
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No products match your criteria</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 pl-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-slate-900"
                    />
                  </th>
                  <th className="p-3.5">Piece</th>
                  <th className="p-3.5">SKU / Code</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price (₹)</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
                  const isOut = p.stockQuantity <= 0;
                  const thumb = p.images[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80";

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        selectedIds.includes(p.id) ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelectOne(p.id)}
                          className="rounded border-slate-300 text-slate-900"
                        />
                      </td>

                      {/* Product Thumbnail & Title */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-slate-100 rounded overflow-hidden shrink-0 border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-snug line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {p.material}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-3.5 font-mono text-[11px] font-medium text-slate-600">
                        {p.sku}
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium uppercase tracking-wider">
                          {p.categorySlug}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 font-medium text-slate-900">
                        ₹{p.price.toLocaleString("en-IN")}
                        {p.compareAtPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            ₹{p.compareAtPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold ${
                              isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-700"
                            }`}
                          >
                            {p.stockQuantity}
                          </span>
                          {isOut && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-800 font-semibold uppercase">
                              Out
                            </span>
                          )}
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-100 text-amber-800 font-semibold uppercase">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Publish / Status Toggle */}
                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePublish(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                          title="Click to toggle Published / Draft"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-500"
                            }`}
                          />
                          {p.status === "ACTIVE" ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Preview */}
                          <button
                            onClick={() => setPreviewProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="Preview Piece"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-[#A68A5D] hover:bg-slate-100 rounded transition-colors"
                            title="Edit Piece"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Confirm Product Deletion
              </h3>
              <button
                onClick={() => setDeleteProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">&ldquo;{deleteProduct.title}&rdquo;</strong> (SKU: {deleteProduct.sku})? This action removes the piece from public customer listings and archives its record.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteProduct(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A68A5D] font-bold">
                  {previewProduct.categorySlug} • {previewProduct.collection}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                  {previewProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-card rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewProduct.images[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"}
                  alt={previewProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-[10px] uppercase font-mono">Pricing & Stock</p>
                  <p className="font-serif-luxury text-2xl font-bold text-slate-900 mt-1">
                    ₹{previewProduct.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-slate-500 mt-1">
                    Available Stock: <strong className="text-slate-900 font-mono">{previewProduct.stockQuantity}</strong> units
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Metal & Craft:</p>
                  <p>{previewProduct.material}</p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/product/${previewProduct.slug}`}
                    target="_blank"
                    className="flex-1 py-2 bg-slate-900 hover:bg-[#A68A5D] text-white text-center text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    View on Live Store <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
