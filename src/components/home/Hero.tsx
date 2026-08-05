import React from "react";
import HeroVideo from "./HeroVideo";
import HeroOverlay from "./HeroOverlay";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section className="relative w-full h-[100vh] min-h-[720px] overflow-hidden">
      {/* Hero Video */}
      <HeroVideo src="/videos/hero.mp4" />

      {/* Hero Overlay */}
      <HeroOverlay />

      {/* Hero Content */}
      <HeroContent />
    </section>
  );
}


