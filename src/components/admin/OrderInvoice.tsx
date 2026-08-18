"use client";

import React from "react";
import Logo from "@/components/ui/Logo";

export interface OrderItem {
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

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderDetail {
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

interface OrderInvoiceProps {
  order: OrderDetail;
}

export default function OrderInvoice({ order }: OrderInvoiceProps) {
  const customerName = order.shippingAddress?.fullName || "Valued Customer";
  const email = order.shippingAddress?.email || "N/A";
  const phone = order.shippingAddress?.phone || "N/A";

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isPaid = order.paymentStatus === "Paid";

  return (
    <div className="invoice-container bg-white text-[#1F1F1F] font-sans p-6 max-w-[210mm] mx-auto text-xs leading-normal leading-snug">
      {/* 1. HEADER SECTION */}
      <div className="flex items-start justify-between pb-4 border-b-2 border-[#A67C52]">
        <div className="flex items-center gap-3">
          <Logo width={48} height={48} />
          <div className="flex flex-col">
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl tracking-wider text-[#1F1F1F]">
              BENÉ DECOR
            </h1>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#A67C52] uppercase">
              Handcrafted Solid Wood Furniture
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[#1F1F1F] tracking-wide">
            TAX INVOICE
          </span>
          <span className="font-mono font-bold text-xs text-[#A67C52] mt-0.5">
            Invoice #: INV-{order.orderNumber}
          </span>
          <span className="text-[11px] text-[#666666] mt-0.5">Date: {formattedDate}</span>
        </div>
      </div>

      {/* 2. BUSINESS DETAILS */}
      <div className="py-3 border-b border-[#E5E5E5] flex justify-between items-center text-[11px] text-[#555555]">
        <div>
          <strong className="text-[#1F1F1F]">BenéDecor Furnishings Pvt Ltd</strong> | Premium Artisan Solid Wood Furniture
        </div>
        <div className="text-right">
          Website: <span className="font-semibold text-[#1F1F1F]">www.benedecor.in</span> | Support: <span className="font-semibold text-[#1F1F1F]">marketing@benedecor.in</span>
        </div>
      </div>

      {/* 3. BILL TO / SHIP TO & ORDER METADATA */}
      <div className="grid grid-cols-2 gap-6 my-4">
        {/* Bill To / Ship To Column */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E5E5]/70 flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-[#A67C52] uppercase">
            BILLED &amp; SHIPPED TO
          </span>
          <strong className="text-sm text-[#1F1F1F] mt-0.5">{customerName}</strong>
          <span className="text-[#444444]">
            {order.shippingAddress?.address || "N/A"}
          </span>
          <span className="text-[#444444]">
            {order.shippingAddress?.city || "City"}, {order.shippingAddress?.state || "State"} - {order.shippingAddress?.postalCode || "PIN"}
          </span>
          <span className="text-[#444444] mt-1 font-mono text-[11px]">
            📞 {phone} | ✉️ {email}
          </span>
        </div>

        {/* Order Details Column */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E5E5]/70 flex flex-col gap-2 justify-between">
          <div className="flex justify-between items-center pb-1 border-b border-[#E5E5E5]">
            <span className="text-[11px] text-[#666666]">Order Number:</span>
            <strong className="font-mono text-xs text-[#1F1F1F]">#{order.orderNumber}</strong>
          </div>
          <div className="flex justify-between items-center pb-1 border-b border-[#E5E5E5]">
            <span className="text-[11px] text-[#666666]">Payment Method:</span>
            <span className="font-semibold text-[#1F1F1F]">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center pb-1 border-b border-[#E5E5E5]">
            <span className="text-[11px] text-[#666666]">Payment Status:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isPaid
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              {isPaid ? "PAID" : order.paymentStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#666666]">Fulfillment Status:</span>
            <span className="font-bold text-[#A67C52]">{order.orderStatus}</span>
          </div>
        </div>
      </div>

      {/* 4. ITEMIZED PRODUCTS TABLE */}
      <div className="my-4 overflow-hidden rounded-xl border border-[#E5E5E5]">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] text-[#555555] font-bold border-b border-[#E5E5E5]">
              <th className="py-2.5 px-3 w-12 text-center">S.No</th>
              <th className="py-2.5 px-3">Product Description</th>
              <th className="py-2.5 px-3 text-center w-16">Qty</th>
              <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
              <th className="py-2.5 px-3 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#1F1F1F]">
            {order.items?.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#FAF8F5]/40">
                <td className="py-2.5 px-3 text-center font-mono text-[#666666]">{idx + 1}</td>
                <td className="py-2.5 px-3 font-semibold text-[#1F1F1F]">{item.name}</td>
                <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                <td className="py-2.5 px-3 text-right font-mono">
                  ₹{(item.price || 0).toLocaleString("en-IN")}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. SUMMARY TOTALS & PAYMENT AUDIT */}
      <div className="grid grid-cols-2 gap-6 my-4 items-start">
        {/* Payment / Tracking Audit Info */}
        <div className="flex flex-col gap-2 text-[10px] text-[#555555]">
          {order.razorpayPaymentId && (
            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col gap-0.5 font-mono">
              <span className="text-[#A67C52] font-bold">Razorpay Audit:</span>
              <span>Order ID: {order.razorpayOrderId || "N/A"}</span>
              <span>Payment ID: {order.razorpayPaymentId}</span>
            </div>
          )}

          {order.trackingId && (
            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] flex flex-col gap-0.5 font-mono">
              <span className="text-[#A67C52] font-bold">Courier Tracking:</span>
              <span>Tracking ID: {order.trackingId}</span>
            </div>
          )}
        </div>

        {/* Totals Table */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E5E5]">
          <div className="flex justify-between items-center text-xs text-[#555555]">
            <span>Subtotal</span>
            <span className="font-mono">
              ₹{(order.subtotal || order.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#555555]">
            <span>Delivery &amp; Freight Charge</span>
            <span className="text-emerald-700 font-bold">FREE</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t-2 border-[#A67C52] text-sm font-bold text-[#1F1F1F]">
            <span>{isPaid ? "TOTAL PAID" : "TOTAL PAYABLE"}</span>
            <span className="font-mono text-base text-[#A67C52]">
              ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 6. FOOTER & DISCLAIMER */}
      <div className="pt-4 border-t border-[#E5E5E5] flex flex-col items-center text-center gap-1 text-[10px] text-[#777777] mt-6">
        <p className="font-semibold text-[#1F1F1F]">
          Thank you for choosing BenéDecor Handcrafted Solid Wood Furniture.
        </p>
        <p>
          For queries or assistance, contact BenéDecor Concierge at{" "}
          <strong className="text-[#1F1F1F]">marketing@benedecor.in</strong> |{" "}
          <strong className="text-[#1F1F1F]">www.benedecor.in</strong>
        </p>
        <p className="italic text-[9px] text-[#888888] mt-2">
          This is a computer-generated tax invoice and does not require a physical signature.
        </p>
      </div>
    </div>
  );
}
