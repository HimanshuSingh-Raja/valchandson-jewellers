"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    text: "Complimentary Insured Express Delivery across India on orders above ₹5,000",
    linkText: "Learn More",
    href: "/about#shipping",
  },
  {
    text: "The Festive Heirloom 2026 Collection is now unveiled",
    linkText: "Explore New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    text: "100% BIS Hallmarked Purity Guarantee & Lifetime Atelier Care",
    linkText: "Our Promise",
    href: "/about#craftsmanship",
  },
];

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/store/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            if (data.settings.announcement_bar_enabled === "false") {
              setIsEnabled(false);
              return;
            }
            if (data.settings.announcement_bar_text) {
              setAnnouncements([
                {
                  text: data.settings.announcement_bar_text,
                  linkText: "Learn More",
                  href: "/about",
                },
                ...ANNOUNCEMENTS,
              ]);
            }
          }
        }
      } catch (err) {
        // Fallback to static announcements
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isEnabled || announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isEnabled, announcements.length]);

  if (!isEnabled) return null;

  const current = announcements[currentIndex] || announcements[0];

  return (
    <div className="bg-[#1C1917] text-[#FAF8F5] text-[11px] md:text-xs tracking-wider uppercase py-2 px-4 transition-colors border-b border-[#2D2A26] relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
          }
          className="p-1 hover:text-[#D8C29D] transition-colors hidden sm:block"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Sparkles className="w-3 h-3 text-[#D8C29D] shrink-0 animate-pulse hidden sm:inline-block" />
          <span className="font-light tracking-widest truncate">{current.text}</span>
          <Link
            href={current.href}
            className="hidden md:inline-block font-medium underline underline-offset-4 text-[#D8C29D] hover:text-white transition-colors ml-1"
          >
            {current.linkText}
          </Link>
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
          className="p-1 hover:text-[#D8C29D] transition-colors hidden sm:block"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
