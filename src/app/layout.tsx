import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.benedecor.in"),
  title: {
    default: "Bené Decor | Premium Handcrafted Solid Wood Furniture",
    template: "%s | Bené Decor",
  },
  description:
    "Bené Decor crafts premium solid teak and Sheesham wood furniture with timeless elegance. Explore luxury beds, sofas, dining tables, wardrobes, and custom furniture.",
  keywords: [
    "Furniture",
    "Solid Wood Furniture",
    "Luxury Furniture",
    "Teak Wood Sofa",
    "Sheesham Wood Furniture",
    "Bedroom Furniture",
    "Living Room Furniture",
    "Dining Table",
    "Wardrobe",
    "Custom Furniture India",
    "Jaipur Furniture Showroom",
  ],
  authors: [{ name: "Bené Decor" }],
  openGraph: {
    title: "Bené Decor | Premium Handcrafted Solid Wood Furniture",
    description:
      "Handcrafted solid wood furniture blending luxury, craftsmanship, and comfort for modern Indian homes.",
    url: "https://www.benedecor.in",
    siteName: "Bené Decor",
    images: [
      {
        url: "/images/Banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Bené Decor Flagship Showroom",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bené Decor | Premium Handcrafted Solid Wood Furniture",
    description:
      "Handcrafted solid wood furniture blending luxury, craftsmanship, and comfort for modern Indian homes.",
    images: ["/images/Banner.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col justify-between`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex-1">{children}</div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
