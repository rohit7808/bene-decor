import React from "react";
import Container from "../ui/Container";
import HeroButtons from "./HeroButtons";

export interface HeroContentProps {
  className?: string;
}

export default function HeroContent({ className = "" }: HeroContentProps) {
  return (
    <Container
      className={`relative z-10 h-full flex flex-col justify-center ${className}`.trim()}
    >
      <div className="max-w-[620px] text-left flex flex-col gap-6 md:gap-7 animate-[fadeUp_0.8s_ease-out_forwards]">
        {/* Small Label with Left Accent Line */}
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-6 bg-[#A67C52] shrink-0" />
          <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            WELCOME TO BENÉ DECOR
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-[family-name:var(--font-playfair)] text-[48px] md:text-[60px] lg:text-[72px] font-bold text-white leading-[1.05] -tracking-[0.02em]">
          Timeless Furniture.
          <br />
          Crafted for Generations.
        </h1>

        {/* Paragraph */}
        <p className="max-w-[560px] text-base md:text-lg text-white/85 leading-relaxed md:leading-8">
          Premium handcrafted furniture made with passion, precision and the
          finest quality materials.
          <br className="hidden sm:inline" />
          {" "}Proudly made in India.
        </p>

        {/* Hero Buttons */}
        <div className="pt-3 md:pt-4">
          <HeroButtons />
        </div>
      </div>
    </Container>
  );
}
