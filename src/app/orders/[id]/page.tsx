"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import OrderInvoice, { OrderDetail } from "@/components/admin/OrderInvoice";
import { useAuth } from "@/context/AuthContext";

const TIMELINE_STEPS = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const res = await fetch(`/api/orders/${id}`, { credentials: "same-origin" });
        const contentType = res.headers.get("content-type") || "";

        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setErrorMessage(data.error || "Order not found.");
          }
        } else {
          setErrorMessage(`Order not found or access denied (${res.status}).`);
        }
      } catch (err) {
        console.error("Fetch order detail error:", err);
        setErrorMessage("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && id) {
      fetchOrder();
    } else if (!isAuthLoading && !isAuthenticated) {
      setErrorMessage("Authentication required to view order details.");
      setIsLoading(false);
    }
  }, [id, isAuthenticated, isAuthLoading]);

  // Handle Invoice Print
  const handlePrint = () => {
    setShowInvoicePrint(true);
    setTimeout(() => {
      window.print();
      setShowInvoicePrint(false);
    }, 200);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
        <Navbar />
        <Container>
          <div className="py-20 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Loading order details and status timeline...
          </div>
        </Container>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
        <Navbar />
        <main className="py-16">
          <Container>
            <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-rose-200 text-center flex flex-col items-center gap-4 shadow-sm">
              <span className="text-4xl">⚠️</span>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Access Restricted
              </h2>
              <p className="text-xs text-[#666666] leading-relaxed">{errorMessage}</p>
              <Link
                href="/orders"
                className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-semibold shadow-md hover:bg-[#8e6843] transition-colors"
              >
                ← Back to My Orders
              </Link>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Determine Timeline Step Index
  const isCancelled = order.orderStatus === "Cancelled";
  let activeIndex = 0;
  if (order.orderStatus === "Confirmed") activeIndex = 1;
  else if (order.orderStatus === "Processing") activeIndex = 2;
  else if (order.orderStatus === "Shipped") activeIndex = 3;
  else if (order.orderStatus === "Delivered") activeIndex = 4;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      {/* Printable Invoice (Only visible during window.print) */}
      {showInvoicePrint && (
        <div className="fixed inset-0 z-[100] bg-white">
          <OrderInvoice order={order} />
        </div>
      )}

      <div className="no-print">
        <Navbar />

        <main className="py-10 sm:py-16">
          <Container>
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {/* Header Navigation & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
                <div className="flex flex-col gap-1">
                  <Link
                    href="/orders"
                    className="text-xs font-bold text-[#A67C52] hover:underline flex items-center gap-1 w-fit mb-1"
                  >
                    ← Back to My Orders
                  </Link>
                  <div className="flex items-center gap-3">
                    <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                      Order #{order.orderNumber}
                    </h1>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        isCancelled
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : order.orderStatus === "Delivered"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <span className="text-xs text-[#666666]">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:border-[#A67C52] hover:text-[#A67C52] shadow-xs transition-colors flex items-center gap-2 cursor-pointer w-fit"
                >
                  <span>🖨️</span>
                  <span>Print Tax Invoice</span>
                </button>
              </div>

              {/* Order Status Timeline Tracker */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                  Order Fulfillment Status
                </h2>

                {isCancelled ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3">
                    <span>🔴</span>
                    <span>This order was cancelled. If payment was processed, a refund will be credited to your original payment method.</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0 pt-2">
                    {/* Connecting Progress Bar */}
                    <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-[#E5E5E5] z-0">
                      <div
                        className="h-full bg-[#A67C52] transition-all duration-500"
                        style={{ width: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                      />
                    </div>

                    {TIMELINE_STEPS.map((stepName, idx) => {
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={stepName} className="relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? "bg-[#A67C52] text-white shadow-md ring-4 ring-[#A67C52]/20"
                                : "bg-white border-2 border-[#E5E5E5] text-[#666666]"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              isCurrent ? "text-[#A67C52]" : isCompleted ? "text-[#1F1F1F]" : "text-[#666666]"
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {order.trackingId && (
                  <div className="mt-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5] flex items-center justify-between text-xs">
                    <span className="text-[#666666]">Courier Tracking ID:</span>
                    <strong className="font-mono text-sm text-[#A67C52]">{order.trackingId}</strong>
                  </div>
                )}
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Items List */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                    Purchased Items ({order.items.length})
                  </h2>

                  <div className="flex flex-col gap-4 divide-y divide-[#E5E5E5]/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                            <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs sm:text-sm text-[#1F1F1F] line-clamp-1">{item.name}</span>
                            {item.colorName && (
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#1F1F1F]">
                                <span className="text-[#666666]">Color:</span>
                                {item.colorCode && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/20 inline-block shrink-0 shadow-xs"
                                    style={{ backgroundColor: item.colorCode }}
                                  />
                                )}
                                <span className="font-bold text-[#1F1F1F]">{item.colorName}</span>
                              </div>
                            )}
                            {item.sku && (
                              <span className="text-[10px] text-[#A67C52] font-mono font-medium">
                                SKU: {item.sku}
                              </span>
                            )}
                            <span className="text-xs text-[#666666]">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#1F1F1F]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] flex flex-col gap-2 text-xs">
                    <div className="flex justify-between text-[#666666]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1F1F1F]">₹{order.subtotal?.toLocaleString("en-IN") || order.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#666666]">
                      <span>Shipping</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1F1F1F] pt-2 border-t border-[#E5E5E5]">
                      <span>Total Amount</span>
                      <span className="text-[#A67C52] text-base">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Address & Payment Info */}
                <div className="flex flex-col gap-6">
                  {/* Shipping Address Box */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-3 text-xs sm:text-sm">
                    <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                      Shipping Address
                    </h2>
                    <span className="font-bold text-[#1F1F1F]">{order.shippingAddress.fullName}</span>
                    <span className="text-[#666666]">{order.shippingAddress.address}</span>
                    <span className="text-[#666666]">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</span>
                    <span className="text-[#666666]">{order.shippingAddress.country}</span>
                    <span className="text-[#666666] pt-1">Phone: <strong className="text-[#1F1F1F]">{order.shippingAddress.phone}</strong></span>
                  </div>

                  {/* Payment Details Box */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-3 text-xs sm:text-sm">
                    <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                      Payment Summary
                    </h2>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Method</span>
                      <strong className="text-[#1F1F1F]">{order.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Status</span>
                      <strong className={order.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"}>
                        {order.paymentStatus}
                      </strong>
                    </div>
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Razorpay Payment ID</span>
                        <strong className="font-mono text-[11px] text-[#A67C52]">{order.razorpayPaymentId}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}
