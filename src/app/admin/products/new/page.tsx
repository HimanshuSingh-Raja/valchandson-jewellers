"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  Tag,
  Package,
  ShieldCheck,
  Scale,
  Gem,
  Save,
  Loader2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImageItem {
  url: string;
  altText?: string;
  displayOrder: number;
}

interface VariantItem {
  name: string;
  size: string;
  material: string;
  sku: string;
  stockQuantity: number;
  priceModifier: number;
}

export default function NewProductPage() {
  const router = useRouter();

  // Categories list from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [collection, setCollection] = useState("silver-collection");
  const [material, setMaterial] = useState("925 Sterling Silver");
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([
    "925 Sterling Silver",
  ]);

  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT" | "ARCHIVED">("ACTIVE");

  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const [sku, setSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [lowStockThreshold, setLowStockThreshold] = useState("3");

  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");

  // Jewellery Specifications
  const [grossWeight, setGrossWeight] = useState("5.8 grams");
  const [hallmark, setHallmark] = useState("BIS 925 Laser Stamped");
  const [dimensions, setDimensions] = useState("Standard Fit");
  const [gemstones, setGemstones] = useState("Lab-Grown Simulant AAAAA");
  const [closureType, setClosureType] = useState("Comfort-fit interior");

  // Sizes & Tags
  const [sizesInput, setSizesInput] = useState("US 5, US 6, US 7, US 8");
  const [tagsInput, setTagsInput] = useState("silver, handcrafted, bestseller");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Images
  const [images, setImages] = useState<ProductImageItem[]>([
    {
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
      altText: "Primary Studio View",
      displayOrder: 0,
    },
    {
      url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
      altText: "Editorial Model View",
      displayOrder: 1,
    },
  ]);
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Variants
  const [variants, setVariants] = useState<VariantItem[]>([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Material options
  const MATERIAL_OPTIONS = [
    "925 Sterling Silver",
    "18K Yellow Gold",
    "22K Yellow Gold",
    "18K Rose Gold",
    "Platinum 950",
  ];

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setCategorySlug(data.categories[0].slug);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Auto-generate SKU when title or category changes if SKU is empty
  useEffect(() => {
    if (!sku && categorySlug) {
      const prefix = `VJ-${categorySlug.slice(0, 3).toUpperCase()}`;
      const random = Math.floor(100 + Math.random() * 900);
      setSku(`${prefix}-${random}`);
    }
  }, [categorySlug, sku]);

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setImages((prev) => [
            ...prev,
            {
              url: data.url,
              altText: `${title || "Valchandson Jewellery"} image ${prev.length + 1}`,
              displayOrder: prev.length,
            },
          ]);
        } else {
          setErrorMessage(data.error || "Failed to upload image.");
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Network error while uploading image.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: urlInput.trim(),
        altText: `${title || "Jewellery piece"} photo ${prev.length + 1}`,
        displayOrder: prev.length,
      },
    ]);
    setUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy.map((img, i) => ({ ...img, displayOrder: i }));
    });
  };

  // Variant Helpers
  const handleAddVariant = () => {
    const size = `Size ${variants.length + 6}`;
    setVariants((prev) => [
      ...prev,
      {
        name: `${material} - ${size}`,
        size,
        material,
        sku: `${sku || "VJ"}-${size.replace(/\s+/g, "")}`,
        stockQuantity: 3,
        priceModifier: 0,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantItem,
    value: string | number
  ) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const toggleAvailableMaterial = (mat: string) => {
    setAvailableMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  // Submit Handler
  const handleSubmit = async (targetStatus?: "ACTIVE" | "DRAFT") => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const submissionStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMessage("Please enter a product title.");
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setErrorMessage("Please enter a valid product price.");
      return;
    }
    if (!categorySlug) {
      setErrorMessage("Please select a category.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Please enter a product description.");
      return;
    }
    if (images.length === 0) {
      setErrorMessage("Please add at least one product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedSizes = sizesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        categorySlug,
        collection,
        material,
        availableMaterials:
          availableMaterials.length > 0 ? availableMaterials : [material],
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        status: submissionStatus,
        isFeatured,
        isBestSeller,
        isNew,
        sku: sku.trim() || undefined,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 3,
        description: description.trim(),
        story: story.trim() || undefined,
        grossWeight: grossWeight.trim() || undefined,
        hallmark: hallmark.trim() || "BIS Hallmarked",
        dimensions: dimensions.trim() || undefined,
        gemstones: gemstones.trim() || undefined,
        closureType: closureType.trim() || undefined,
        sizes: parsedSizes,
        tags: parsedTags,
        seoTitle: seoTitle.trim() || `${title.trim()} | Valchandson Jewellers`,
        seoDescription:
          seoDescription.trim() || description.trim().slice(0, 160),
        images: images.map((img, i) => ({
          url: img.url,
          altText: img.altText || `${title} photo ${i + 1}`,
          displayOrder: i,
        })),
        variants,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(`Product "${title}" created successfully! Redirecting...`);
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      } else {
        setErrorMessage(data.error || "Failed to create product.");
      }
    } catch (err) {
      console.error("Create product submit error:", err);
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link
              href="/admin/products"
              className="hover:text-[#A68A5D] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Products
            </Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">Add New Product</span>
          </div>
          <h1 className="font-serif-luxury text-2xl lg:text-3xl text-[#1C1917] tracking-tight">
            Add New Heirloom Jewellery
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Craft a new catalog listing with high-resolution photography, hallmark certification, and inventory control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-[#E8E2D8] text-xs uppercase tracking-wider text-stone-700 bg-white hover:bg-stone-50 transition-colors"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#A68A5D] text-xs uppercase tracking-wider text-[#A68A5D] bg-[#FFF8EB] hover:bg-[#F3EAD8] transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("ACTIVE")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Publish to Catalog
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs rounded-r flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Primary Details & Media */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Identity & Narrative */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A68A5D]" /> 1. Product Identity & Story
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fortress of Aurora Solitaire Ring"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Subtitle / Atelier Byline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Artisan Pavé Crown & 1.5ct Radiant Cut"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description highlighting the craftsmanship, setting style, and lustrous finish..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D] leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                The Story (Editorial Atelier Narrative)
              </label>
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="The creative inspiration behind this creation, historical references, and gemstone provenance..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D] leading-relaxed"
              />
            </div>
          </div>

          {/* 2. Visual Photography & Media Upload */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#A68A5D]" /> 2. Editorial Photography ({images.length})
              </h2>
              <span className="text-xs text-stone-500">First image = Primary, Second = Hover</span>
            </div>

            {/* Drag and Drop Upload Zone */}
            <div className="border-2 border-dashed border-[#D6CEBF] bg-[#FAF7F2] hover:bg-[#F3EAD8]/40 transition-colors p-6 text-center rounded relative cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[#A68A5D] shadow-sm">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs text-stone-700 font-medium">
                  {isUploading ? (
                    "Uploading high-resolution photography..."
                  ) : (
                    <>
                      <span className="text-[#A68A5D] font-semibold underline">Click to upload</span> or drag and drop editorial files
                    </>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  Supports JPEG, PNG, WebP, AVIF up to 8MB. Stored persistently in <code className="text-stone-700">/uploads</code>.
                </p>
              </div>
            </div>

            {/* Add by URL input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste external image URL (Unsplash, CDN, etc.)..."
                className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 bg-stone-800 text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Images Grid & Ordering */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group border border-[#E8E2D8] bg-[#FAF7F2] rounded overflow-hidden shadow-sm"
                  >
                    <div className="aspect-[4/5] relative bg-stone-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.altText || `Product photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badge indicator */}
                      <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                        {idx === 0 && (
                          <span className="px-1.5 py-0.5 bg-[#1C1917] text-white text-[9px] uppercase tracking-wider font-semibold rounded">
                            Primary
                          </span>
                        )}
                        {idx === 1 && (
                          <span className="px-1.5 py-0.5 bg-[#A68A5D] text-white text-[9px] uppercase tracking-wider font-semibold rounded">
                            Hover View
                          </span>
                        )}
                        {idx > 1 && (
                          <span className="px-1.5 py-0.5 bg-stone-900/60 text-white text-[9px] font-semibold rounded">
                            #{idx + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="p-1.5 bg-white border-t border-[#E8E2D8] flex items-center justify-between text-stone-600">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, "up")}
                          disabled={idx === 0}
                          title="Move left/up"
                          className="p-1 hover:text-[#A68A5D] disabled:opacity-30"
                        >
                          <ChevronUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, "down")}
                          disabled={idx === images.length - 1}
                          title="Move right/down"
                          className="p-1 hover:text-[#A68A5D] disabled:opacity-30"
                        >
                          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove photo"
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing & Value */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#A68A5D]" /> 3. Pricing & Value
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Selling Price (INR ₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-500 text-sm">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="14850"
                    min="1"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Original / Compare-at Price (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-500 text-sm">₹</span>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="16500"
                    min="1"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>
              </div>
            </div>

            {price && compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <div className="p-3 bg-[#FFF8EB] border border-[#E8E2D8] text-xs text-stone-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A68A5D]" />
                <span>
                  Customer Savings: <strong>₹{(parseFloat(compareAtPrice) - parseFloat(price)).toLocaleString("en-IN")}</strong> (
                  {Math.round(((parseFloat(compareAtPrice) - parseFloat(price)) / parseFloat(compareAtPrice)) * 100)}% off)
                </span>
              </div>
            )}
          </div>

          {/* 4. Luxury Jewellery Specifications */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#A68A5D]" /> 4. Luxury Specifications & Certifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Approx. Gross Weight
                </label>
                <input
                  type="text"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  placeholder="e.g. 5.82 grams"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Hallmark & Certification
                </label>
                <input
                  type="text"
                  value={hallmark}
                  onChange={(e) => setHallmark(e.target.value)}
                  placeholder="e.g. BIS 925 Laser Stamped"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Dimensions / Proportions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. Basket 9.4mm x 9.4mm; Band 2.1mm"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Gemstones & Carat Weight
                </label>
                <input
                  type="text"
                  value={gemstones}
                  onChange={(e) => setGemstones(e.target.value)}
                  placeholder="e.g. Lab-Grown Grade AAAAA Simulant (1.5ct eq.)"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Closure / Setting Type
                </label>
                <input
                  type="text"
                  value={closureType}
                  onChange={(e) => setClosureType(e.target.value)}
                  placeholder="e.g. Lobster clasp, Push back, Comfort-fit interior contour"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>
            </div>
          </div>

          {/* 5. Product Variants (Sizes & Modifiers) */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#A68A5D]" /> 5. Size & Material Variants ({variants.length})
              </h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider hover:bg-[#A68A5D] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-stone-500 py-2">
                No variants configured. Product uses base price and overall stock inventory.
              </p>
            ) : (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                        Variant Name
                      </label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                        Size
                      </label>
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                        placeholder="US 7"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={v.stockQuantity}
                        onChange={(e) =>
                          handleVariantChange(idx, "stockQuantity", parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                          Price Delta
                        </label>
                        <input
                          type="number"
                          value={v.priceModifier}
                          onChange={(e) =>
                            handleVariantChange(idx, "priceModifier", parseFloat(e.target.value) || 0)
                          }
                          placeholder="+/- ₹"
                          className="w-full px-2 py-1.5 bg-white border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 mt-3"
                        title="Delete variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Status, Organization & Inventory */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] border-b border-[#E8E2D8] pb-3">
              Publishing Status
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="ACTIVE">Active (Live on Storefront)</option>
                <option value="DRAFT">Draft (Hidden from customers)</option>
                <option value="ARCHIVED">Archived (Discontinued)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#E8E2D8] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
                />
                <span className="text-xs text-stone-700">Feature on Homepage Carousel</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
                />
                <span className="text-xs text-stone-700">Mark as Best Seller Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
                />
                <span className="text-xs text-stone-700">Mark as New Arrival Edition</span>
              </label>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] border-b border-[#E8E2D8] pb-3">
              Category & Collection
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              {isLoadingCategories ? (
                <div className="text-xs text-stone-400 py-2">Loading categories...</div>
              ) : (
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Curated Collection
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              >
                <option value="silver-collection">The Silver Collection (Beyond Larissa Edition)</option>
                <option value="gold">Solid Gold Creations (18K & 22K)</option>
                <option value="heritage">Heritage Temple Masterpieces</option>
                <option value="solitaire">Solitaire & Fine Pavé Crown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Primary Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              >
                {MATERIAL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Available Metals / Finishes
              </label>
              <div className="space-y-1.5 pt-1">
                {MATERIAL_OPTIONS.map((mat) => (
                  <label key={mat} className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={availableMaterials.includes(mat)}
                      onChange={() => toggleAvailableMaterial(mat)}
                      className="rounded text-[#A68A5D] focus:ring-[#A68A5D]"
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Stock & Inventory */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] border-b border-[#E8E2D8] pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#A68A5D]" /> Inventory & Stock Control
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. VJ-RIN-102"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Low-Stock Alert
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                />
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              When stock reaches ≤ {lowStockThreshold || 3} units, the dashboard and product page will flag a low-stock alert.
            </p>
          </div>

          {/* Sizes & Tags */}
          <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] border-b border-[#E8E2D8] pb-3">
              Sizes & Search Tags
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Sizes (Comma-separated)
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="US 5, US 6, US 7, US 8"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="solitaire, silver, bestseller, pavé"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
