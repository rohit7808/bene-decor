import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../ui/Container";

const COLLECTIONS = [
  {
    id: 1,
    image: "/images/collections/sofa.jpg",
    category: "LIVING ROOM",
    title: "Luxury Sofas",
    description:
      "Elegant handcrafted sofas designed for comfort and timeless living spaces.",
    href: "/shop/living-room",
  },
  {
    id: 2,
    image: "/images/collections/dining.jpeg",
    category: "DINING",
    title: "Dining Tables",
    description:
      "Premium solid wood dining tables crafted for memorable family moments.",
    href: "/shop/dining",
  },
  {
    id: 3,
    image: "/images/collections/bed.jpeg",
    category: "BEDROOM",
    title: "Designer Beds",
    description:
      "Modern handcrafted beds combining beauty, durability and relaxation.",
    href: "/shop/bedroom",
  },
  {
    id: 4,
    image: "/images/collections/office.png",
    category: "OFFICE",
    title: "Office Furniture",
    description:
      "Professional workspaces built with premium craftsmanship and ergonomic comfort.",
    href: "/shop/office",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 md:gap-5">
          {/* Small Label */}
          <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            FEATURED COLLECTIONS
          </span>

          {/* Main Heading */}
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F1F1F] leading-tight">
            Discover Our
            <br className="hidden sm:inline" />
            {" "}Premium Furniture
          </h2>

          {/* Description */}
          <p className="max-w-[700px] text-base md:text-lg text-[#666666] leading-relaxed mx-auto">
            Explore handcrafted furniture collections designed to elevate every
            living space with timeless elegance.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group flex flex-col h-[420px] rounded-2xl bg-[#FAF8F5] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out border border-[#E5E5E5]/60"
            >
              {/* Image Container (280px height with Next.js Image fill & hover zoom) */}
              <div className="relative h-[280px] w-full overflow-hidden bg-[#FAF8F5]">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3 rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Text Section */}
              <div className="flex flex-col justify-center flex-1 p-5 gap-1.5">
                {/* Category */}
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                  {collection.category}
                </span>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300">
                  {collection.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-[#666666] line-clamp-2">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
