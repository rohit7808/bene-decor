import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#A67C52] text-white hover:bg-[#8F6943] active:bg-[#7D5B3A]",
  secondary:
    "bg-[#2E2A27] text-white hover:bg-[#1E1B19] active:bg-[#151311]",
  outline:
    "bg-transparent border border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52]/10 active:bg-[#A67C52]/20",
  ghost:
    "bg-transparent text-[#1F1F1F] hover:bg-[#FAF8F5] active:bg-[#E5E5E5]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm font-medium",
  md: "px-5 py-2.5 text-base font-medium",
  lg: "px-7 py-3.5 text-lg font-semibold",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-[16px] transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  const combinedClassName = `${baseStyles} ${selectedVariant} ${selectedSize} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
