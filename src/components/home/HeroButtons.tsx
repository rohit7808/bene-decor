import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

export interface HeroButtonsProps {
  className?: string;
}

export default function HeroButtons({ className = "" }: HeroButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 pt-2 ${className}`.trim()}>
      <Link href="/shop" className="inline-block">
        <Button variant="primary" size="lg">
          Explore Collection
        </Button>
      </Link>
      <Link href="/contact" className="inline-block">
        <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
          Custom Order
        </Button>
      </Link>
    </div>
  );
}
