"use client";

import React from "react";

interface ShowroomMapPreviewProps {
  title?: string;
  subtitle?: string;
  address?: string;
  hours?: string;
  className?: string;
}

export default function ShowroomMapPreview({
  title = "Bené Decor Flagship Studio",
  subtitle = "EXPERIENCE OUR COLLECTIONS",
  address = "Tonk Road, Near Chokhi Dhani, Jaipur, Rajasthan 302022",
  hours = "Open Today (10 AM - 7 PM)",
  className = "",
}: ShowroomMapPreviewProps) {
  const queryAddress = `${title}, ${address}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    queryAddress
  )}`;
  
  // Real Google Maps Embed URL (No API Key required)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    queryAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E5E5E5]/80 shadow-sm flex flex-col gap-6 ${className}`}>
      {/* Section Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            {subtitle}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            Visit Our Showroom
          </h2>
        </div>
        <a
          href={mapSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E5E5E5] text-xs font-bold text-[#A67C52] hover:border-[#A67C52] hover:bg-[#A67C52] hover:text-white transition-all shadow-xs group cursor-pointer"
        >
          <span>📍 Open in Google Maps</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>

      {/* Real Interactive Google Maps Embed Container */}
      <div className="relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-[#E5E5E5] bg-[#FAF8F5] shadow-sm">
        {/* Real Embedded Google Map Iframe */}
        <iframe
          title="Bené Decor Showroom Location"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          className="w-full h-full border-0 rounded-2xl"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Glassmorphism Location Card Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 max-w-sm w-[calc(100%-2rem)] sm:w-80 p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E5E5] shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              SHOWROOM LOCATION
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-0.5 rounded-full">
              Open Today
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F]">
            {title}
          </h3>

          <p className="text-xs text-[#666666] leading-relaxed">
            {address}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]/80 text-xs">
            <span className="text-[#666666] font-medium">{hours}</span>
            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#A67C52] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Directions</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
