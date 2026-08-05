import React from "react";
import Input from "./Input";

export interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search furniture...",
  className = "",
  disabled = false,
}: SearchBarProps) {
  return (
    <div
      className={`relative flex items-center w-full h-[48px] rounded-full bg-white border border-[#E5E5E5] px-4 transition-all duration-300 focus-within:border-[#A67C52] focus-within:ring-1 focus-within:ring-[#A67C52] ${
        disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
      } ${className}`.trim()}
    >
      <svg
        className="w-5 h-5 text-[#666666] shrink-0 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="!border-none !bg-transparent !h-full !px-0 !rounded-none focus:!ring-0 focus:!outline-none"
      />
    </div>
  );
}
