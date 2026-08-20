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
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);

  // Touch Swipe Gesture State for Main Image
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keep active index valid if images prop changes
  useEffect(() => {
    if (activeImageIndex >= displayImages.length) {
      setActiveImageIndex(0);
    }
  }, [displayImages, activeImageIndex]);

  // Start auto-cycling interval (every 1.5s) on desktop hover
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

  // Scroll active thumbnail into view whenever active image index changes
  useEffect(() => {
    if (thumbnailRefs.current[activeImageIndex]) {
      thumbnailRefs.current[activeImageIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeImageIndex]);

  // Main Image Touch Handlers for Swiping Left/Right on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    stopSlideshow();
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopSlideshow();
    setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopSlideshow();
    setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const activeImage = displayImages[activeImageIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden select-none">
      {/* Main Product Image Container with Touch Swipe & Hover Auto-Cycle */}
      <div
        onMouseEnter={startSlideshow}
        onMouseLeave={stopSlideshow}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[340px] sm:h-[480px] lg:h-[560px] w-full max-w-full rounded-2xl overflow-hidden border border-[#E5E5E5]/80 bg-[#FAF8F5] shadow-sm group cursor-pointer"
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-center p-3 sm:p-4 transition-all duration-500 ease-in-out group-hover:scale-105"
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
              Hover to Cycle • Swipe / Arrow to Change
            </div>
          )
        )}

        {/* Navigation Arrows for Multiple Images */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-[#1F1F1F] hover:text-[#A67C52] shadow-md flex items-center justify-center transition-all duration-200 backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-[#1F1F1F] hover:text-[#A67C52] shadow-md flex items-center justify-center transition-all duration-200 backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Mobile Image Index Counter Pill */}
            <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold shadow-xs">
              {activeImageIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Product Thumbnails List - Horizontally Scrollable & Swipable */}
      {displayImages.length > 1 && (
        <div className="w-full max-w-full overflow-hidden">
          <div
            ref={thumbnailContainerRef}
            className="flex flex-row flex-nowrap items-center gap-3 overflow-x-auto w-full max-w-full pb-2 pt-1 scroll-smooth snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
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
                  className={`relative h-20 sm:h-24 w-20 sm:w-24 shrink-0 snap-start rounded-xl overflow-hidden border-2 bg-[#FAF8F5] transition-all duration-300 cursor-pointer ${
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
        </div>
      )}
    </div>
  );
}
