"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface BlogPost {
  id: number;
  title: string;
  category: "Living Room" | "Bedroom" | "Dining" | "Office" | "Decor" | "Guides";
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  featured?: boolean;
}

const FEATURED_ARTICLE: BlogPost = {
  id: 0,
  title: "The Art of Living: Selecting the Perfect Solid Teak Sofa for Modern Indian Homes",
  category: "Living Room",
  date: "August 2, 2026",
  readTime: "6 min read",
  image: "/images/collections/sofa.jpeg",
  excerpt:
    "Discover how to balance space proportions, velvet fabric textures, and solid teak wood polishes to curate a warm, luxurious living room centerpiece that lasts for generations.",
  featured: true,
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Choosing the Perfect Sofa for Small & Large Spaces",
    category: "Living Room",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "/images/products/Soaafa.jpeg",
    excerpt:
      "A comprehensive guide to understanding room scale, cushion densities, and wood frame ergonomics before investing in your dream sofa.",
  },
  {
    id: 2,
    title: "Modern Dining Room Ideas: Tables, Chairs & Lighting",
    category: "Dining",
    date: "July 25, 2026",
    readTime: "4 min read",
    image: "/images/collections/dining.jpeg",
    excerpt:
      "Transform mealtime gathering spaces with handcrafted solid oak dining chairs, teak extendable tables, and warm ambient pendants.",
  },
  {
    id: 3,
    title: "The Ultimate Sheesham Wood Furniture Buying & Care Guide",
    category: "Guides",
    date: "July 20, 2026",
    readTime: "7 min read",
    image: "/images/products/shoe.jpeg",
    excerpt:
      "Learn why seasoned Indian Sheesham wood offers unmatched grain beauty and structural strength, plus tips to maintain its natural luster.",
  },
  {
    id: 4,
    title: "Luxury Bedroom Design: Styling Solid Wood Beds & Nightstands",
    category: "Bedroom",
    date: "July 16, 2026",
    readTime: "5 min read",
    image: "/images/collections/bed.jpeg",
    excerpt:
      "Create a peaceful sanctuary using upholstered headboards, teak bedside tables, and organic linen bedding in neutral palettes.",
  },
  {
    id: 5,
    title: "Creating an Ergonomic & Elegant Home Office Setup",
    category: "Office",
    date: "July 12, 2026",
    readTime: "4 min read",
    image: "/images/collections/office.jpeg",
    excerpt:
      "Blend productivity with luxury. Discover handcrafted executive wooden desks and tufted leather chairs designed for workday comfort.",
  },
  {
    id: 6,
    title: "Essential Furniture Care Tips to Preserve Teak for Generations",
    category: "Guides",
    date: "July 08, 2026",
    readTime: "6 min read",
    image: "/images/products/Pouffe.jpeg",
    excerpt:
      "Simple conditioning, cleaning routines, and sunlight protection steps to keep your heirloom solid wood pieces looking flawless.",
  },
  {
    id: 7,
    title: "Small Apartment Decor: Maximizing Space Without Sacrificing Style",
    category: "Decor",
    date: "July 03, 2026",
    readTime: "5 min read",
    image: "/images/products/chairr.jpeg",
    excerpt:
      "Smart multi-functional benches, entryway storage, and ottoman pouffes designed to elevate compact urban apartments.",
  },
  {
    id: 8,
    title: "How Ambient Lighting Enhances Solid Wood Furniture Finishes",
    category: "Decor",
    date: "June 27, 2026",
    readTime: "4 min read",
    image: "/images/products/chair.jpeg",
    excerpt:
      "Explore color temperatures and spot lighting techniques that highlight hand-rubbed wood grains and tufted velvet textures.",
  },
  {
    id: 9,
    title: "Minimalist Interior Design: Principles for Tranquil Living Spaces",
    category: "Living Room",
    date: "June 21, 2026",
    readTime: "5 min read",
    image: "/images/collections/sofa.jpeg",
    excerpt:
      "De-cluttering tips and selective furniture curation strategies to build calm, architectural interiors with natural wood accents.",
  },
];

const CATEGORIES = [
  "All",
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Decor",
  "Guides",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Filter posts by Category and Search Query
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              DESIGN JOURNAL &amp; GUIDES
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Furniture Inspiration &amp; Design Blog
            </h1>
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-[640px]">
              Explore interior design ideas, furniture buying guides, home décor tips, and luxury living inspiration.
            </p>
          </div>

          {/* Search Bar & Category Filter Chips */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14 bg-[#FAF8F5] p-4 sm:p-6 rounded-3xl border border-[#E5E5E5]/80 shadow-sm">
            {/* Category Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-[#A67C52] text-white shadow-md"
                        : "bg-white text-[#666666] border border-[#E5E5E5] hover:text-[#1F1F1F]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search articles by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#1F1F1F] bg-white focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
              />
              <svg
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>

          {/* Featured Blog Section */}
          {activeCategory === "All" && !searchQuery && (
            <div className="mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52] block mb-4">
                FEATURED STORY
              </span>
              <div className="group relative grid grid-cols-1 lg:grid-cols-2 bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Featured Image */}
                <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden bg-zinc-200">
                  <Image
                    src={FEATURED_ARTICLE.image}
                    alt={FEATURED_ARTICLE.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#A67C52] text-white text-xs font-semibold uppercase px-3 py-1 rounded-md shadow-sm">
                      {FEATURED_ARTICLE.category}
                    </span>
                  </div>
                </div>

                {/* Featured Content */}
                <div className="p-6 sm:p-10 flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs text-[#666666]">
                      <span>{FEATURED_ARTICLE.date}</span>
                      <span>•</span>
                      <span>{FEATURED_ARTICLE.readTime}</span>
                    </div>

                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors leading-snug">
                      {FEATURED_ARTICLE.title}
                    </h2>

                    <p className="text-sm text-[#666666] leading-relaxed">
                      {FEATURED_ARTICLE.excerpt}
                    </p>
                  </div>

                  <div>
                    <Button variant="primary" size="md" className="py-3 px-6">
                      Read Full Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-8">
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1F1F1F]">
              Latest Articles ({filteredPosts.length})
            </h2>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold uppercase text-[#A67C52] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Blog Grid (9 Cards) */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#FAF8F5] rounded-3xl border border-[#E5E5E5] text-center gap-4 my-8">
              <span className="text-4xl">📖</span>
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                No Articles Found
              </h3>
              <p className="text-sm text-[#666666] max-w-sm">
                No blog posts matched your search or category filter. Try clearing your search query.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-[240px] w-full overflow-hidden bg-zinc-200/80">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white/95 backdrop-blur-sm text-[#A67C52] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-[#E5E5E5]">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-6 gap-3 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-[#666666]">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] group-hover:text-[#A67C52] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5]/60 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                        Read More <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Newsletter CTA Section */}
          <div className="w-full bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 border border-[#E5E5E5]/80 text-center flex flex-col items-center gap-5 shadow-sm max-w-4xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              STAY INSPIRED
            </span>

            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl font-bold text-[#1F1F1F] max-w-lg">
              Get Weekly Interior Design Inspiration
            </h2>

            <p className="text-sm text-[#666666] max-w-md leading-relaxed">
              Subscribe to receive curated home decor guides, exclusive furniture launches, and luxury styling tips right in your inbox.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#16A34A] text-sm font-semibold mt-2">
                ✓ Thank you for subscribing to Bené Decor Journal!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full flex-1 px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm text-[#1F1F1F] bg-white focus:outline-none focus:border-[#A67C52]"
                />
                <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto py-3 px-6">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
