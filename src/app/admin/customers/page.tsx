"use client";

import React, { useState, useEffect } from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await fetch("/api/admin/customers", { credentials: "same-origin" });
        const data = await res.json();

        if (data.success && data.customers) {
          setCustomers(data.customers);
        } else {
          setErrorMsg(data.error || "Failed to load customer list.");
        }
      } catch (err) {
        console.error("Fetch Customers Error:", err);
        setErrorMsg("An unexpected error occurred while fetching customers.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            View registered homeowner accounts, contact info, and registration dates.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ✕ {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-[#666666] animate-pulse">
                ⏳ Fetching registered customer database...
              </div>
            ) : customers.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#666666]">
                No customer accounts found in database.
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#666666] border-b border-[#E5E5E5]">
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]/60 text-[#1F1F1F]">
                  {customers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1F1F1F]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#A67C52]/10 text-[#A67C52] font-bold flex items-center justify-center text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-[11px] text-[#666666] font-normal font-mono">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-medium text-[#1F1F1F]">{user.email}</span>
                          <span className="text-[#666666]">{user.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#666666]">{user.city}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          user.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#666666]">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
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
