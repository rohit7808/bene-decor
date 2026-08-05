"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface Review {
  id: number;
  name: string;
  city: string;
  product: string;
  rating: number;
  date: string;
  initials: string;
  reviewText: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ananya Roy",
    city: "Mumbai, Maharashtra",
    product: "Bene Decor Aldric Wooden Sofa",
    rating: 5,
    date: "July 24, 2026",
    initials: "AR",
    reviewText:
      "The Aldric Wooden Sofa exceeded our expectations! The solid teak wood frame has a gorgeous grain finish and the high-density velvet cushioning offers exceptional lumbar support. The white-glove installation team was extremely polite and punctual.",
  },
  {
    id: 2,
    name: "Vikram Malhotra",
    city: "New Delhi",
    product: "The Sterling Tufted Accent Chair",
    rating: 5,
    date: "July 18, 2026",
    initials: "VM",
    reviewText:
      "Stunning craftsmanship. The diamond tufting and solid oak legs give our reading corner a regal atmosphere. Customer support answered all my customization questions before purchase.",
  },
  {
    id: 3,
    name: "Priya & Siddharth Iyer",
    city: "Bengaluru, Karnataka",
    product: "Sheesham Wood Shoe Rack with Cushion",
    rating: 5,
    date: "July 10, 2026",
    initials: "PI",
    reviewText:
      "Highly functional and elegantly built. The seasoned Sheesham wood polish matches our entryway decor perfectly, and the cushioned seat makes wearing shoes so comfortable.",
  },
  {
    id: 4,
    name: "Dr. Kavita Reddy",
    city: "Hyderabad, Telangana",
    product: "Printed Cotton Ottoman Pouffe",
    rating: 5,
    date: "June 29, 2026",
    initials: "KR",
    reviewText:
      "Beautiful hand-printed upholstery with solid teak wooden legs. It adds such a vibrant Indian ethnic charm to our living room lounge.",
  },
  {
    id: 5,
    name: "Aditya & Neha Mehta",
    city: "Jaipur, Rajasthan",
    product: "Custom Solid Teak Dining Set",
    rating: 5,
    date: "June 15, 2026",
    initials: "AM",
    reviewText:
      "Being local to Jaipur, we visited the Bené Decor flagship studio. The custom polish and fabric customization process was seamless. Truly heirloom quality furniture!",
  },
  {
    id: 6,
    name: "Rohan Deshmukh",
    city: "Pune, Maharashtra",
    product: "Aldric Wooden Sofa & Accent Chairs",
    rating: 5,
    date: "June 02, 2026",
    initials: "RD",
    reviewText:
      "From order placement to white-glove installation in Pune, everything was flawless. The wood quality is 100% genuine solid teak, heavy and sturdy.",
  },
];

const VIDEO_REVIEWS = [
  {
    id: 1,
    title: "Touring the Malhotra Villa with Béné Decor Living Collection",
    customer: "Vikram & Sunita Malhotra",
    city: "New Delhi",
    thumbnail: "/images/collections/sofa.jpeg",
  },
  {
    id: 2,
    title: "Styling Compact Urban Apartments with Handcrafted Wood",
    customer: "Ananya Roy",
    city: "Mumbai",
    thumbnail: "/images/collections/dining.jpeg",
  },
  {
    id: 3,
    title: "Inside a Custom Heritage Villa in Rajasthan",
    customer: "The Singhania Residence",
    city: "Jaipur",
    thumbnail: "/images/collections/bed.jpeg",
  },
];

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "98%", label: "Repeat Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "15+", label: "Years Experience" },
];

export default function TestimonialsPage() {
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-10">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              VERIFIED HOMEOWNER REVIEWS
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              What Our Customers Say
            </h1>
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-[640px]">
              Thousands of happy homeowners trust Bene Decor for handcrafted luxury furniture.
            </p>
          </div>

          {/* Overall Rating Banner */}
          <div className="max-w-2xl mx-auto bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E5E5E5]/80 text-center flex flex-col items-center gap-3 shadow-sm mb-16">
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl text-[#A67C52]">
              ★★★★★
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              4.9 / 5 Average Rating
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#666666]">
              Based on <strong className="text-[#1F1F1F]">2,500+ verified customer reviews</strong> across India
            </p>
          </div>

          {/* Featured Reviews Grid (6 Cards) */}
          <div className="flex flex-col gap-4 mb-8">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
              Homeowner Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 gap-6"
              >
                <div className="flex flex-col gap-4">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#A67C52] text-sm tracking-wider">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      {review.date}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed italic">
                    "{review.reviewText}"
                  </p>
                </div>

                {/* Customer Details & Product Badge */}
                <div className="pt-4 border-t border-[#E5E5E5]/60 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#A67C52] text-white flex items-center justify-center font-bold text-base shadow-sm border border-white ring-2 ring-[#A67C52]/20">
                    {review.initials}
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="font-[family-name:var(--font-playfair)] font-bold text-sm text-[#1F1F1F]">
                      {review.name}
                    </h3>
                    <span className="text-[11px] text-[#666666]">
                      {review.city}
                    </span>
                    <span className="text-[11px] font-semibold text-[#A67C52] mt-0.5 line-clamp-1">
                      Purchased: {review.product}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Review Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-3 mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              VIDEO HIGHLIGHTS
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
              Home Transformation Videos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {VIDEO_REVIEWS.map((video) => (
              <div
                key={video.id}
                className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                onClick={() =>
                  setPlayingVideoId(playingVideoId === video.id ? null : video.id)
                }
              >
                <div className="relative h-[280px] w-full overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md text-[#A67C52] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pl-1">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title & Customer Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col gap-1">
                    <span className="text-xs text-[#A67C52] font-semibold uppercase tracking-wider">
                      Verified Home Tour
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] font-bold text-sm text-white line-clamp-2">
                      {video.title}
                    </h3>
                    <span className="text-[11px] text-zinc-300">
                      {video.customer} • {video.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Section (4 KPI Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 gap-2"
              >
                <span className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#1F1F1F] to-[#2D2D2D] text-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center gap-6 shadow-xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold">
              Join Thousands of Happy Customers
            </h2>
            <p className="text-base text-zinc-300 max-w-md">
              Elevate your home with solid wood teak sofa sets, handcrafted dining furniture, and luxury decor.
            </p>
            <Link href="/shop" className="mt-2">
              <Button variant="primary" size="lg" className="py-4 px-8 text-base">
                Shop Collection
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
