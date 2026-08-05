import React from "react";

export interface HeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function HeroVideo({
  src,
  poster,
  className = "",
}: HeroVideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={`absolute inset-0 w-full h-full object-cover ${className}`.trim()}
    />
  );
}
