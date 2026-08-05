"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinksProps {
  activeItem?: string;
  className?: string;
  direction?: "row" | "column";
}

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "Custom Furniture", href: "/contact" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function NavLinks({
  activeItem,
  className = "",
  direction = "row",
}: NavLinksProps) {
  const pathname = usePathname();
  const isRow = direction === "row";

  const listClasses = isRow
    ? "flex flex-row gap-8 items-center"
    : "flex flex-col gap-5";

  return (
    <nav className={className}>
      <ul className={listClasses}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeItem
              ? activeItem.toLowerCase() === item.name.toLowerCase()
              : pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`cursor-pointer transition-colors duration-300 ${
                  isActive
                    ? "text-[#A67C52] font-semibold"
                    : "text-[#1F1F1F] hover:text-[#A67C52]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
