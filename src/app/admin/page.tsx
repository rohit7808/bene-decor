"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    shippingAddress?: { fullName?: string };
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await fetch("/api/admin/stats", { credentials: "same-origin" });
        const contentType = res.headers.get("content-type") || "";

        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.stats) {
            setStats(data.stats);
          } else {
            setErrorMsg(data.error || "Failed to load real-time admin statistics.");
          }
        } else {
          setErrorMsg(`Failed to load admin statistics (${res.status}).`);
        }
      } catch (err) {
        console.error("Fetch Admin Stats Error:", err);
        setErrorMsg("An unexpected error occurred while loading dashboard statistics.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Welcome back! Live store analytics &amp; order fulfillment overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/add"
              className="px-5 py-2.5 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-all duration-200 flex items-center gap-2 w-fit cursor-pointer"
            >
              <span>➕</span>
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ✕ {errorMsg}
          </div>
        )}

        {/* 8 Real MongoDB KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Revenue */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Total Revenue
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center text-lg">
                💰
              </span>
            </div>
            <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F] mt-1">
              {isLoading ? "..." : `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`}
            </span>
            <span className="text-xs text-[#16A34A] font-semibold">
              Real MongoDB Sales Sum
            </span>
          </div>

          {/* Card 2: Total Orders */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Total Orders
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center text-lg">
                📦
              </span>
            </div>
            <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F] mt-1">
              {isLoading ? "..." : `${stats?.totalOrders || 0} Orders`}
            </span>
            <span className="text-xs text-[#666666]">
              All Time Customer Orders
            </span>
          </div>

          {/* Card 3: Total Customers */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Total Customers
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center text-lg">
                👥
              </span>
            </div>
            <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F] mt-1">
              {isLoading ? "..." : `${stats?.totalCustomers || 0} Customers`}
            </span>
            <span className="text-xs text-[#16A34A] font-semibold">
              Registered Accounts
            </span>
          </div>

          {/* Card 4: Total Products */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Active Products
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center text-lg">
                🛋️
              </span>
            </div>
            <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F] mt-1">
              {isLoading ? "..." : `${stats?.totalProducts || 0} Items`}
            </span>
            <span className="text-xs text-[#666666]">
              Catalog Inventory
            </span>
          </div>
        </div>

        {/* Order Status Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col gap-1">
            <span className="text-xs font-semibold text-amber-800 uppercase">Pending</span>
            <span className="text-xl font-bold text-amber-900">{stats?.pendingOrders || 0}</span>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-800 uppercase">Processing</span>
            <span className="text-xl font-bold text-blue-900">{stats?.processingOrders || 0}</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col gap-1">
            <span className="text-xs font-semibold text-indigo-800 uppercase">Shipped</span>
            <span className="text-xl font-bold text-indigo-900">{stats?.shippedOrders || 0}</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col gap-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase">Delivered</span>
            <span className="text-xl font-bold text-emerald-900">{stats?.deliveredOrders || 0}</span>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/products"
            className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:border-[#A67C52] hover:shadow-md transition-all duration-300 flex items-center gap-4 group cursor-pointer"
          >
            <span className="text-3xl p-3 bg-[#FAF8F5] rounded-xl group-hover:scale-110 transition-transform">
              🛋️
            </span>
            <div className="flex flex-col">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors">
                Manage Products
              </h3>
              <p className="text-xs text-[#666666]">Add, edit, or delete furniture listings</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:border-[#A67C52] hover:shadow-md transition-all duration-300 flex items-center gap-4 group cursor-pointer"
          >
            <span className="text-3xl p-3 bg-[#FAF8F5] rounded-xl group-hover:scale-110 transition-transform">
              📦
            </span>
            <div className="flex flex-col">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors">
                Order Fulfillment
              </h3>
              <p className="text-xs text-[#666666]">Track &amp; update customer deliveries</p>
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:border-[#A67C52] hover:shadow-md transition-all duration-300 flex items-center gap-4 group cursor-pointer"
          >
            <span className="text-3xl p-3 bg-[#FAF8F5] rounded-xl group-hover:scale-110 transition-transform">
              👥
            </span>
            <div className="flex flex-col">
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors">
                Customer Database
              </h3>
              <p className="text-xs text-[#666666]">View store user accounts</p>
            </div>
          </Link>
        </div>

        {/* Real Recent Orders Overview Table */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
              Recent Customer Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-[#A67C52] hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto mt-4">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#666666] animate-pulse">
                ⏳ Fetching real-time order records from MongoDB...
              </div>
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#666666]">
                No orders recorded yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[#666666] border-b border-[#E5E5E5]">
                    <th className="pb-3 px-2">Order ID</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Payment</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord._id}>
                      <td className="py-3 px-2 font-bold">
                        <Link href={`/admin/orders/${ord._id}`} className="hover:text-[#A67C52]">
                          #{ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        {ord.shippingAddress?.fullName || "Valued Customer"}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        ₹{ord.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        <span className={`px-2 py-0.5 text-[11px] rounded-full ${
                          ord.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#A67C52]/10 text-[#A67C52]">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#666666]">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
