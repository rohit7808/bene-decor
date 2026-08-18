"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ShowroomMapPreview from "@/components/common/ShowroomMapPreview";

interface Store {
  id: number;
  name: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  rating: number;
  image: string;
}

const STORES: Store[] = [
  {
    id: 1,
    name: "Bene Decor Furniture",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302022",
    address: "Tonk Road, Near Chokhi Dhani, Sitapura, Jaipur, Rajasthan - 302022",
    phone: "+91 9928348586",
    email: "saadgifurniture@gmail.com",
    hours: "Monday – Saturday: 10:00 AM – 7:00 PM",
    rating: 5,
    image: "/images/collections/sofa.jpg",
  },
];

const SERVICES = [
  {
    icon: "🛋️",
    title: "Free Interior Consultation",
    description:
      "Meet our senior interior design specialists in-person for 3D room planning and fabric selection.",
  },
  {
    icon: "🅿️",
    title: "Valet Parking Available",
    description:
      "Enjoy hassle-free complimentary valet parking at our flagship Jaipur showroom location.",
  },
  {
    icon: "♿",
    title: "Wheelchair Accessible",
    description:
      "Features step-free entrances, wide aisles, and fully accessible showroom amenities.",
  },
  {
    icon: "🚚",
    title: "Home Delivery Support",
    description:
      "Direct showroom order routing with complimentary white-glove assembly in your home.",
  },
];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const store = STORES[0];

  // Filter single store based on search query
  const matchesSearch = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      store.city.toLowerCase().includes(term) ||
      store.pincode.includes(term) ||
      store.name.toLowerCase().includes(term) ||
      store.address.toLowerCase().includes(term) ||
      store.state.toLowerCase().includes(term)
    );
  }, [searchQuery, store]);

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      {/* Full-Width Premium Hero Banner (Height: 550px) */}
      <section className="relative w-full h-[550px] flex items-center justify-center overflow-hidden bg-zinc-900">
        <Image
          src="/images/Banner.jpeg"
          alt="Bene Decor Jaipur Showroom Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />

        {/* Vertically & Horizontally Centered Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-[840px] mx-auto flex flex-col items-center justify-center gap-5 h-full">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52] bg-white/95 px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm">
            FLAGSHIP SHOWROOM
          </span>

          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-md">
            Visit Bene Decor Jaipur Showroom
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-[640px] drop-shadow">
            Experience premium handcrafted furniture and interior solutions at our flagship showroom in Jaipur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full sm:w-auto">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                store.name + " " + store.address
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" className="w-full sm:w-auto py-3.5 px-8">
                Get Directions
              </Button>
            </a>

            <a
              href={`tel:${store.phone.replace(/\s+/g, "")}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto py-3.5 px-8 bg-white/10 backdrop-blur-md text-white border-white/70 hover:bg-white hover:text-[#1F1F1F]"
              >
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <main className="py-10 sm:py-16">
        <Container>
          {/* Search Section */}
          <div className="flex items-center justify-center p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5]/80 shadow-sm mb-12 max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by city or pincode (e.g. Jaipur, 302022)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E5E5] text-xs sm:text-sm text-[#1F1F1F] bg-white focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
              />
              <svg
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>

          {/* Single Centered Showroom Card (Max Width ~500px) */}
          <div className="mb-20">
            {!matchesSearch ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5] text-center gap-4 max-w-md mx-auto">
                <span className="text-4xl">📍</span>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                  No Showroom Found
                </h3>
                <p className="text-sm text-[#666666]">
                  Try searching for "Jaipur" or "302022" to locate our flagship studio.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search
                </Button>
              </div>
            ) : (
              <div className="max-w-[500px] mx-auto">
                <div className="group flex flex-col rounded-3xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {/* Showroom Image */}
                  <div className="relative h-[260px] sm:h-[290px] w-full overflow-hidden bg-zinc-200">
                    <Image
                      src={store.image}
                      alt={store.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 500px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/95 backdrop-blur-sm text-[#A67C52] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm border border-[#E5E5E5]">
                        {store.city}, {store.state}
                      </span>
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="flex flex-col p-6 sm:p-7 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-[#A67C52]">
                        <span>{"★".repeat(store.rating)}</span>
                        <span className="text-[#666666] font-semibold text-xs ml-1">
                          (5.0 Verified)
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full">
                        ✓ Open Today
                      </span>
                    </div>

                    <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors">
                      {store.name}
                    </h2>

                    <div className="flex flex-col gap-2 text-sm text-[#666666]">
                      <p className="leading-relaxed flex items-start gap-2">
                        <span className="text-base shrink-0">📍</span>
                        <span>{store.address}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="text-base shrink-0">🕒</span>
                        <span>{store.hours}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="text-base shrink-0">📞</span>
                        <a
                          href={`tel:${store.phone.replace(/\s+/g, "")}`}
                          className="font-semibold text-[#1F1F1F] hover:text-[#A67C52] transition-colors"
                        >
                          {store.phone}
                        </a>
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="text-base shrink-0">📧</span>
                        <a
                          href={`mailto:${store.email}`}
                          className="font-semibold text-[#1F1F1F] hover:text-[#A67C52] transition-colors"
                        >
                          {store.email}
                        </a>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#E5E5E5]/60 flex flex-col sm:flex-row gap-3">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          store.name + " " + store.address
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" size="md" className="w-full">
                          Get Directions ↗
                        </Button>
                      </a>

                      <a
                        href={`tel:${store.phone.replace(/\s+/g, "")}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="md" className="w-full">
                          Call Now
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Google Map Location Section */}
          <ShowroomMapPreview
            title={store.name}
            subtitle="SHOWROOM LOCATION"
            address={store.address}
            hours={`Open Today (${store.hours})`}
            className="mb-20"
          />

          {/* Showroom Services Section (4 Cards) */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              IN-STORE AMENITIES
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
              What Our Showroom Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {SERVICES.map((srv, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
              >
                <span className="text-3xl">{srv.icon}</span>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {srv.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#1F1F1F] to-[#2D2D2D] text-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center gap-6 shadow-xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold">
              Can't Visit a Store?
            </h2>
            <p className="text-base text-zinc-300 max-w-md">
              Connect with our senior interior design consultants via video call from the comfort of your home.
            </p>
            <Link href="/contact" className="mt-2">
              <Button variant="primary" size="lg" className="py-4 px-8 text-base">
                Book Virtual Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
