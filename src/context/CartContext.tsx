"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  productId: string;
  variantId?: string;
  colorName?: string;
  colorCode?: string;
  sku?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

interface CartContextType {
  cart: CartState;
  isLoading: boolean;
  addToCart: (item: {
    productId: string;
    variantId?: string;
    colorName?: string;
    colorCode?: string;
    sku?: string;
    name: string;
    price: number | string;
    image: string;
    quantity?: number;
  }) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  incrementQuantity: (productId: string, variantId?: string) => Promise<void>;
  decrementQuantity: (productId: string, variantId?: string) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const GUEST_CART_KEY = "benedecor_guest_cart";

const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateCartTotals(items: CartItem[]): CartState {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { items, totalItems, subtotal };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(initialCartState);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Parse price helper
  const parsePriceNum = (price: number | string): number => {
    if (typeof price === "number") return price;
    return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  };

  // Sync / Fetch Cart on mount
  const syncCart = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if user is logged in
      const meRes = await fetch("/api/auth/me");
      const meType = meRes.headers.get("content-type") || "";
      const meData = meRes.ok && meType.includes("application/json") ? await meRes.json() : null;

      if (meData?.success && meData?.user) {
        setIsLoggedIn(true);

        // Fetch MongoDB Cart
        const cartRes = await fetch("/api/cart");
        const cartType = cartRes.headers.get("content-type") || "";
        const cartData = cartRes.ok && cartType.includes("application/json") ? await cartRes.json() : null;

        let dbCartItems: CartItem[] = [];
        if (cartData?.success && cartData?.cart?.items) {
          dbCartItems = cartData.cart.items;
        }

        // Check if guest cart exists in localStorage to merge
        const localData = localStorage.getItem(GUEST_CART_KEY);
        if (localData) {
          try {
            const guestCart: CartState = JSON.parse(localData);
            if (guestCart.items && guestCart.items.length > 0) {
              // Merge guest items into MongoDB
              for (const guestItem of guestCart.items) {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(guestItem),
                });
              }
              // Clear localStorage guest cart after successful merge
              localStorage.removeItem(GUEST_CART_KEY);

              // Re-fetch merged MongoDB cart
              const mergedRes = await fetch("/api/cart");
              const mergedType = mergedRes.headers.get("content-type") || "";
              const mergedData = mergedRes.ok && mergedType.includes("application/json") ? await mergedRes.json() : null;
              if (mergedData?.success && mergedData?.cart?.items) {
                dbCartItems = mergedData.cart.items;
              }
            }
          } catch (e) {
            console.error("Error parsing guest cart:", e);
          }
        }

        setCart(calculateCartTotals(dbCartItems));
      } else {
        setIsLoggedIn(false);
        // Load Guest Cart from localStorage
        const localData = localStorage.getItem(GUEST_CART_KEY);
        if (localData) {
          try {
            const guestCart: CartState = JSON.parse(localData);
            setCart(calculateCartTotals(guestCart.items || []));
          } catch {
            setCart(initialCartState);
          }
        } else {
          setCart(initialCartState);
        }
      }
    } catch (err) {
      console.error("Sync Cart Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Save guest cart to localStorage
  const saveGuestCart = (newItems: CartItem[]) => {
    const updated = calculateCartTotals(newItems);
    setCart(updated);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
  };

  // Add To Cart (differentiates by productId AND variantId)
  const addToCart = async (item: {
    productId: string;
    variantId?: string;
    colorName?: string;
    colorCode?: string;
    sku?: string;
    name: string;
    price: number | string;
    image: string;
    quantity?: number;
  }) => {
    const numPrice = parsePriceNum(item.price);
    const qty = item.quantity || 1;

    if (isLoggedIn) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            variantId: item.variantId,
            colorName: item.colorName,
            colorCode: item.colorCode,
            sku: item.sku,
            name: item.name,
            price: numPrice,
            image: item.image,
            quantity: qty,
          }),
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCart(calculateCartTotals(data.cart.items));
        }
      } catch (err) {
        console.error("Add to cart API error:", err);
      }
    } else {
      // Guest local state - find item matching both productId AND variantId
      const existingIdx = cart.items.findIndex(
        (i) =>
          String(i.productId) === String(item.productId) &&
          String(i.variantId || "") === String(item.variantId || "")
      );
      let updatedItems = [...cart.items];

      if (existingIdx > -1) {
        updatedItems[existingIdx].quantity += qty;
      } else {
        updatedItems.push({
          productId: String(item.productId),
          variantId: item.variantId,
          colorName: item.colorName,
          colorCode: item.colorCode,
          sku: item.sku,
          name: item.name,
          price: numPrice,
          image: item.image,
          quantity: qty,
        });
      }
      saveGuestCart(updatedItems);
    }
  };

  // Update Quantity
  const updateQuantity = async (productId: string, newQuantity: number, variantId?: string) => {
    if (newQuantity <= 0) {
      await removeItem(productId, variantId);
      return;
    }

    if (isLoggedIn) {
      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, variantId, quantity: newQuantity }),
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCart(calculateCartTotals(data.cart.items));
        }
      } catch (err) {
        console.error("Update quantity error:", err);
      }
    } else {
      const updatedItems = cart.items.map((i) =>
        String(i.productId) === String(productId) &&
        String(i.variantId || "") === String(variantId || "")
          ? { ...i, quantity: newQuantity }
          : i
      );
      saveGuestCart(updatedItems);
    }
  };

  // Increment Quantity
  const incrementQuantity = async (productId: string, variantId?: string) => {
    const target = cart.items.find(
      (i) =>
        String(i.productId) === String(productId) &&
        String(i.variantId || "") === String(variantId || "")
    );
    if (target) {
      await updateQuantity(productId, target.quantity + 1, variantId);
    }
  };

  // Decrement Quantity
  const decrementQuantity = async (productId: string, variantId?: string) => {
    const target = cart.items.find(
      (i) =>
        String(i.productId) === String(productId) &&
        String(i.variantId || "") === String(variantId || "")
    );
    if (target) {
      if (target.quantity <= 1) {
        await removeItem(productId, variantId);
      } else {
        await updateQuantity(productId, target.quantity - 1, variantId);
      }
    }
  };

  // Remove Item
  const removeItem = async (productId: string, variantId?: string) => {
    if (isLoggedIn) {
      try {
        const query = `/api/cart?productId=${encodeURIComponent(productId)}&variantId=${encodeURIComponent(variantId || "")}`;
        const res = await fetch(query, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success && data.cart) {
          setCart(calculateCartTotals(data.cart.items));
        }
      } catch (err) {
        console.error("Remove item error:", err);
      }
    } else {
      const updatedItems = cart.items.filter(
        (i) =>
          !(
            String(i.productId) === String(productId) &&
            String(i.variantId || "") === String(variantId || "")
          )
      );
      saveGuestCart(updatedItems);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await fetch("/api/cart?clear=true", { method: "DELETE" });
        setCart(initialCartState);
      } catch (err) {
        console.error("Clear cart error:", err);
      }
    } else {
      saveGuestCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
