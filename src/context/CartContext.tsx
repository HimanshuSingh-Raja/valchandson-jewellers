"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PROMO_CODES, MaterialType } from "@/data/products";

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize?: string;
  selectedMaterial: MaterialType;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, material?: MaterialType) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  appliedPromo: string | null;
  promoError: string | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  freeShippingThreshold: number;
  orderNote: string;
  setOrderNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const freeShippingThreshold = 5000;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vj_cart_items");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedPromo = localStorage.getItem("vj_applied_promo");
      if (savedPromo && PROMO_CODES[savedPromo]) {
        setAppliedPromo(savedPromo);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("vj_cart_items", JSON.stringify(items));
        if (appliedPromo) {
          localStorage.setItem("vj_applied_promo", appliedPromo);
        } else {
          localStorage.removeItem("vj_applied_promo");
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [items, appliedPromo, isLoaded]);

  const addItem = (
    product: Product,
    quantity: number = 1,
    size?: string,
    material?: MaterialType
  ) => {
    const chosenMaterial = material || product.material;
    const chosenSize = size || (product.sizes ? product.sizes[0] : undefined);
    const cartItemId = `${product.id}-${chosenMaterial}-${chosenSize || "onesize"}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          selectedSize: chosenSize,
          selectedMaterial: chosenMaterial,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setOrderNote("");
    try {
      localStorage.removeItem("vj_cart_items");
      localStorage.removeItem("vj_applied_promo");
    } catch {
      // Ignore
    }
  };

  const applyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      setAppliedPromo(normalized);
      setPromoError(null);
      return true;
    } else {
      setPromoError("Invalid promotional voucher code");
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === "percent") {
      discountAmount = Math.round((subtotal * promo.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, promo.value);
    }
  }

  // Free shipping over threshold, otherwise complimentary during launch preview
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 350;

  // Indian standard Jewellery GST is 3%
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableBase * 0.03);

  const total = Math.max(0, taxableBase + shippingCost + taxAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        itemCount,
        subtotal,
        discountAmount,
        shippingCost,
        taxAmount,
        total,
        appliedPromo,
        promoError,
        applyPromo,
        removePromo,
        freeShippingThreshold,
        orderNote,
        setOrderNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
