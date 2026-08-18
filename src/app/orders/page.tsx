"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";

interface OrderItemData {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderHistoryItem {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItemData[];
  shippingAddress: {
    fullName: string;
    city: string;
    state: string;
  };
}

export default function OrderHistoryPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setAuthError("Please log in to view your order history.");
    }
  }, [isAuthLoading, isAuthenticated]);

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) return;
      try {
        setIsLoading(true);
        const res = await fetch("/api/orders", { credentials: "same-origin" });
        const contentType = res.headers.get("content-type") || "";

        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        } else if (res.status === 401) {
          setAuthError("Please log in to view your order history.");
        }
      } catch (err) {
        console.error("Order history fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-10">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              YOUR PURCHASES
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              My Orders
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Track your furniture deliveries, view receipts, and monitor fulfillment status.
            </p>
          </div>

          {/* Content */}
          {isAuthLoading || isLoading ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E5E5E5] animate-pulse h-48" />
              ))}
            </div>
          ) : !isAuthenticated || authError ? (
            <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#E5E5E5] text-center flex flex-col items-center gap-4 shadow-sm">
              <span className="text-4xl">🔐</span>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Login Required
              </h2>
              <p className="text-xs text-[#666666]">{authError || "Please log in to view your order history."}</p>
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-semibold shadow-md hover:bg-[#8e6843] transition-colors"
              >
                Log In Now
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="max-w-md mx-auto p-12 rounded-3xl bg-white border border-[#E5E5E5] text-center flex flex-col items-center gap-4 shadow-sm">
              <span className="text-4xl">📦</span>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                No Orders Yet
              </h2>
              <p className="text-xs text-[#666666]">
                You haven't placed any furniture orders yet.
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-semibold shadow-md hover:bg-[#8e6843] transition-colors"
              >
                Explore Handcrafted Collection
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow"
                >
                  {/* Order Header Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                          ORDER NUMBER
                        </span>
                        <span className="font-bold text-base text-[#1F1F1F]">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-[#E5E5E5] pl-4">
                        <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                          DATE
                        </span>
                        <span className="text-xs font-semibold text-[#1F1F1F]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.orderStatus === "Delivered"
                            ? "bg-[#16A34A]/10 text-[#16A34A]"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                      <Link
                        href={`/orders/${order._id}`}
                        className="px-4 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:bg-[#A67C52] hover:text-white transition-colors"
                      >
                        View Order Details &amp; Status Timeline →
                      </Link>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs sm:text-sm text-[#1F1F1F]">
                              {item.name}
                            </span>
                            <span className="text-xs text-[#666666]">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#1F1F1F]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="text-xs text-[#666666]">
                      Payment: <strong className="text-[#1F1F1F]">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#666666]">Total Amount:</span>
                      <span className="font-bold text-lg text-[#1F1F1F]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
