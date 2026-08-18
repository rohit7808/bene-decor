"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const displayImages = useMemo(() => {
    return Array.isArray(images) && images.length > 0
      ? images
      : ["/images/products/Soaafa.jpeg"];
  }, [images]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keep active index valid if images prop changes
  useEffect(() => {
    if (activeImageIndex >= displayImages.length) {
      setActiveImageIndex(0);
    }
  }, [displayImages, activeImageIndex]);

  // Start auto-cycling interval (every 1.5s)
  const startSlideshow = useCallback(() => {
    if (displayImages.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsSliding(true);
    timerRef.current = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 1500);
  }, [displayImages]);

  // Stop auto-cycling interval
  const stopSlideshow = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsSliding(false);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Scroll active thumbnail into view during slideshow
  useEffect(() => {
    if (isSliding && thumbnailRefs.current[activeImageIndex]) {
      thumbnailRefs.current[activeImageIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeImageIndex, isSliding]);

  const activeImage = displayImages[activeImageIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Product Image Container with Hover Auto-Cycle */}
      <div
        onMouseEnter={startSlideshow}
        onMouseLeave={stopSlideshow}
        className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full rounded-2xl overflow-hidden border border-[#E5E5E5]/80 bg-[#FAF8F5] shadow-sm group cursor-pointer"
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-center p-4 transition-all duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Hover Auto-Cycle Indicator Badge */}
        {isSliding ? (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A67C52] text-white text-xs font-bold shadow-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Auto-Cycling (1.5s)
          </div>
        ) : (
          displayImages.length > 1 && (
            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold shadow-sm">
              Hover to Cycle Images
            </div>
          )
        )}
      </div>

      {/* Product Thumbnails List - Displays ALL Uploaded Images */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#A67C52]/30 scrollbar-track-transparent">
          {displayImages.map((img, idx) => {
            const isActive = activeImageIndex === idx;
            return (
              <button
                key={idx}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => {
                  stopSlideshow();
                  setActiveImageIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-20 sm:h-24 w-20 sm:w-24 shrink-0 rounded-xl overflow-hidden border-2 bg-[#FAF8F5] transition-all duration-300 cursor-pointer ${
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
                  className="object-contain object-center p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
