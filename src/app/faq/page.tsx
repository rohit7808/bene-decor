"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
  // Orders
  {
    id: "ord-1",
    category: "Orders",
    question: "How do I track my order status?",
    answer:
      "You can track your active orders under the 'My Orders' page in your profile, or click the tracking link sent to your registered email and phone number upon dispatch.",
  },
  {
    id: "ord-2",
    category: "Orders",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "Orders can be modified or cancelled within 24 hours of placement before our workshop begins wood carving and assembly. Please contact customer support immediately for changes.",
  },
  {
    id: "ord-3",
    category: "Orders",
    question: "Do I receive an official tax invoice with my order?",
    answer:
      "Yes, an official GST tax invoice with full itemized details and warranty documentation is sent to your registered email address upon checkout completion.",
  },

  // Shipping
  {
    id: "shp-1",
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 4 to 7 business days depending on your location across India. Remote locations may take up to 8–10 days.",
  },
  {
    id: "shp-2",
    category: "Shipping",
    question: "Do you provide free shipping?",
    answer:
      "Yes, Béné Decor provides 100% complimentary nationwide delivery on all furniture orders with zero hidden charges or handling fees.",
  },
  {
    id: "shp-3",
    category: "Shipping",
    question: "What is white-glove delivery?",
    answer:
      "Our white-glove delivery team brings the furniture into your room of choice, unboxes, performs full assembly installation, and removes packaging materials for a hassle-free setup.",
  },

  // Returns
  {
    id: "ret-1",
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "We offer a 10-day hassle-free return window for any manufacturing defect, finish inconsistency, or transit damage. Simply notify us upon delivery.",
  },
  {
    id: "ret-2",
    category: "Returns",
    question: "How do I initiate a return or replacement?",
    answer:
      "Contact our support concierge via the 'Contact Us' page or call +91 9928348586 within 10 days of delivery with your Order ID and photo verification.",
  },
  {
    id: "ret-3",
    category: "Returns",
    question: "How long does it take to process refunds?",
    answer:
      "Refunds are processed back to your original payment method (or bank account for COD) within 3 to 5 business days after quality verification.",
  },

  // Warranty
  {
    id: "war-1",
    category: "Warranty",
    question: "What does the Bené Decor warranty cover?",
    answer:
      "We offer a comprehensive 3-year structural warranty covering solid Sheesham and Teak wood frames, termite resistance, joints, and hardware integrity.",
  },
  {
    id: "war-2",
    category: "Warranty",
    question: "How do I claim warranty coverage?",
    answer:
      "To claim warranty coverage, email saadgifurniture@gmail.com with photographs of the item and your purchase invoice. Our repair specialist will inspect or replace the item.",
  },

  // Custom Furniture
  {
    id: "cst-1",
    category: "Custom Furniture",
    question: "Can I customize furniture dimensions and upholstery fabrics?",
    answer:
      "Yes! Our Jaipur studio specializes in bespoke furniture. You can select custom wood polishes (Teak, Walnut, Mahogany) and premium velvet or linen fabrics.",
  },
  {
    id: "cst-2",
    category: "Custom Furniture",
    question: "How long does custom furniture production take?",
    answer:
      "Bespoke custom pieces take approximately 12 to 18 days from design blueprint approval to final handcrafting, polishing, and delivery.",
  },

  // Payments
  {
    id: "pay-1",
    category: "Payments",
    question: "What payment methods are accepted?",
    answer:
      "We accept Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across all banks, and Cash on Delivery (COD).",
  },
  {
    id: "pay-2",
    category: "Payments",
    question: "Is my online payment transaction secure?",
    answer:
      "Absolutely. All online transactions are encrypted via 256-Bit SSL security layers certified by leading RBI-approved payment gateways.",
  },
  {
    id: "pay-3",
    category: "Payments",
    question: "Is Cash on Delivery available for all orders?",
    answer:
      "COD is supported nationwide up to ₹50,000. For higher value custom pieces, a small partial advance token payment is requested to start crafting.",
  },
];

const CATEGORIES = [
  "All Categories",
  "Orders",
  "Shipping",
  "Returns",
  "Warranty",
  "Custom Furniture",
  "Payments",
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [openFaqId, setOpenFaqId] = useState<string | null>("ord-1");

  const filteredFaqs =
    activeCategory === "All Categories"
      ? FAQS_DATA
      : FAQS_DATA.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">
      {/* Header Navigation */}
      <Navbar />

      <main className="py-10 sm:py-16">
        <Container>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-14">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              HELP CENTER &amp; SUPPORT
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[640px]">
              Find answers to the most common questions about Bene Decor furniture, orders, shipping and custom designs.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
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
                      : "bg-[#FAF8F5] text-[#666666] border border-[#E5E5E5] hover:text-[#1F1F1F] hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Premium Accordion List */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4 mb-20">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-[#FAF8F5] border-[#A67C52]/60 shadow-md"
                      : "bg-white border-[#E5E5E5]/80 shadow-sm hover:border-[#A67C52]/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] bg-[#A67C52]/10 px-2.5 py-1 rounded-md">
                        {faq.category}
                      </span>
                      <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base sm:text-lg text-[#1F1F1F]">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Plus / Minus Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-[#A67C52] text-white rotate-180"
                          : "bg-[#FAF8F5] text-[#A67C52] border border-[#E5E5E5]"
                      }`}
                    >
                      <span className="text-lg font-bold">
                        {isOpen ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-[#666666] leading-relaxed border-t border-[#E5E5E5]/60 pt-4 animate-[fadeIn_0.3s_ease-out]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Need Help Section */}
          <div className="w-full bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E5E5E5]/80 text-center flex flex-col items-center gap-5 shadow-sm max-w-4xl mx-auto">
            <div className="p-4 rounded-full bg-white border border-[#E5E5E5] text-[#A67C52] text-2xl shadow-sm">
              💬
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
              Didn't find your answer?
            </h2>

            <p className="text-base text-[#666666] max-w-md leading-relaxed">
              Our customer concierge team is available Monday to Saturday from 10 AM to 7 PM IST to assist you.
            </p>

            <Link href="/contact" className="mt-2">
              <Button variant="primary" size="lg" className="px-8 py-4">
                Contact Support
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
