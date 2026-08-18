export interface Product {
  id: number;
  name: string;
  category: "LIVING ROOM" | "DINING" | "BEDROOM" | "OFFICE" | "STORAGE";
  price: string;
  priceNumeric: number;
  originalPrice: string;
  discount: string;
  discountNumeric: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  material: "Solid Wood" | "Engineered Wood" | "Metal" | "Fabric" | "Leather";
  image: string;
  images: string[];
  shortDescription: string;
  tags?: string[];
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Bene Decor Aldric Wooden Sofa",
    category: "LIVING ROOM",
    price: "₹45,090",
    priceNumeric: 45090,
    originalPrice: "₹89,099",
    discount: "(49% OFF)",
    discountNumeric: 49,
    rating: 5,
    reviewsCount: 48,
    inStock: true,
    material: "Solid Wood",
    image: "/images/products/Soaafa.jpeg",
    images: [
      "/images/products/Soaafa.jpeg",
      "/images/collections/sofa.jpg",
      "/images/products/chairr.jpeg",
      "/images/products/Pouffe.jpeg",
    ],
    shortDescription:
      "Handcrafted from premium solid teak wood with plush high-density velvet cushioning. The Aldric Wooden Sofa brings timeless sophistication, ergonomic support, and generational durability to your living room.",
  },
  {
    id: 2,
    name: "Printed Cotton Ottoman Pouffe – Provincial Teak Finish",
    category: "DINING",
    price: "₹3,990",
    priceNumeric: 3990,
    originalPrice: "₹9,990",
    discount: "(60% OFF)",
    discountNumeric: 60,
    rating: 5,
    reviewsCount: 36,
    inStock: true,
    material: "Fabric",
    image: "/images/products/Pouffe.jpeg",
    images: [
      "/images/products/Pouffe.jpeg",
      "/images/collections/dining.jpeg",
      "/images/products/Soaafa.jpeg",
      "/images/products/shoe.jpeg",
    ],
    shortDescription:
      "Versatile handcrafted ottoman pouffe featuring hand-printed cotton upholstery and solid teak wooden legs. Ideal for extra lounge seating or accent decor.",
  },
  {
    id: 3,
    name: "Sheesham Wood Shoe Rack with Cushion – Single Rack, Upholstery",
    category: "STORAGE",
    price: "₹8,990",
    priceNumeric: 8990,
    originalPrice: "₹19,909",
    discount: "(55% OFF)",
    discountNumeric: 55,
    rating: 5,
    reviewsCount: 52,
    inStock: true,
    material: "Solid Wood",
    image: "/images/products/shoe.jpeg",
    images: [
      "/images/products/shoe.jpeg",
      "/images/collections/bed.jpeg",
      "/images/products/Pouffe.jpeg",
      "/images/products/chairr.jpeg",
    ],
    shortDescription:
      "Compact entryway storage bench crafted from seasoned Sheesham wood with comfortable padded seating. Features multi-shelf shoe storage with magnetic closure.",
  },
  {
    id: 4,
    name: "The Sterling Tufted Accent Chair",
    category: "DINING",
    price: "₹6,909",
    priceNumeric: 6909,
    originalPrice: "₹16,999",
    discount: "(59% OFF)",
    discountNumeric: 59,
    rating: 5,
    reviewsCount: 29,
    inStock: true,
    material: "Fabric",
    image: "/images/products/chairr.jpeg",
    images: [
      "/images/products/chairr.jpeg",
      "/images/collections/office.png",
      "/images/products/Soaafa.jpeg",
      "/images/products/dining.jpeg",
    ],
    shortDescription:
      "Ergonomically designed accent dining chair featuring deep diamond tufting, solid oak legs, and stain-resistant premium linen upholstery.",
  },
];
