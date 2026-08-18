"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface OrderItemData {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface ShippingAddressData {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderRecord {
  _id: string;
  orderNumber: string;
  user?: string;
  items: OrderItemData[];
  shippingAddress: ShippingAddressData;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingId?: string;
  subtotal: number;
  totalAmount: number;
  createdAt: string;
}

interface PaginationMeta {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery.trim(),
        orderStatus: orderStatusFilter,
        paymentStatus: paymentStatusFilter,
      });

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setErrorMsg(data.error || "Failed to load orders.");
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setErrorMsg("An unexpected error occurred while fetching orders.");
      setOrders([]);
    } fontFinally: {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, orderStatusFilter, paymentStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Order Status Change (PATCH /api/admin/orders/[id])
  const handleStatusChange = async (orderId: string, orderNumber: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      // Optimistically update state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
      );

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setToastMsg(`✓ Order #${orderNumber} status updated to '${newStatus}'`);
        setTimeout(() => setToastMsg(null), 4000);

        if (data.order) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o))
          );
        }
      } else {
        fetchOrders();
        alert(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Order Management
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Fulfill customer purchases, update tracking details, and automate email receipts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#A67C52] bg-[#A67C52]/10 px-3 py-1.5 rounded-full border border-[#A67C52]/20">
              Total: {pagination.totalOrders} Orders
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5E5E5]/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order #, Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm bg-[#FAF8F5] text-[#1F1F1F] focus:outline-none focus:border-[#A67C52]"
            />
            <span className="absolute left-3.5 top-3 text-sm text-[#666666]">🔍</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#666666]">Order:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer focus:outline-none focus:border-[#A67C52]"
              >
                <option value="All">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#666666]">Payment:</span>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-semibold bg-[#FAF8F5] text-[#1F1F1F] cursor-pointer focus:outline-none focus:border-[#A67C52]"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ✕ {errorMsg}
          </div>
        )}

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Loading orders from MongoDB...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">📦</span>
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
              No Orders Found
            </h3>
            <p className="text-xs text-[#666666]">
              No orders matched your search query or filter selection.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#E5E5E5]/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#666666] border-b border-[#E5E5E5]">
                      <th className="py-3.5 px-4 font-bold">Order ID</th>
                      <th className="py-3.5 px-4 font-bold">Customer Name</th>
                      <th className="py-3.5 px-4 font-bold">Email / Phone</th>
                      <th className="py-3.5 px-4 font-bold">Location</th>
                      <th className="py-3.5 px-4 font-bold">Amount</th>
                      <th className="py-3.5 px-4 font-bold">Payment</th>
                      <th className="py-3.5 px-4 font-bold">Order Status</th>
                      <th className="py-3.5 px-4 font-bold">Date</th>
                      <th className="py-3.5 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                    {orders.map((order) => {
                      const customerName = order.shippingAddress?.fullName || "Valued Customer";
                      const phone = order.shippingAddress?.phone || "N/A";
                      const email = order.shippingAddress?.email || "N/A";
                      const location = order.shippingAddress?.city
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
                        : "India";
                      const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString("en-IN")}`;
                      const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <tr key={order._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          {/* Order ID */}
                          <td className="py-3.5 px-4 font-bold text-[#1F1F1F]">
                            #{order.orderNumber}
                          </td>

                          {/* Customer Name */}
                          <td className="py-3.5 px-4 font-medium text-[#1F1F1F]">
                            {customerName}
                          </td>

                          {/* Email / Phone */}
                          <td className="py-3.5 px-4 text-xs">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#1F1F1F]">{email}</span>
                              <span className="text-[#666666]">{phone}</span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4 text-xs text-[#666666]">
                            {location}
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 font-bold text-[#1F1F1F]">
                            {formattedTotal}
                          </td>

                          {/* Payment */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col items-start gap-0.5">
                              <span
                                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                                  order.paymentStatus === "Paid"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : order.paymentStatus === "Failed"
                                    ? "bg-rose-100 text-rose-800 border-rose-300"
                                    : "bg-amber-100 text-amber-800 border-amber-300"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                              <span className="text-[10px] text-[#666666] font-mono">
                                {order.paymentMethod}
                              </span>
                            </div>
                          </td>

                          {/* Order Status Updater */}
                          <td className="py-3.5 px-4">
                            <select
                              value={order.orderStatus}
                              disabled={updatingId === order._id}
                              onChange={(e) =>
                                handleStatusChange(order._id, order.orderNumber, e.target.value)
                              }
                              className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-colors focus:outline-none ${
                                order.orderStatus === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : order.orderStatus === "Shipped"
                                  ? "bg-blue-50 text-blue-700 border-blue-300"
                                  : order.orderStatus === "Processing"
                                  ? "bg-amber-50 text-amber-700 border-amber-300"
                                  : order.orderStatus === "Confirmed"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                                  : order.orderStatus === "Cancelled"
                                  ? "bg-rose-50 text-rose-700 border-rose-300"
                                  : "bg-zinc-100 text-zinc-700 border-zinc-300"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-xs text-[#666666]">
                            {formattedDate}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-center">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="inline-block px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:bg-[#A67C52] hover:text-white transition-colors cursor-pointer"
                            >
                              Details →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5E5]/80 shadow-sm text-xs">
                <span className="text-[#666666]">
                  Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalOrders} total orders)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] disabled:opacity-40 cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages || isLoading}
                    className="px-4 py-2 rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] font-semibold text-[#1F1F1F] disabled:opacity-40 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminProtectedRoute>
  );
}
