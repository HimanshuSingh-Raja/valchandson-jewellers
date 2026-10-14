"use client";

import React, { useState } from "react";
import { X, Check, ShoppingBag, ShieldCheck } from "lucide-react";
import { Product, MaterialType } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize selection when product opens
  React.useEffect(() => {
    if (product) {
      setSelectedMaterial(product.material);
      setSelectedSize(product.sizes ? product.sizes[0] : null);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    addItem(product, quantity, selectedSize || undefined, selectedMaterial || product.material);
    showToast(`Added "${product.title}" to your shopping bag`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] shadow-2xl rounded p-6 animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Close quick add modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Thumbnail */}
          <div className="w-full sm:w-44 aspect-card bg-stone-100 rounded overflow-hidden border border-[#E8E2D8] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Configuration */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A68A5D] font-semibold">
                {product.collection === "silver-collection" ? "925 Silver Edition" : "Gold Heirloom"}
              </span>
              <h3 className="font-serif-luxury text-xl font-semibold text-[#1C1917] mt-0.5 leading-tight">
                {product.title}
              </h3>
              <p className="text-sm font-medium text-stone-900 mt-1">
                ₹{product.price.toLocaleString("en-IN")}{" "}
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through ml-1.5">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </p>

              {/* Metal finishes */}
              <div className="mt-4">
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                  Metal Finish: <span className="text-stone-900 font-semibold">{selectedMaterial}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableMaterials.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                        selectedMaterial === mat
                          ? "bg-[#1C1917] text-white border-[#1C1917]"
                          : "bg-white text-stone-700 border-[#E8E2D8] hover:border-stone-400"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes if applicable */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                    Select Size: <span className="text-stone-900 font-semibold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-10 px-2 py-1 text-xs rounded border transition-colors ${
                          selectedSize === s
                            ? "bg-[#1C1917] text-white border-[#1C1917] font-semibold"
                            : "bg-white text-stone-700 border-[#E8E2D8] hover:border-stone-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="mt-6 pt-4 border-t border-[#E8E2D8]">
              <button
                onClick={handleAdd}
                className="w-full py-3 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A68A5D] transition-colors flex items-center justify-center gap-2 rounded"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag • ₹{product.price.toLocaleString("en-IN")}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A68A5D]" /> BIS Hallmarked & Insured Dispatch
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
