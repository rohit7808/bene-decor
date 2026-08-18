"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import OrderInvoice from "@/components/admin/OrderInvoice";

interface OrderItem {
  product: string;
  variantId?: string;
  colorName?: string;
  colorCode?: string;
  sku?: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  user?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subtotal: number;
  totalAmount: number;
  createdAt: string;
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [orderStatus, setOrderStatus] = useState<string>("Pending");
  const [paymentStatus, setPaymentStatus] = useState<string>("Pending");
  const [trackingId, setTrackingId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Order Details
  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/admin/orders/${id}`, { credentials: "same-origin" });
        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);
          setOrderStatus(data.order.orderStatus);
          setPaymentStatus(data.order.paymentStatus);
          setTrackingId(data.order.trackingId || "");
        } else {
          setErrorMsg(data.error || "Order not found.");
        }
      } catch (err) {
        console.error("Fetch order detail error:", err);
        setErrorMsg("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Update Order Status & Tracking
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setErrorMsg(null);

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          trackingId: trackingId.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
        setToastMsg(data.message || "Order updated successfully!");
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Failed to update order.");
      }
    } catch (err) {
      console.error("Update order error:", err);
      setErrorMsg("An unexpected error occurred while saving updates.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-5xl mx-auto p-12 text-center text-sm text-[#666666] animate-pulse">
          ⏳ Loading order details from MongoDB...
        </div>
      </AdminProtectedRoute>
    );
  }

  if (errorMsg || !order) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-rose-200 text-center flex flex-col items-center gap-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
            Order Not Found
          </h2>
          <p className="text-xs text-[#666666]">{errorMsg || "Requested order does not exist."}</p>
          <Link
            href="/admin/orders"
            className="px-6 py-2.5 rounded-xl bg-[#A67C52] text-white text-xs font-bold shadow-md hover:bg-[#8e6843] transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      {/* 1. SCREEN VIEW (Hidden when printing) */}
      <div className="no-print flex flex-col gap-8 max-w-5xl mx-auto pb-12">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#A67C52] hover:underline flex items-center gap-1 w-fit mb-1"
            >
              ← Back to All Orders
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  order.orderStatus === "Delivered"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : order.orderStatus === "Shipped"
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : order.orderStatus === "Processing"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : order.orderStatus === "Cancelled"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-zinc-100 text-zinc-800 border-zinc-300"
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
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] shadow-sm hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 cursor-pointer w-fit"
          >
            <span>🖨️</span>
            <span>Print Invoice</span>
          </button>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Order Items & Customer Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Itemized Products Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-5">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                Ordered Items ({order.items?.length || 0})
              </h2>

              <div className="divide-y divide-[#E5E5E5]">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#666666]">
                            🛋️
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1F1F1F]">{item.name}</span>

                        {item.colorName && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#1F1F1F]">
                            <span className="font-semibold text-[#666666]">Color:</span>
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
                          <span className="text-[11px] text-[#A67C52] font-mono font-medium">
                            SKU: {item.sku}
                          </span>
                        )}

                        <span className="text-xs text-[#666666] mt-0.5">
                          Quantity: <strong>{item.quantity}</strong> × ₹
                          {(item.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm sm:text-base text-[#1F1F1F]">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-[#E5E5E5] flex flex-col gap-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || order.totalAmount || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Delivery Charge</span>
                  <span className="text-[#16A34A] font-semibold">FREE</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5] font-bold text-base sm:text-lg text-[#1F1F1F]">
                  <span>Total Amount</span>
                  <span className="text-[#A67C52]">
                    ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-4">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5] flex items-center gap-2">
                <span>📍</span>
                <span>Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                  <span className="text-xs text-[#666666]">Full Name</span>
                  <span className="font-semibold text-[#1F1F1F] mt-0.5">
                    {order.shippingAddress?.fullName || "Valued Customer"}
                  </span>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                  <span className="text-xs text-[#666666]">Contact Phone</span>
                  <span className="font-semibold text-[#1F1F1F] mt-0.5">
                    {order.shippingAddress?.phone || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50 sm:col-span-2">
                  <span className="text-xs text-[#666666]">Street Address</span>
                  <span className="font-semibold text-[#1F1F1F] mt-0.5">
                    {order.shippingAddress?.address || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                  <span className="text-xs text-[#666666]">City &amp; State</span>
                  <span className="font-semibold text-[#1F1F1F] mt-0.5">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </span>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                  <span className="text-xs text-[#666666]">PIN Code</span>
                  <span className="font-semibold text-[#1F1F1F] mt-0.5">
                    {order.shippingAddress?.postalCode || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Update Order & Payment Details */}
          <div className="flex flex-col gap-6 w-full">
            {/* Update Controls Card */}
            <form
              onSubmit={handleUpdateOrder}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-5"
            >
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                Update Order Status
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                  Order Fulfillment Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                  Courier Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD-TRACK-948192"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-white text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 rounded-xl bg-[#A67C52] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isUpdating ? "Saving Changes..." : "Save & Send Customer Email →"}
              </button>
            </form>

            {/* Payment Audit Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-4 text-xs sm:text-sm">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5] flex items-center gap-2">
                <span>💳</span>
                <span>Payment Audit</span>
              </h2>

              <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                <span className="text-xs text-[#666666]">Payment Gateway</span>
                <span className="font-bold text-[#1F1F1F] mt-0.5">{order.paymentMethod}</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                <span className="text-xs text-[#666666]">Razorpay Order ID</span>
                <span className="font-mono text-xs font-semibold text-[#1F1F1F] mt-0.5">
                  {order.razorpayOrderId || "N/A (Cash on Delivery)"}
                </span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]/50">
                <span className="text-xs text-[#666666]">Razorpay Payment ID</span>
                <span className="font-mono text-xs font-semibold text-[#1F1F1F] mt-0.5">
                  {order.razorpayPaymentId || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRINT-ONLY A4 INVOICE COMPONENT (Rendered only when window.print() is called) */}
      <div className="hidden print:block">
        <OrderInvoice order={order} />
      </div>
    </AdminProtectedRoute>
  );
}
