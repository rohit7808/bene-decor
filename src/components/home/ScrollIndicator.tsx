import React from "react";

export interface ScrollIndicatorProps {
  className?: string;
}

export default function ScrollIndicator({
  className = "",
}: ScrollIndicatorProps) {
  return (
    <div
      className={`hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-start justify-center w-[28px] h-[46px] rounded-full border-2 border-white/70 ${className}`.trim()}
      aria-label="Scroll Down"
    >
      <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 animate-bounce" />
    </div>
  );
}
