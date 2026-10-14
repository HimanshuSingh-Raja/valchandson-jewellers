"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Loader2,
  Upload,
  Sparkles,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  displayOrder: number;
  isFeatured: boolean;
  productCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBannerImage, setFormBannerImage] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState("0");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteCategory, setDeleteCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setErrorMessage("Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-slug when creating new
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (modalMode === "ADD") {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Image Upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setModalError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormBannerImage(data.url);
      } else {
        setModalError(data.error || "Failed to upload banner image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setModalError("Network error while uploading image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode("ADD");
    setActiveCategoryId(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormBannerImage("");
    setFormDisplayOrder(categories.length.toString());
    setFormIsFeatured(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat: CategoryItem) => {
    setModalMode("EDIT");
    setActiveCategoryId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormBannerImage(cat.bannerImage || "");
    setFormDisplayOrder(cat.displayOrder.toString());
    setFormIsFeatured(cat.isFeatured);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formName.trim()) {
      setModalError("Category name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === "ADD") {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim() || undefined,
            description: formDescription.trim() || undefined,
            bannerImage: formBannerImage.trim() || undefined,
            displayOrder: parseInt(formDisplayOrder, 10) || 0,
            isFeatured: formIsFeatured,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setToastMessage(`Category "${formName}" created!`);
          setIsModalOpen(false);
          fetchCategories();
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setModalError(data.error || "Failed to create category.");
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeCategoryId,
            name: formName.trim(),
            description: formDescription.trim() || undefined,
            bannerImage: formBannerImage.trim() || undefined,
            displayOrder: parseInt(formDisplayOrder, 10) || 0,
            isFeatured: formIsFeatured,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setToastMessage(`Category "${formName}" updated!`);
          setIsModalOpen(false);
          fetchCategories();
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setModalError(data.error || "Failed to update category.");
        }
      }
    } catch (err) {
      console.error("Submit category error:", err);
      setModalError("Network error processing category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategory.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage(`Category "${deleteCategory.name}" removed.`);
        setDeleteCategory(null);
        fetchCategories();
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setErrorMessage(data.error || "Failed to delete category.");
        setDeleteCategory(null);
      }
    } catch (err) {
      console.error("Delete category error:", err);
      setErrorMessage("Network error deleting category.");
      setDeleteCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl lg:text-3xl text-[#1C1917] tracking-tight">
            Categories & Collections
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize high jewellery pieces into curated suites, homepage featured sections, and seasonal lookbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Category
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
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs rounded-r flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4 text-red-400 hover:text-red-700" />
          </button>
        </div>
      )}

      {/* Categories Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#A68A5D] animate-spin" />
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Loading atelier categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-[#E8E2D8] rounded p-12 text-center">
          <Layers className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-stone-700">No categories created</h3>
          <p className="text-xs text-stone-500 mt-1">Get started by adding your first jewellery category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E8E2D8] rounded overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#A68A5D]/50 transition-colors"
            >
              {/* Banner Header */}
              <div className="aspect-[16/9] relative bg-stone-100 overflow-hidden">
                {cat.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.bannerImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider">No Banner Image</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {cat.isFeatured && (
                    <span className="px-2 py-0.5 rounded bg-[#A68A5D] text-white text-[10px] uppercase tracking-wider font-semibold shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Homepage
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                    Order: #{cat.displayOrder}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#1C1917] text-[11px] font-semibold shadow-xs">
                    {cat.productCount || 0} pieces
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-luxury text-lg font-semibold text-[#1C1917]">
                      {cat.name}
                    </h3>
                    <Link
                      href={`/collections/${cat.slug}`}
                      target="_blank"
                      className="text-stone-400 hover:text-[#A68A5D] transition-colors p-1"
                      title="View on storefront"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                    slug: /{cat.slug}
                  </div>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || "No editorial description specified."}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                    Assigned Catalog: {cat.productCount || 0}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#E8E2D8] text-stone-700 bg-white hover:bg-stone-50 transition-colors rounded"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCategory(cat)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/50 transition-colors rounded"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D8] rounded my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                {modalMode === "ADD" ? "Add New Category" : `Edit Category: ${formName}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Solitaires & Cocktails"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  disabled={modalMode === "EDIT"}
                  placeholder="e.g. solitaires"
                  className="w-full px-3 py-2 bg-stone-100 border border-[#E8E2D8] text-xs font-mono text-stone-600 disabled:cursor-not-allowed"
                />
                {modalMode === "EDIT" && (
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Slug cannot be altered after creation to preserve customer bookmarks and SEO.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Atmospheric summary displayed at the top of the collection storefront..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Collection Banner Image
                </label>

                {formBannerImage ? (
                  <div className="relative aspect-[16/7] rounded overflow-hidden border border-[#E8E2D8] mb-2 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formBannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormBannerImage("")}
                      className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded text-xs"
                      title="Remove banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#D6CEBF] bg-[#FAF7F2] p-4 text-center rounded relative cursor-pointer mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#A68A5D]" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#A68A5D]" />
                      )}
                      <span className="text-xs text-stone-700 font-medium">
                        {isUploading ? "Uploading banner..." : "Click or drag to upload banner photo"}
                      </span>
                    </div>
                  </div>
                )}

                <input
                  type="url"
                  value={formBannerImage}
                  onChange={(e) => setFormBannerImage(e.target.value)}
                  placeholder="Or paste external image URL..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
                    />
                    <span className="text-xs text-stone-700 font-medium">
                      Featured on Homepage
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D8] text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />{" "}
                      {modalMode === "ADD" ? "Create Category" : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-[#E8E2D8] space-y-4 rounded">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif-luxury text-lg font-semibold text-[#1C1917]">
                Remove &quot;{deleteCategory.name}&quot;?
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {(deleteCategory.productCount || 0) > 0 ? (
                <span className="text-red-700 font-semibold">
                  This category currently has {deleteCategory.productCount} products assigned. You must reassign those products to another category before deleting.
                </span>
              ) : (
                "Are you sure you want to remove this category? This action cannot be undone."
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setDeleteCategory(null)}
                className="px-4 py-2 border border-[#E8E2D8] text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              {(deleteCategory.productCount || 0) === 0 && (
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
