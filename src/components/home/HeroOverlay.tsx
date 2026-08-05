import React from "react";

export interface HeroOverlayProps {
  opacity?: number;
  className?: string;
}

export default function HeroOverlay({
  opacity = 0.45,
  className = "",
}: HeroOverlayProps) {
  return (
    <div
      style={{ opacity }}
      className={`absolute inset-0 pointer-events-none ${className}`.trim()}
    >
      {/* Left side directional gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

      {/* Top subtle dark fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Bottom subtle dark fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
