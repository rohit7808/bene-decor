"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const COLLECTIONS = [
  {
    id: "living-room",
    name: "Living Room Collection",
    category: "LIVING ROOM",
    image: "/images/collections/sofa.jpeg",
    description: "Plush velvet sofas, solid teak wooden frames, and hand-carved accent tables designed for warm, sophisticated living spaces.",
    itemCount: "12+ Handcrafted Designs",
  },
  {
    id: "dining",
    name: "Dining Room Collection",
    category: "DINING",
    image: "/images/collections/dining.jpeg",
    description: "Solid oak dining tables, tufted leather chairs, and handcrafted ottoman pouffes created for memorable family gatherings.",
    itemCount: "8+ Artisanal Pieces",
  },
  {
    id: "bedroom",
    name: "Luxury Bedroom Collection",
    category: "BEDROOM",
    image: "/images/collections/bed.jpeg",
    description: "Upholstered king & queen beds, seasoned Sheesham nightstands, and spacious wardrobes built for restful sanctuary.",
    itemCount: "10+ Signature Sets",
  },
  {
    id: "office",
    name: "Home Office Collection",
    category: "OFFICE",
    image: "/images/collections/office.jpeg",
    description: "Ergonomic executive wooden desks, tufted swivel accent chairs, and handcrafted bookshelf solutions for productive workdays.",
    itemCount: "6+ Executive Designs",
  },
  {
    id: "storage",
    name: "Entryway & Storage Collection",
    category: "STORAGE",
    image: "/images/products/shoe.jpeg",
    description: "Entryway shoe rack benches, upholstered storage trunks, and multi-shelf cabinets crafted from solid Sheesham wood.",
    itemCount: "9+ Functional Pieces",
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-14">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              CURATED LIVING SPACES
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Explore Our Signature Collections
            </h1>
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-[640px]">
              Discover luxury solid wood furniture curated for every corner of your modern Indian home.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={`/shop?category=${encodeURIComponent(col.category)}`}
                className="group flex flex-col rounded-3xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden bg-zinc-200">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-[#A67C52] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm border border-[#E5E5E5]">
                      {col.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 gap-3 justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-[#666666] font-medium">
                      {col.itemCount}
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5]/60 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                      View Collection <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E5E5E5]/80 text-center flex flex-col items-center gap-5 shadow-sm max-w-4xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              NEED CUSTOM DESIGN?
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
              Bespoke Furniture Handcrafted For You
            </h2>
            <p className="text-sm text-[#666666] max-w-md">
              Customize wood polishes, velvet fabrics, and room dimensions with our senior Jaipur design team.
            </p>
            <Link href="/contact" className="mt-2">
              <Button variant="primary" size="lg" className="px-8 py-4">
                Request Custom Design
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
