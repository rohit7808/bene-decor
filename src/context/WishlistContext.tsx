"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isAvailable?: boolean;
  stock?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  totalWishlistItems: number;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<boolean>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
}

const GUEST_WISHLIST_KEY = "benedecor_guest_wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync Wishlist on Mount
  const syncWishlist = useCallback(async () => {
    try {
      setIsLoading(true);

      const meRes = await fetch("/api/auth/me");
      const meType = meRes.headers.get("content-type") || "";
      const meData = meRes.ok && meType.includes("application/json") ? await meRes.json() : null;

      if (meData?.success && meData?.user) {
        setIsLoggedIn(true);

        // Fetch MongoDB Wishlist
        const res = await fetch("/api/wishlist");
        const contentType = res.headers.get("content-type") || "";
        const data = res.ok && contentType.includes("application/json") ? await res.json() : null;

        let dbItems: WishlistItem[] = [];
        if (data?.success && Array.isArray(data.items)) {
          dbItems = data.items.map((i: any) => ({
            productId: String(i.productId),
            name: i.name,
            price: Number(i.price),
            originalPrice: i.originalPrice ? Number(i.originalPrice) : undefined,
            image: i.image,
            category: i.category,
            isAvailable: i.isAvailable !== false,
            stock: i.stock !== undefined ? Number(i.stock) : 10,
          }));
        }

        // Merge Guest localStorage wishlist if present
        const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
        if (localData) {
          try {
            const guestItems: WishlistItem[] = JSON.parse(localData);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              for (const item of guestItems) {
                await fetch("/api/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(item),
                });
              }
              localStorage.removeItem(GUEST_WISHLIST_KEY);

              // Re-fetch merged list
              const mergedRes = await fetch("/api/wishlist");
              const mergedType = mergedRes.headers.get("content-type") || "";
              const mergedData = mergedRes.ok && mergedType.includes("application/json") ? await mergedRes.json() : null;
              if (mergedData?.success && Array.isArray(mergedData.items)) {
                dbItems = mergedData.items.map((i: any) => ({
                  productId: String(i.productId),
                  name: i.name,
                  price: Number(i.price),
                  originalPrice: i.originalPrice ? Number(i.originalPrice) : undefined,
                  image: i.image,
                  category: i.category,
                  isAvailable: i.isAvailable !== false,
                  stock: i.stock !== undefined ? Number(i.stock) : 10,
                }));
              }
            }
          } catch (e) {
            console.error("Error parsing guest wishlist:", e);
          }
        }

        setWishlist(dbItems);
      } else {
        setIsLoggedIn(false);
        // Load Guest Wishlist from localStorage
        const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
        if (localData) {
          try {
            setWishlist(JSON.parse(localData));
          } catch {
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      }
    } catch (err) {
      console.error("Wishlist Sync Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWishlist();
  }, [syncWishlist]);

  // Helper to check if item is in wishlist
  const isInWishlist = (productId: string | number): boolean => {
    const idStr = String(productId);
    return wishlist.some((item) => String(item.productId) === idStr);
  };

  // Toggle Wishlist Item
  const toggleWishlist = async (item: WishlistItem): Promise<boolean> => {
    const idStr = String(item.productId);
    const exists = isInWishlist(idStr);

    if (exists) {
      await removeFromWishlist(idStr);
      return false;
    } else {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: idStr,
              name: item.name,
              price: item.price,
              originalPrice: item.originalPrice || 0,
              image: item.image,
              category: item.category,
              isAvailable: item.isAvailable !== false,
              stock: item.stock || 10,
            }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.items)) {
            const updated: WishlistItem[] = data.items.map((i: any) => ({
              productId: String(i.productId),
              name: i.name,
              price: Number(i.price),
              originalPrice: i.originalPrice ? Number(i.originalPrice) : undefined,
              image: i.image,
              category: i.category,
              isAvailable: i.isAvailable !== false,
              stock: i.stock !== undefined ? Number(i.stock) : 10,
            }));
            setWishlist(updated);
          }
        } catch (err) {
          console.error("Toggle Wishlist Error:", err);
        }
      } else {
        const updated = [...wishlist, { ...item, productId: idStr }];
        setWishlist(updated);
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated));
      }
      return true;
    }
  };

  // Remove Item
  const removeFromWishlist = async (productId: string | number) => {
    const idStr = String(productId);

    if (isLoggedIn) {
      try {
        const res = await fetch(`/api/wishlist/${encodeURIComponent(idStr)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          const updated: WishlistItem[] = data.items.map((i: any) => ({
            productId: String(i.productId),
            name: i.name,
            price: Number(i.price),
            originalPrice: i.originalPrice ? Number(i.originalPrice) : undefined,
            image: i.image,
            category: i.category,
            isAvailable: i.isAvailable !== false,
            stock: i.stock !== undefined ? Number(i.stock) : 10,
          }));
          setWishlist(updated);
        }
      } catch (err) {
        console.error("Remove Wishlist Error:", err);
      }
    } else {
      const updated = wishlist.filter((item) => String(item.productId) !== idStr);
      setWishlist(updated);
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        totalWishlistItems: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
