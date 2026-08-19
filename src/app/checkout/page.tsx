"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoading: isCartLoading } = useCart();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Payment Method State ("Razorpay" by default - COD removed)
  const [paymentMethod] = useState<"Razorpay" | "online">("Razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Geolocation State
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Detect Current Location & Reverse Geocode Address
  const handleDetectLocation = () => {
    setLocationError(null);
    setLocationSuccess(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please enter your address manually.");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setDetectedCoords({ lat: latitude, lng: longitude });

        let street = "";
        let city = "";
        let state = "";
        let pincode = "";
        let country = "India";

        try {
          const mapKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
          if (mapKey) {
            const geoRes = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapKey}`
            );
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results[0]) {
              street = geoData.results[0].formatted_address;
              for (const comp of geoData.results[0].address_components) {
                if (comp.types.includes("locality")) city = comp.long_name;
                if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
                if (comp.types.includes("postal_code")) pincode = comp.long_name;
                if (comp.types.includes("country")) country = comp.long_name;
              }
            }
          }

          if (!street) {
            // Fallback 1: BigDataCloud Reverse Geocoding
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const bdcData = await bdcRes.json();
              city = bdcData.city || bdcData.locality || bdcData.principalSubdivision || "";
              state = bdcData.principalSubdivision || "";
              country = bdcData.countryName || "India";
              pincode = bdcData.postcode || "";

              const streetParts = [
                bdcData.locality,
                bdcData.localityInfo?.informative?.[0]?.name,
                bdcData.city,
              ].filter(Boolean);
              if (streetParts.length > 0) {
                street = Array.from(new Set(streetParts)).join(", ");
              }
            }
          }

          if (!street) {
            // Fallback 2: OpenStreetMap Nominatim
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              const addr = nomData.address || {};
              street = nomData.display_name || "";
              city = addr.city || addr.town || addr.village || addr.suburb || city;
              state = addr.state || state;
              pincode = addr.postcode || pincode;
              country = addr.country || country;
            }
          }

          if (street || city || state) {
            setShippingAddress((prev) => ({
              ...prev,
              address: street || prev.address,
              city: city || prev.city,
              state: state || prev.state,
              postalCode: pincode || prev.postalCode,
              country: country || prev.country || "India",
            }));
            setLocationSuccess("✓ Address automatically updated from your location!");
          } else {
            setLocationError("Address could not be detected. Please enter it manually.");
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setLocationError("Address could not be detected. Please enter it manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please enter your address manually.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError("Unable to detect your location. Please try again.");
        } else if (err.code === err.TIMEOUT) {
          setLocationError("Unable to detect your location. Request timed out. Please try again.");
        } else {
          setLocationError("Unable to detect your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Pre-load Razorpay script and auto-fill saved address from /api/user/addresses
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setIsRazorpayLoaded(true);
    }

    async function loadSavedAddresses() {
      try {
        const res = await fetch("/api/user/addresses", { credentials: "same-origin" });
        const contentType = res.headers.get("content-type") || "";
        const data = res.ok && contentType.includes("application/json") ? await res.json() : null;

        if (data?.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
          const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          setShippingAddress((prev) => ({
            ...prev,
            fullName: defaultAddr.fullName || prev.fullName,
            phone: defaultAddr.phone || prev.phone,
            address: defaultAddr.street || prev.address,
            city: defaultAddr.city || prev.city,
            state: defaultAddr.state || prev.state,
            postalCode: defaultAddr.pincode || prev.postalCode,
            country: defaultAddr.country || "India",
          }));
        }
      } catch (err) {
        console.error("Load saved checkout addresses error:", err);
      }
    }

    loadSavedAddresses();
  }, []);

  // Pre-fill user name and email from authenticated user context
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Check Authentication FIRST
    if (!isAuthenticated || !user) {
      setErrorMsg("Please login to place your order.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (cart.items.length === 0) {
      setErrorMsg("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.address.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.postalCode.trim()
    ) {
      setErrorMsg("Please fill in all required shipping address fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // 1. Create MongoDB Order first
      const payload = {
        items: cart.items,
        shippingAddress,
        paymentMethod,
        subtotal: cart.subtotal,
        totalAmount: cart.subtotal,
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      if (orderRes.status === 401) {
        setErrorMsg("Please login to place your order.");
        setIsSubmitting(false);
        router.push("/login?redirect=/checkout");
        return;
      }

      const orderContentType = orderRes.headers.get("content-type") || "";
      if (!orderContentType.includes("application/json")) {
        setErrorMsg(`Server returned non-JSON response (${orderRes.status}).`);
        setIsSubmitting(false);
        return;
      }

      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.order) {
        setErrorMsg(orderData.error || "Failed to create order document.");
        setIsSubmitting(false);
        return;
      }

      const mongoOrder = orderData.order;

      // 2. Handle Online Payment (Razorpay Test Mode) Flow
      const pmtRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cart.subtotal,
          receipt: `rcpt_${mongoOrder.orderNumber}`,
        }),
      });

      const pmtContentType = pmtRes.headers.get("content-type") || "";
      if (!pmtContentType.includes("application/json")) {
        setErrorMsg("Failed to initialize Razorpay checkout. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const pmtData = await pmtRes.json();

      if (!pmtData.success || !pmtData.order_id) {
        setErrorMsg(
          pmtData.error || "Failed to initialize Razorpay checkout. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

        if (typeof window === "undefined" || !window.Razorpay) {
          setErrorMsg("Razorpay SDK is loading. Please click Confirm & Place Order again.");
          setIsSubmitting(false);
          return;
        }

        // Configure Razorpay Modal Options
        const options = {
          key: pmtData.key_id,
          amount: pmtData.amount,
          currency: pmtData.currency || "INR",
          name: "Bené Decor",
          description: "Luxury Handcrafted Furniture Purchase",
          image: "/images/Banner.jpeg",
          order_id: pmtData.order_id,
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email || "customer@benedecor.com",
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#A67C52",
          },
          handler: async function (response: any) {
            try {
              setIsSubmitting(true);
              // Verify Razorpay Payment Signature
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: mongoOrder._id,
                }),
              });

              const verifyContentType = verifyRes.headers.get("content-type") || "";
              if (!verifyContentType.includes("application/json")) {
                setErrorMsg("Payment verification failed. Please contact support.");
                setIsSubmitting(false);
                return;
              }

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                await clearCart();
                const targetId = mongoOrder._id || mongoOrder.orderNumber;
                router.push(
                  `/order-success?orderId=${encodeURIComponent(targetId)}&orderNumber=${encodeURIComponent(mongoOrder.orderNumber)}`
                );
              } else {
                setErrorMsg(
                  verifyData.error || "Payment verification failed. Please contact support."
                );
              }
            } catch (vErr) {
              console.error("Verification error:", vErr);
              setErrorMsg("Payment verification encountered an unexpected error.");
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              setErrorMsg("Payment process was cancelled. You can retry payment whenever you are ready.");
            },
          },
        };

        const razorpayPopup = new window.Razorpay(options);
        razorpayPopup.on("payment.failed", function (response: any) {
          console.error("Razorpay Payment Failed:", response.error);
          setIsSubmitting(false);
          setErrorMsg(`Payment failed: ${response.error.description || "Transaction declined."}`);
        });

        razorpayPopup.open();
    } catch (err) {
      console.error("Order submission error:", err);
      setErrorMsg("An error occurred while connecting to the checkout service.");
      setIsSubmitting(false);
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-white text-[#1F1F1F]">
        <Navbar />
        <Container>
          <div className="py-20 text-center text-sm text-[#666666] animate-pulse">
            ⏳ Loading checkout details...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F]">
      {/* Razorpay Test Mode Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Page Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-10">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              LUXURY CHECKOUT
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Secure Order Placement
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[600px]">
              Provide your delivery address and confirm your payment method.
            </p>
          </div>

          {!isAuthLoading && !isAuthenticated && (
            <div className="max-w-4xl mx-auto mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                  🔒
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-bold text-sm sm:text-base text-[#1F1F1F]">
                    Please login to place your order.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666]">
                    You must be logged in to your Béné Decor account to place an order.
                  </p>
                </div>
              </div>
              <Link href="/login?redirect=/checkout" className="shrink-0 w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto font-bold px-6 py-2.5 shadow-sm cursor-pointer">
                  Login to Place Order →
                </Button>
              </Link>
            </div>
          )}

          {errorMsg && (
            <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold animate-[fadeIn_0.2s_ease-out]">
              ✕ {errorMsg}
            </div>
          )}

          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-[#E5E5E5] text-center gap-4 max-w-lg mx-auto shadow-sm">
              <span className="text-4xl">🛒</span>
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                Your Cart is Empty
              </h3>
              <p className="text-sm text-[#666666]">
                Add your favorite furniture pieces to your cart before proceeding to checkout.
              </p>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Explore Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
              {/* Left Column: Address Form & Payment Handler (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* 1. Shipping Address Section */}
                <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 sm:p-8 shadow-sm flex flex-col gap-5">
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5] flex items-center justify-between">
                    <span>1. Delivery Address</span>
                    <span className="text-xs text-[#A67C52] font-normal uppercase tracking-wider">
                      Required
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#1F1F1F]">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Vikramaditya Sharma"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        placeholder="vikram@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-xs font-bold text-[#1F1F1F]">
                          Street Address / Landmark <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={isDetectingLocation}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#A67C52]/10 hover:bg-[#A67C52]/20 text-[#A67C52] border border-[#A67C52]/30 text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          {isDetectingLocation ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-[#A67C52] border-t-transparent rounded-full animate-spin" />
                              <span>📍 Detecting your location...</span>
                            </>
                          ) : (
                            <>
                              <span>📍 Use Current Location</span>
                            </>
                          )}
                        </button>
                      </div>

                      <textarea
                        name="address"
                        rows={2}
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        placeholder="House / Flat No., Colony, Street, Landmark"
                        required
                        className="w-full p-3.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />

                      {/* Location Error Feedback */}
                      {locationError && (
                        <div className="mt-1 text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                          ✕ {locationError}
                        </div>
                      )}

                      {/* Location Success Feedback */}
                      {locationSuccess && (
                        <div className="mt-1 text-xs font-semibold text-[#16A34A] bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                          {locationSuccess}
                        </div>
                      )}

                      {/* Map Preview with Marker */}
                      {detectedCoords && (
                        <div className="mt-2 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5E5E5] flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#1F1F1F]">
                            <span>📍 Location Pin ({detectedCoords.lat.toFixed(4)}, {detectedCoords.lng.toFixed(4)})</span>
                            <span className="text-[#16A34A] font-bold">✓ Location Pin Set</span>
                          </div>
                          <div className="relative h-40 w-full rounded-xl overflow-hidden border border-[#E5E5E5] shadow-inner">
                            <iframe
                              title="Current Location Map Preview"
                              width="100%"
                              height="100%"
                              className="border-0"
                              loading="lazy"
                              src={`https://maps.google.com/maps?q=${detectedCoords.lat},${detectedCoords.lng}&z=15&ie=UTF8&iwloc=&output=embed`}
                            />
                          </div>
                          <p className="text-[11px] text-[#666666]">
                            Review and manually edit any address fields if required before placing your order.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Jaipur"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Rajasthan"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">
                        PIN / Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        placeholder="302001"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5] focus:outline-none focus:border-[#A67C52]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1F1F1F]">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Section */}
                <div className="bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5] flex items-center justify-between">
                    <span>2. Payment Method</span>
                    <span className="text-xs text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2.5 py-1 rounded-full">
                      ✓ 100% Secure Checkout
                    </span>
                  </h2>

                  <div className="flex flex-col gap-3">
                    {/* Razorpay Online Payment Option (Only Payment Method) */}
                    <label className="flex items-center justify-between p-4 rounded-xl border-2 border-[#A67C52] bg-[#A67C52]/5 ring-1 ring-[#A67C52] cursor-default shadow-xs">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={true}
                          readOnly
                          className="w-4 h-4 accent-[#A67C52]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#1F1F1F]">
                            Online Payment (Razorpay) 💳
                          </span>
                          <span className="text-xs text-[#666666]">
                            Credit/Debit Cards, UPI, NetBanking &amp; Wallet
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        Test Mode
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items Summary & Submit (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E5E5]/80 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] pb-3 border-b border-[#E5E5E5]">
                  Order Items ({cart.totalItems})
                </h2>

                {/* Items List */}
                <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 border-b border-[#E5E5E5]/60 pb-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E5E5E5]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-[#1F1F1F] truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#666666]">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-[#1F1F1F]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Math */}
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#666666] pt-2 border-t border-[#E5E5E5]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1F1F1F]">
                      ₹{cart.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#16A34A]">
                    <span>Home Delivery Charge</span>
                    <span className="font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated GST (18%)</span>
                    <span className="font-medium text-[#1F1F1F]">Included</span>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-baseline justify-between">
                    <span className="font-bold text-base text-[#1F1F1F]">Total Amount</span>
                    <span className="font-bold text-2xl text-[#1F1F1F]">
                      ₹{cart.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-sm font-bold py-3.5 shadow-md cursor-pointer"
                >
                  {isSubmitting
                    ? "Processing Order..."
                    : paymentMethod === "Razorpay"
                    ? "Proceed to Razorpay Payment →"
                    : "Confirm & Place Order →"}
                </Button>

                <p className="text-[11px] text-[#666666] text-center">
                  By placing this order, you agree to Bené Decor's terms of service and shipping policies.
                </p>
              </div>
            </form>
          )}
        </Container>
      </main>
    </div>
  );
}
