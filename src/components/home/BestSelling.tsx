import React from "react";
import Image from "next/image";
import Container from "../ui/Container";
import Button from "../ui/Button";

interface Product {
  id: number;
  image: string;
  category: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: string;
  objectPosition?: string;
}

export default function BestSelling() {
  const PRODUCTS: Product[] = [
    {
      id: 1,
      image: "/images/products/Soaafa.jpeg",
      category: "LIVING ROOM",
      name: "Bene Decor Aldric Wooden Sofa",
      price: "₹45,090",
      originalPrice: "₹89,099",
      discount: "(49% OFF)",
      rating: "★★★★★",
    },
    {
      id: 2,
      image: "/images/products/Pouffe.jpeg",
      category: "DINING",
      name: "Printed Cotton Ottoman Pouffe – Provincial Teak Finish",
      price: "₹3,990",
      originalPrice: "₹9,990",
      discount: "(60% OFF)",
      rating: "★★★★★",
    },
    {
      id: 3,
      image: "/images/products/shoe.jpeg",
      category: "STORAGE",
      name: "Sheesham Wood Shoe Rack with Cushion – Single Rack, Upholstery",
      price: "₹8,990",
      originalPrice: "₹19,909",
      discount: "(55% OFF)",
      rating: "★★★★★",
    },
    {
      id: 4,
      image: "/images/products/chairr.jpeg",
      category: "DINING",
      name: "The Sterling Tufted Accent Chair",
      price: "₹6,909",
      originalPrice: "₹16,999",
      discount: "(59% OFF)",
      rating: "★★★★★",
      objectPosition: "object-[center_20%]",
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-[#E5E5E5]/50">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 md:gap-5">
          {/* Small Label */}
          <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            BEST SELLERS
          </span>

          {/* Main Heading */}
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F1F1F] leading-tight">
            Our Most Loved Furniture
          </h2>

          {/* Description */}
          <p className="max-w-[700px] text-base md:text-lg text-[#666666] leading-relaxed mx-auto">
            Discover our best-selling handcrafted furniture pieces loved by
            customers for their timeless beauty, premium quality and exceptional
            comfort.
          </p>
        </div>

        {/* Product Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-2xl bg-white overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
            >
              {/* Image Container (300px height with Next.js Image & Wishlist Icon) */}
              <div className="relative h-[300px] w-full overflow-hidden bg-zinc-200/80">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover ${
                    product.objectPosition || "object-center"
                  } rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out`}
                />

                {/* Wishlist Icon Placeholder */}
                <button
                  type="button"
                  aria-label="Add to Wishlist"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#1F1F1F] hover:text-[#A67C52] transition-colors duration-300 shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                {/* Category */}
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                  {product.category}
                </span>

                {/* Product Name */}
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 text-sm text-[#A67C52]">
                  <span>{product.rating}</span>
                </div>

                {/* Price & Add to Cart */}
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#E5E5E5]/60 gap-2">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-bold text-lg text-[#1F1F1F]">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#666666] line-through">
                        {product.originalPrice}
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-xs font-semibold text-[#16A34A]">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  <Button variant="primary" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
