"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { PRODUCTS_DATA, Product } from "@/data/products";

interface OrderItem {
  orderId: string;
  orderDate: string;
  deliveryStatus: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  paymentStatus: "Paid" | "Refunded";
  quantity: number;
  product: Product;
}

export default function OrdersPage() {
  // 4 Demo Orders using existing furniture products
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      orderId: "#BD849201",
      orderDate: "August 1, 2026",
      deliveryStatus: "Processing",
      paymentStatus: "Paid",
      quantity: 1,
      product: PRODUCTS_DATA[0], // Bene Decor Aldric Wooden Sofa
    },
    {
      orderId: "#BD739182",
      orderDate: "July 28, 2026",
      deliveryStatus: "Shipped",
      paymentStatus: "Paid",
      quantity: 2,
      product: PRODUCTS_DATA[1], // Printed Cotton Ottoman Pouffe
    },
    {
      orderId: "#BD628194",
      orderDate: "July 15, 2026",
      deliveryStatus: "Delivered",
      paymentStatus: "Paid",
      quantity: 1,
      product: PRODUCTS_DATA[2], // Sheesham Wood Shoe Rack
    },
    {
      orderId: "#BD510295",
      orderDate: "June 10, 2026",
      deliveryStatus: "Cancelled",
      paymentStatus: "Refunded",
      quantity: 1,
      product: PRODUCTS_DATA[3], // The Sterling Tufted Accent Chair
    },
  ]);

  const getStatusBadgeClass = (status: OrderItem["deliveryStatus"]) => {
    switch (status) {
      case "Delivered":
        return "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              ORDER HISTORY
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              My Orders
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Track, manage and review your handcrafted furniture orders.
            </p>
          </div>

          {/* Orders List / Empty State */}
          {orders.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 my-8 shadow-sm max-w-2xl mx-auto gap-5">
              <div className="p-6 rounded-full bg-white border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                No Orders Yet
              </h2>

              <p className="text-base text-[#666666] max-w-md leading-relaxed">
                Looks like you haven't placed any furniture orders yet.
              </p>

              <Link href="/" className="mt-2">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              {/* Order Counter & Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#666666]">
                  Showing <strong>{orders.length}</strong> total orders
                </span>
                <button
                  type="button"
                  onClick={() => setOrders([])}
                  className="text-xs font-semibold uppercase tracking-wider text-[#666666] hover:text-red-600 transition-colors"
                >
                  Clear Demo History
                </button>
              </div>

              {/* Order Cards List */}
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="group flex flex-col rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    {/* Card Top Header Bar */}
                    <div className="flex flex-wrap items-center justify-between p-4 sm:px-6 bg-[#FAF8F5] border-b border-[#E5E5E5]/70 gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <div>
                          <span className="text-[#666666] block text-[11px] uppercase tracking-wider">
                            Order Placed
                          </span>
                          <span className="font-semibold text-[#1F1F1F]">
                            {order.orderDate}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#666666] block text-[11px] uppercase tracking-wider">
                            Order ID
                          </span>
                          <span className="font-bold text-[#1F1F1F] tracking-wider">
                            {order.orderId}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#666666] block text-[11px] uppercase tracking-wider">
                            Payment Status
                          </span>
                          <span className="font-semibold text-[#16A34A]">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          order.deliveryStatus
                        )}`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-5 sm:p-6 gap-6">
                      {/* Product Image & Information */}
                      <div className="flex items-center gap-4 flex-1">
                        <Link
                          href={`/product/${order.product.id}`}
                          className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-200/80 border border-[#E5E5E5]"
                        >
                          <Image
                            src={order.product.image}
                            alt={order.product.name}
                            fill
                            sizes="120px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </Link>

                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                            {order.product.category}
                          </span>

                          <Link
                            href={`/product/${order.product.id}`}
                            className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F] hover:text-[#A67C52] transition-colors line-clamp-1"
                          >
                            {order.product.name}
                          </Link>

                          <div className="flex items-center gap-3 text-xs text-[#666666] mt-0.5">
                            <span>Qty: <strong>{order.quantity}</strong></span>
                            <span>•</span>
                            <span className="font-bold text-sm text-[#1F1F1F]">
                              {order.product.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap md:flex-col items-stretch justify-end gap-2.5 min-w-[160px] pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E5E5]/60">
                        <Link href={`/product/${order.product.id}`}>
                          <Button variant="primary" size="sm" className="w-full">
                            Buy Again
                          </Button>
                        </Link>

                        <Button variant="outline" size="sm" className="w-full">
                          Track Order
                        </Button>

                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
