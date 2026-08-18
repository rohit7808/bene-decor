"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface AnalyticsData {
  period: string;
  dateRange: { start: string; end: string };
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    newCustomers: number;
    productsSold: number;
    successfulPayments: number;
    totalCustomers: number;
    returningCustomers: number;
    avgOrdersPerCustomer: string;
  };
  timeTrend: Array<{
    _id: string;
    totalOrders: number;
    revenue: number;
    paidOrders: number;
    cancelledOrders: number;
  }>;
  statusDistribution: {
    Pending: number;
    Processing: number;
    Shipped: number;
    Delivered: number;
    Cancelled: number;
  };
  topProducts: Array<{
    _id: string;
    name: string;
    image: string;
    unitsSold: number;
    revenue: number;
  }>;
  paymentAnalytics: Array<{
    _id: string;
    ordersCount: number;
    paidRevenue: number;
  }>;
  inventoryInsights: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
  recentSales: Array<{
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const fetchAnalytics = useCallback(async (overridePeriod?: string) => {
    const activePeriod = overridePeriod || period;
    try {
      setIsRefreshing(true);
      setErrorMsg(null);

      const params = new URLSearchParams();
      params.set("period", activePeriod);
      if (activePeriod === "custom" && startDate && endDate) {
        params.set("startDate", startDate);
        params.set("endDate", endDate);
      }

      const res = await fetch(`/api/admin/analytics?${params.toString()}`, {
        credentials: "same-origin",
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        setErrorMsg(`Failed to load analytics metrics (${res.status}).`);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setData(result);
        setLastRefreshedAt(new Date());
      } else {
        setErrorMsg(result.error || "Failed to load analytics metrics.");
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setErrorMsg("Network error occurred while fetching analytics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    fetchAnalytics(newPeriod);
  };

  return (
    <div className="flex flex-col gap-8 text-[#1F1F1F] font-[family-name:var(--font-inter)]">
      {/* Top Header & Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            ADMINISTRATION
          </span>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            Analytics &amp; Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Real-time sales revenue, orders distribution, product performance, and customer metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRefreshedAt && (
            <span className="hidden md:inline text-[11px] text-[#666666]">
              Refreshed: {lastRefreshedAt.toLocaleTimeString()}
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchAnalytics()}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:border-[#A67C52] hover:text-[#A67C52] shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
            <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Date Range Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">
            📅 Select Time Horizon:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "this_month", label: "This Month" },
              { id: "last_month", label: "Last Month" },
              { id: "this_year", label: "This Year" },
              { id: "all", label: "All Time" },
              { id: "custom", label: "Custom Range" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePeriodChange(preset.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  period === preset.id
                    ? "bg-[#A67C52] text-white shadow-xs scale-105"
                    : "bg-[#FAF8F5] text-[#666666] hover:bg-[#E5E5E5] hover:text-[#1F1F1F]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range Inputs */}
        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#E5E5E5] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#666666]">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#666666]">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] text-[#1F1F1F]"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchAnalytics("custom")}
              className="px-4 py-1.5 rounded-xl bg-[#A67C52] text-white font-bold cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      {/* Error Message Display */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button
            type="button"
            onClick={() => fetchAnalytics()}
            className="underline font-bold hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-2xl bg-white border border-[#E5E5E5] animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className={`flex flex-col gap-8 transition-opacity duration-200 ${isRefreshing ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
          {/* SECTION 2: Key Performance Indicators (KPI Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Revenue */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A67C52]">
                Total Revenue
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                ₹{data.kpis.totalRevenue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#16A34A] font-semibold">Paid Transactions</span>
            </div>

            {/* Total Orders */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                Total Orders
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                {data.kpis.totalOrders}
              </span>
              <span className="text-[10px] text-[#666666]">All Placed Orders</span>
            </div>

            {/* Average Order Value */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                Avg Order Value
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                ₹{data.kpis.averageOrderValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#A67C52] font-semibold">Per Paid Checkout</span>
            </div>

            {/* New Customers */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                New Customers
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                {data.kpis.newCustomers}
              </span>
              <span className="text-[10px] text-[#666666]">Registered In Period</span>
            </div>

            {/* Products Sold */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                Units Sold
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1F1F1F]">
                {data.kpis.productsSold}
              </span>
              <span className="text-[10px] text-[#666666]">Items Shipped / Sold</span>
            </div>

            {/* Successful Payments */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col gap-1.5 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
                Paid Orders
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#16A34A]">
                {data.kpis.successfulPayments}
              </span>
              <span className="text-[10px] text-[#16A34A] font-semibold">Completed Orders</span>
            </div>
          </div>

          {/* SECTION 3 & 4: Revenue & Orders Over Time Visualization */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
              <div className="flex flex-col">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Revenue &amp; Orders Trend
                </h2>
                <span className="text-xs text-[#666666]">Daily breakdown over the selected timeframe</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#A67C52]" />
                  <span>Revenue (₹)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span>Total Orders</span>
                </div>
              </div>
            </div>

            {data.timeTrend.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#666666] flex flex-col items-center gap-2">
                <span className="text-2xl">📊</span>
                <span className="font-bold text-[#1F1F1F]">No sales data recorded in this period</span>
                <span>Select a broader time horizon or place test orders to populate analytics.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Visual Bar Graph of Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {data.timeTrend.map((day) => (
                    <div
                      key={day._id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col justify-between gap-2 text-xs hover:border-[#A67C52] transition-all"
                    >
                      <span className="font-bold text-[#666666] text-[11px]">{day._id}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#A67C52]">
                          ₹{day.revenue.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] text-[#1F1F1F]">
                          {day.totalOrders} order(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5 & 10: Order Status Distribution & Inventory Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* SECTION 5: Order Status Distribution */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
                Order Status Distribution
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { name: "Pending", count: data.statusDistribution.Pending, color: "border-amber-400 bg-amber-50 text-amber-900" },
                  { name: "Processing", count: data.statusDistribution.Processing, color: "border-blue-400 bg-blue-50 text-blue-900" },
                  { name: "Shipped", count: data.statusDistribution.Shipped, color: "border-indigo-400 bg-indigo-50 text-indigo-900" },
                  { name: "Delivered", count: data.statusDistribution.Delivered, color: "border-emerald-400 bg-emerald-50 text-emerald-900" },
                  { name: "Cancelled", count: data.statusDistribution.Cancelled, color: "border-rose-400 bg-rose-50 text-rose-900" },
                ].map((st) => (
                  <div
                    key={st.name}
                    className={`p-4 rounded-2xl border flex flex-col gap-1 text-center ${st.color}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{st.name}</span>
                    <span className="font-bold text-2xl">{st.count}</span>
                    <span className="text-[10px] opacity-80">
                      {data.kpis.totalOrders > 0
                        ? `${Math.round((st.count / data.kpis.totalOrders) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 10: Inventory Insight */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  Inventory Insights
                </h2>
                <Link
                  href="/admin/products"
                  className="text-xs font-bold text-[#A67C52] hover:underline"
                >
                  Manage Products →
                </Link>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]">
                  <span className="text-[#666666]">Active Store Products</span>
                  <strong className="text-base text-[#1F1F1F]">
                    {data.inventoryInsights.activeProducts} / {data.inventoryInsights.totalProducts}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="font-medium">Low Stock Products</span>
                  <strong className="text-base text-amber-900">
                    {data.inventoryInsights.lowStockProducts}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <span className="font-medium">Out of Stock Products</span>
                  <strong className="text-base text-rose-900">
                    {data.inventoryInsights.outOfStockProducts}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 & 8 & 9: Top Products, Customer Intelligence & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* SECTION 6: Top Selling Products */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-4 border-b border-[#E5E5E5]">
                Top Selling Products
              </h2>

              {data.topProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#666666]">
                  No product sales recorded in this period.
                </div>
              ) : (
                <div className="flex flex-col gap-3 divide-y divide-[#E5E5E5]">
                  {data.topProducts.map((prod, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                          {prod.image ? (
                            <Image src={prod.image} alt={prod.name} fill sizes="48px" className="object-contain p-1" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-base">🛋️</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1F1F1F] line-clamp-1">{prod.name}</span>
                          <span className="text-xs text-[#666666]">{prod.unitsSold} unit(s) sold</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#A67C52] text-sm sm:text-base shrink-0">
                        ₹{prod.revenue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 8 & 9: Customer & Payment Method Analytics */}
            <div className="flex flex-col gap-8">
              {/* Customer Analytics */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-4">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                  Customer Intelligence
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col">
                    <span className="text-[#666666]">Total Registered</span>
                    <strong className="text-base text-[#1F1F1F] mt-0.5">{data.kpis.totalCustomers}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col">
                    <span className="text-[#666666]">Returning Buyers</span>
                    <strong className="text-base text-[#A67C52] mt-0.5">{data.kpis.returningCustomers}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col col-span-2">
                    <span className="text-[#666666]">Avg Orders Per Customer</span>
                    <strong className="text-base text-[#1F1F1F] mt-0.5">{data.kpis.avgOrdersPerCustomer} orders</strong>
                  </div>
                </div>
              </div>

              {/* Payment Analytics */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-4">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                  Payment Method Performance
                </h2>
                <div className="flex flex-col gap-2.5 text-xs">
                  {data.paymentAnalytics.map((pmt) => (
                    <div key={pmt._id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5] flex justify-between items-center">
                      <div className="flex flex-col">
                        <strong className="text-[#1F1F1F]">{pmt._id}</strong>
                        <span className="text-[#666666]">{pmt.ordersCount} orders</span>
                      </div>
                      <span className="font-bold text-[#A67C52] text-sm">
                        ₹{pmt.paidRevenue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 11: Recent Sales Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Recent Store Orders
              </h2>
              <Link href="/admin/orders" className="text-xs font-bold text-[#A67C52] hover:underline">
                View All Orders →
              </Link>
            </div>

            {data.recentSales.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#666666]">
                No orders found in this time period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] text-[#666666] uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]/60">
                    {data.recentSales.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#1F1F1F]">#{ord.orderNumber}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1F1F1F]">{ord.customerName}</span>
                            <span className="text-[11px] text-[#666666]">{ord.customerEmail}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#A67C52]">
                          ₹{ord.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1F1F1F]">{ord.paymentMethod}</span>{" "}
                          <span className={`text-[11px] font-bold ${ord.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>
                            ({ord.paymentStatus})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ord.orderStatus === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.orderStatus === "Cancelled"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/orders/${ord._id}`}
                            className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#1F1F1F] hover:border-[#A67C52] hover:text-[#A67C52]"
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
