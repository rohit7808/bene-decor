"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const FAQS = [
  {
    question: "How long is delivery?",
    answer:
      "Our standard delivery time is 5 to 7 business days across India. Every order includes insured transit and white-glove room placement.",
  },
  {
    question: "Do you offer custom furniture?",
    answer:
      "Yes! Our master artisans specialize in bespoke furniture. You can select custom wood finishes, fabric upholstery, and dimensions tailored to your living space.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking across all Indian banks, and Cash on Delivery (COD).",
  },
  {
    question: "Do you provide installation?",
    answer:
      "Absolutely. Our white-glove delivery team will unbox, inspect, and complete full assembly installation in your desired room at no extra charge.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
              GET IN TOUCH
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F]">
              Contact Bene Decor
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-[640px]">
              We would love to hear from you. Whether you have questions, custom furniture requirements, or need support, our team is ready to help.
            </p>
          </div>

          {/* Contact Layout: Left Info + Right Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start mb-16">
            {/* Left Column: Contact Information Cards */}
            <div className="flex flex-col gap-5">
              {/* Address Card */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white text-xl border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                  📍
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52]">
                    Showroom Address
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base text-[#1F1F1F]">
                    Bene Decor Furniture
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Jaipur, Rajasthan, India
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white text-xl border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                  📞
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52]">
                    Phone Support
                  </span>
                  <a
                    href="tel:+919876543210"
                    className="font-bold text-base text-[#1F1F1F] hover:text-[#A67C52] transition-colors"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-xs text-[#666666]">
                    Mon - Sat from 10am to 7pm
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white text-xl border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                  📧
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52]">
                    Email Inquiries
                  </span>
                  <a
                    href="mailto:support@benedecor.com"
                    className="font-bold text-base text-[#1F1F1F] hover:text-[#A67C52] transition-colors"
                  >
                    support@benedecor.com
                  </a>
                  <p className="text-xs text-[#666666]">
                    24/7 online email assistance
                  </p>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E5E5]/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white text-xl border border-[#E5E5E5] shadow-sm text-[#A67C52]">
                  🕒
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#A67C52]">
                    Working Hours
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-base text-[#1F1F1F]">
                    Monday – Saturday
                  </h3>
                  <p className="text-xs text-[#666666]">
                    10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Contact Form */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-[#E5E5E5]/80 shadow-sm">
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F] mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-[#666666] mb-8">
                Fill out the form below and our design specialists will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#16A34A]/30 text-center flex flex-col items-center gap-4">
                  <span className="text-4xl text-[#16A34A]">✓</span>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1F1F1F]">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-[#666666] max-w-md">
                    Thank you for reaching out to Bené Decor. A member of our concierge team will respond shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                        Full Name *
                      </label>
                      <Input
                        placeholder="e.g. Ananya Roy"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="ananya@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                        Subject *
                      </label>
                      <Input
                        placeholder="e.g. Custom Dining Set Inquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please describe your requirements or questions..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      className="w-full rounded-[16px] bg-white border border-[#E5E5E5] p-4 text-sm text-[#1F1F1F] placeholder:text-[#666666] transition-all duration-300 focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52] focus:outline-none"
                    />
                  </div>

                  <Button variant="primary" size="lg" type="submit" className="mt-2 py-4">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Google Map Section Placeholder */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E5E5E5]/80 shadow-sm mb-16 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                  EXPERIENCE OUR COLLECTIONS
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
                  Visit Our Showroom
                </h2>
              </div>
              <span className="text-xs text-[#666666]">
                Bene Decor Flagship • Jaipur, Rajasthan
              </span>
            </div>

            {/* Static Map Card Graphic Placeholder */}
            <div className="relative h-[300px] sm:h-[380px] w-full rounded-2xl overflow-hidden border border-[#E5E5E5] bg-gradient-to-br from-stone-200 via-amber-50 to-stone-300 flex items-center justify-center p-6 text-center shadow-inner">
              <div className="flex flex-col items-center gap-3 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E5E5E5] max-w-md shadow-lg">
                <span className="text-3xl text-[#A67C52]">📍</span>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F]">
                  Bené Decor Flagship Studio
                </h3>
                <p className="text-xs text-[#666666]">
                  Tonk Road, Near Chokhi Dhani, Jaipur, Rajasthan 302022
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold text-[#16A34A]">Open Today (10 AM - 7 PM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-4 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F]">
              Have Questions? We Have Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5E5]/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
              >
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1F1F1F] flex items-center gap-2">
                  <span className="text-[#A67C52]">Q.</span>
                  {faq.question}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
