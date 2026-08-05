"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "/images/products/Soaafa.jpeg");

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full rounded-2xl overflow-hidden border border-[#E5E5E5]/80 bg-[#FAF8F5] shadow-sm group">
        <Image
          src={activeImage}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((img, idx) => {
          const isActive = activeImage === img;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative h-20 sm:h-24 w-full rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                isActive
                  ? "border-[#A67C52] ring-2 ring-[#A67C52]/20 scale-[1.02]"
                  : "border-[#E5E5E5] opacity-70 hover:opacity-100 hover:border-[#A67C52]/50"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover object-center"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
