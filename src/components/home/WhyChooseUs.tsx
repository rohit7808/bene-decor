import React from "react";
import Container from "../ui/Container";

const FEATURES = [
  {
    id: 1,
    title: "Premium Quality",
    description:
      "Made from carefully selected solid wood and premium materials.",
  },
  {
    id: 2,
    title: "Handcrafted",
    description:
      "Every product is crafted by skilled artisans with attention to detail.",
  },
  {
    id: 3,
    title: "Modern Design",
    description:
      "Elegant contemporary designs that fit every modern home.",
  },
  {
    id: 4,
    title: "Lifetime Support",
    description:
      "Dedicated customer support and after-sales assistance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white border-t border-[#E5E5E5]/50">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 md:gap-5">
          {/* Small Label */}
          <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
            WHY CHOOSE US
          </span>

          {/* Main Heading */}
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F1F1F] leading-tight">
            Crafted With Passion &
            <br className="hidden sm:inline" />
            {" "}Built To Last
          </h2>

          {/* Description */}
          <p className="max-w-[700px] text-base md:text-lg text-[#666666] leading-relaxed mx-auto">
            Every piece is handcrafted using premium materials, timeless
            craftsmanship and modern design to create furniture that lasts for
            generations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col rounded-2xl bg-white p-8 border border-[#E5E5E5] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              {/* Feature Title */}
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F] mb-3">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
