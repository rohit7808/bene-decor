"use client";

import React, { use } from "react";
import ShopPage from "../page";

export default function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);

  return <ShopPage initialCategory={category} />;
}
