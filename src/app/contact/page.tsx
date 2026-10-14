"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Send,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { showToast } = useToast();

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Bespoke Bridal Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast("Thank you. An atelier concierge will respond within 24 hours.", "success");
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        subject: "Bespoke Bridal Inquiry",
        message: "",
      });
    }, 800);
  };

  const faqs = [
    {
      q: "How can I verify the hallmarking on my jewellery?",
      a: "Every silver piece is stamped with the BIS 925 mark. Gold pieces carry the BIS triangle, purity mark (916 for 22K, 750 for 18K), and an individual 6-digit alphanumeric HUID stamped by a government certified hallmarking centre.",
    },
    {
      q: "Can I commission a bespoke or custom ring design?",
      a: "Yes. Our atelier collaborates with clients to craft bespoke solitaires, heirloom wedding bands, and bridal suites. Contact us via WhatsApp or submit the inquiry form to begin initial sketch consultations.",
    },
    {
      q: "What if my ring does not fit correctly?",
      a: "We provide complimentary 15-day resizing for all standard solitaire and band orders. Please refer to our digital Size Guide or visit our boutique for professional measuring.",
    },
    {
      q: "How do I maintain and clean my Valchandson silver pieces?",
      a: "Each order includes a treated microfiber polishing cloth. For deep rejuvenation, patrons are welcome to bring their pieces to our flagship showroom for complimentary ultrasonic polishing.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A68A5D] font-semibold">
          Client Services & Atelier
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
          Connect With Our Craftsmen
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light mt-3 leading-relaxed">
          Whether arranging a private showroom appointment, inquiring about bespoke bridal commissions, or requesting sizing advice, our team is at your service.
        </p>
      </div>

      {/* Grid: Boutique Info & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Boutique Details (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F4EFEB] border border-[#E8E2D8] rounded p-6 sm:p-8 space-y-6">
            <h2 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#1C1917] font-semibold border-b border-[#E8E2D8] pb-4">
              Flagship Atelier
            </h2>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Boutique Atelier:</p>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Guru Vidya Building 07, Hill Rd, Santosh Nagar, Bandra West, Mumbai, Maharashtra 400050
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Showroom Hours:</p>
                  <p className="text-stone-600 mt-0.5">
                    Monday to Saturday: 10:30 AM – 8:00 PM IST<br />
                    Sunday: By Private Prior Appointment Only
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Telephone Assistance:</p>
                  <a
                    href="tel:09833522819"
                    className="text-stone-600 hover:text-stone-900 mt-0.5 block font-mono hover:underline"
                  >
                    098335 22819
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#A68A5D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Electronic Correspondence:</p>
                  <a
                    href="mailto:akashzewar@gmail.com"
                    className="text-stone-600 hover:text-stone-900 mt-0.5 block hover:underline"
                  >
                    akashzewar@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-[#E8E2D8]">
              <a
                href="https://wa.me/919833522068?text=Hello%20Valchandson%20Jewellers,%20I%20would%20like%20to%20schedule%20a%20private%20bridal%20or%20jewellery%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#1C1917] hover:bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 rounded shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#D8C29D]" /> Chat on WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>

        {/* Right: Inquiry Form (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D8] rounded p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif-luxury text-2xl uppercase tracking-wider text-[#1C1917] font-semibold">
              Send an Atelier Inquiry
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Please share your preferred requirements. Our jewelry specialists will get in touch promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Radhika Sethi"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  placeholder="e.g. radhika@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="+91 98335 22819"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={inquiryForm.subject}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
                >
                  <option value="Bespoke Bridal Inquiry">Bespoke Bridal Commission</option>
                  <option value="Showroom Appointment">Showroom Private Appointment</option>
                  <option value="Ring Sizing Assistance">Ring Sizing Consultation</option>
                  <option value="Order Tracking">Order & Transit Status</option>
                  <option value="Other Inquiries">General Collector Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                Your Message / Custom Preferences
              </label>
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="Tell us about the gemstone preferences, ring size, or milestone occasion..."
                className="w-full p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded focus:outline-none focus:border-[#A68A5D]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1C1917] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A68A5D] transition-colors rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Transmitting to Atelier..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="pt-8 border-t border-[#E8E2D8]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A68A5D] font-semibold flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Patron Guidance
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-medium mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-[#E8E2D8] rounded shadow-sm space-y-2 text-xs"
            >
              <h4 className="font-semibold text-stone-900 text-sm leading-snug">
                {faq.q}
              </h4>
              <p className="text-stone-600 font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
