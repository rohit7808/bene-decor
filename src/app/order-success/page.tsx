"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

interface OrderItemData {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderData {
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
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface PageProps {
  searchParams: Promise<{ orderId?: string; orderNumber?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        const targetId = resolvedParams.orderId || resolvedParams.orderNumber;
        if (!targetId) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`/api/orders?id=${encodeURIComponent(targetId)}`);
        const contentType = res.headers.get("content-type") || "";

        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.order) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.error("Fetch order error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [resolvedParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F]">
        <Navbar />
        <Container>
          <div className="py-20 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Confirming your order details...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col items-center max-w-3xl mx-auto gap-8">
            {/* Header Success Celebration */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-sm border border-emerald-200">
                ✓
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A67C52]">
                ORDER CONFIRMED
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
                Thank You for Your Order!
              </h1>
              <p className="text-sm text-[#666666] max-w-md">
                We have received your furniture order and our artisan team is preparing it for fulfillment.
              </p>
            </div>

            {/* Main Order Details Card */}
            {order ? (
              <div className="w-full bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#666666]">Order Number</span>
                    <span className="font-bold text-lg text-[#1F1F1F]">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#666666]">Order Date</span>
                    <span className="font-medium text-sm text-[#1F1F1F]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#666666]">Payment Method</span>
                    <span className="font-semibold text-sm text-[#1F1F1F]">
                      {order.paymentMethod || "Online Payment (Razorpay)"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#666666]">Status</span>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#16A34A]/10 text-[#16A34A]">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Shipping Address Summary */}
                {order.shippingAddress && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/70 flex flex-col gap-1 text-xs sm:text-sm">
                    <span className="font-bold text-[#1F1F1F] text-xs uppercase tracking-wider text-[#A67C52]">
                      Delivery Address
                    </span>
                    <span className="font-bold text-[#1F1F1F] mt-1">
                      {order.shippingAddress.fullName}
                    </span>
                    <span className="text-[#666666]">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </span>
                    <span className="text-[#666666]">Phone: {order.shippingAddress.phone}</span>
                  </div>
                )}

                {/* Ordered Items Table */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                    Items Ordered
                  </span>
                  <div className="divide-y divide-[#E5E5E5]/60 border-t border-b border-[#E5E5E5]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E5E5] shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
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
                        <span className="font-bold text-sm text-[#1F1F1F]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-bold text-base text-[#1F1F1F]">Total Amount Paid/Due:</span>
                  <span className="font-bold text-2xl text-[#1F1F1F]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/orders"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#A67C52] text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-[#8e6843] transition-colors text-center"
              >
                View Order History
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#1F1F1F] bg-white hover:bg-[#FAF8F5] transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
