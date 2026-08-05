"use client";

import React, { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo, { ProductData } from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

const ALL_PRODUCTS: ProductData[] = [
  {
    id: 1,
    name: "Bene Decor Aldric Wooden Sofa",
    category: "LIVING ROOM",
    price: "₹45,090",
    originalPrice: "₹89,099",
    discount: "(49% OFF)",
    rating: 5,
    reviewsCount: 48,
    images: [
      "/images/products/Soaafa.jpeg",
      "/images/collections/sofa.jpeg",
      "/images/products/chairr.jpeg",
      "/images/products/Pouffe.jpeg",
    ],
    shortDescription:
      "Handcrafted from premium solid teak wood with plush high-density velvet cushioning. The Aldric Wooden Sofa brings timeless sophistication, ergonomic support, and generational durability to your living room.",
    material: "Solid Teak Wood & High-Density Velvet",
    dimensions: '84" W x 36" D x 34" H',
    finish: "Provincial Teak Polish",
    warranty: "5 Year Structural Warranty",
    deliveryTime: "5 - 7 Business Days",
    careInstructions:
      "Wipe clean with a soft dry cloth. Avoid direct exposure to moisture and direct sunlight.",
  },
  {
    id: 2,
    name: "Printed Cotton Ottoman Pouffe – Provincial Teak Finish",
    category: "DINING",
    price: "₹3,990",
    originalPrice: "₹9,990",
    discount: "(60% OFF)",
    rating: 5,
    reviewsCount: 36,
    images: [
      "/images/products/Pouffe.jpeg",
      "/images/collections/dining.jpeg",
      "/images/products/Soaafa.jpeg",
      "/images/products/shoe.jpeg",
    ],
    shortDescription:
      "Versatile handcrafted ottoman pouffe featuring hand-printed cotton upholstery and solid teak wooden legs. Ideal for extra lounge seating or accent decor.",
    material: "100% Hand-Printed Cotton & Teak Wood",
    dimensions: '18" W x 18" D x 16" H',
    finish: "Natural Hand-Woven Textile",
    warranty: "2 Year Cushioning Warranty",
    deliveryTime: "3 - 5 Business Days",
    careInstructions:
      "Spot clean with mild fabric shampoo. Vacuum periodically to remove dust.",
  },
  {
    id: 3,
    name: "Sheesham Wood Shoe Rack with Cushion – Single Rack, Upholstery",
    category: "STORAGE",
    price: "₹8,990",
    originalPrice: "₹19,909",
    discount: "(55% OFF)",
    rating: 5,
    reviewsCount: 52,
    images: [
      "/images/products/shoe.jpeg",
      "/images/collections/bed.jpeg",
      "/images/products/Pouffe.jpeg",
      "/images/products/chairr.jpeg",
    ],
    shortDescription:
      "Compact entryway storage bench crafted from seasoned Sheesham wood with comfortable padded seating. Features multi-shelf shoe storage with magnetic closure.",
    material: "Seasoned Sheesham Wood & Linen",
    dimensions: '36" W x 14" D x 20" H',
    finish: "Warm Walnut Matte Finish",
    warranty: "3 Year Wood Warranty",
    deliveryTime: "4 - 6 Business Days",
    careInstructions:
      "Apply natural wood polish twice a year to preserve shine.",
  },
  {
    id: 4,
    name: "The Sterling Tufted Accent Chair",
    category: "DINING",
    price: "₹6,909",
    originalPrice: "₹16,999",
    discount: "(59% OFF)",
    rating: 5,
    reviewsCount: 29,
    images: [
      "/images/products/chairr.jpeg",
      "/images/collections/office.jpeg",
      "/images/products/Soaafa.jpeg",
      "/images/products/dining.jpeg",
    ],
    shortDescription:
      "Ergonomically designed accent dining chair featuring deep diamond tufting, solid oak legs, and stain-resistant premium linen upholstery.",
    material: "Solid Oak Frame & Linen Upholstery",
    dimensions: '24" W x 26" D x 38" H',
    finish: "Natural Oak Stained Legs",
    warranty: "3 Year Structural Warranty",
    deliveryTime: "4 - 6 Business Days",
    careInstructions: "Professional dry clean recommended for fabric upholstery.",
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const productId = parseInt(id, 10) || 1;

  // Find product by id or fallback to product 1
  const product =
    ALL_PRODUCTS.find((p) => p.id === productId) || ALL_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#666666] mb-8">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#A67C52] font-medium">{product.category}</span>
            <span>/</span>
            <span className="text-[#1F1F1F] font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left: Image Gallery */}
            <ProductGallery images={product.images} alt={product.name} />

            {/* Right: Product Details & Actions */}
            <ProductInfo product={product} />
          </div>

          {/* Product Tabs: Description, Specs, Shipping & Reviews */}
          <ProductTabs product={product} />

          {/* Related Products Grid */}
          <RelatedProducts
            currentProductId={product.id}
            allProducts={ALL_PRODUCTS}
          />
        </Container>
      </main>
    </div>
  );
}
