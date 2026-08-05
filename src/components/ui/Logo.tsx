import React from "react";
import Image from "next/image";

export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  width = 60,
  height = 60,
  className = "",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/images/logo.jpeg"
      alt="Bené Decor Logo"
      width={width}
      height={height}
      priority={priority}
      className={`h-[60px] w-auto max-h-[60px] object-contain shrink-0 rounded-full ${className}`.trim()}
    />
  );
}
