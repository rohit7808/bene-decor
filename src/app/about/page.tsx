"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "15+", label: "Years Experience" },
  { value: "250+", label: "Luxury Designs" },
  { value: "100%", label: "Premium Quality" },
];

const FEATURES = [
  {
    icon: "✔",
    title: "Premium Materials",
    description:
      "Crafted exclusively from 100% solid Sheesham and teak wood, seasoned for lifetime durability.",
  },
  {
    icon: "✔",
    title: "Handcrafted Excellence",
    description:
      "Every curve and joint is meticulously shaped by heritage master artisans in Rajasthan.",
  },
  {
    icon: "✔",
    title: "Custom Furniture",
    description:
      "Personalize wood polishes, velvet fabrics, and dimensions to fit your home's unique layout.",
  },
  {
    icon: "✔",
    title: "Fast Delivery",
    description:
      "Insured nationwide shipping complete with complimentary white-glove assembly in your room.",
  },
];

const TEAM = [
  {
    name: "Rajeshwar Sharma",
    role: "Founder & CEO",
    initials: "RS",
    bio: "Pioneered Bené Decor with a vision to bring traditional Indian woodworking heritage into luxury contemporary homes.",
  },
  {
    name: "Aanya Singhania",
    role: "Lead Interior Designer",
    initials: "AS",
    bio: "Combines modern ergonomic principles with timeless aesthetic warmth to curate award-winning collections.",
  },
  {
    name: "Devendra Verma",
    role: "Head of Customer Experience",
    initials: "DV",
    bio: "Dedicated to providing white-glove customer care, ensuring seamless custom orders and doorstep installation.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-16">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              HERITAGE & CRAFTSMANSHIP
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              About Bene Decor
            </h1>
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-[640px]">
              Crafting timeless furniture that blends luxury, comfort, and exceptional craftsmanship.
            </p>
          </div>

          {/* Our Story Section (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
            {/* Left: Luxury Showroom Image */}
            <div className="relative h-[360px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-lg group">
              <Image
                src="/images/collections/sofa.jpeg"
                alt="Bené Decor Luxury Showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52] bg-white/90 px-3 py-1 rounded-full backdrop-blur-sm">
                  Jaipur Flagship Studio
                </span>
              </div>
            </div>

            {/* Right: Story Text */}
            <div className="flex flex-col gap-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                OUR JOURNEY
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
                Our Story
              </h2>
              <p className="text-base text-[#666666] leading-relaxed">
                Founded over 15 years ago in the historic artisan hub of Jaipur, Béné Decor was born out of a deep reverence for authentic wooden joinery and luxurious living. We believe that true luxury lies in pieces that age gracefully alongside your family.
              </p>
              <p className="text-base text-[#666666] leading-relaxed">
                Every dining table, accent chair, and sofa in our workshop is constructed using seasoned solid teak and Sheesham wood. Our team of master craftsmen hand-carves each detail, preserving generations of woodcraft techniques while incorporating modern ergonomic comfort.
              </p>
              <p className="text-base text-[#666666] leading-relaxed">
                Today, Béné Decor furnishes thousands of luxury residences, boutique hotels, and design-forward spaces across India. Our commitment remains unchanged: uncompromised quality, sustainable sourcing, and personalized customer care.
              </p>
            </div>
          </div>

          {/* Statistics Section (4 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 gap-2"
              >
                <span className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#A67C52]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              THE BENÉ DECOR ADVANTAGE
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
              >
                <span className="w-10 h-10 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-lg border border-[#16A34A]/20">
                  {feat.icon}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Team Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              MEET OUR LEADERSHIP
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
              The People Behind the Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {TEAM.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#A67C52] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white ring-2 ring-[#A67C52]/20">
                  {member.initials}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
                    {member.role}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          {/* Customer Promise Card */}
          <div className="w-full bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E5E5E5]/80 text-center flex flex-col items-center gap-4 mb-20 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              OUR UNCOMPROMISING COMMITMENT
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F] max-w-2xl">
              "We promise furniture that brings warmth, elegance, and generations of joy to your home."
            </h2>
            <p className="text-sm text-[#666666] max-w-xl">
              Every order is backed by our structural warranty, complimentary white-glove installation, and lifetime support.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#1F1F1F] to-[#2D2D2D] text-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center gap-6 shadow-xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Home?
            </h2>
            <p className="text-base text-zinc-300 max-w-md">
              Explore our luxury solid wood furniture collections and find the perfect piece for your living space.
            </p>
            <Link href="/shop" className="mt-2">
              <Button variant="primary" size="lg" className="py-4 px-8 text-base">
                Explore Collection
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
