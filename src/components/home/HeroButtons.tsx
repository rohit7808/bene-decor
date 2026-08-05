import React from "react";
import Button from "../ui/Button";

export interface HeroButtonsProps {
  className?: string;
}

export default function HeroButtons({ className = "" }: HeroButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 pt-2 ${className}`.trim()}>
      <Button variant="primary" size="lg">
        Explore Collection
      </Button>
      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
        Custom Order
      </Button>
    </div>
  );
}
