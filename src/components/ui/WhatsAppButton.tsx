"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "919833522068",
  defaultMessage,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = defaultMessage
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
    : `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-row-reverse items-center gap-3">
      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none"
        aria-label="Contact Valchandson Atelier on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        
        {/* Subtle Pulse ring */}
        <span className="absolute -inset-1 rounded-full border border-[#25D366]/40 animate-ping pointer-events-none" />
      </a>

      {/* Tooltip banner */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-stone-900 border border-[#E8E2D8] px-3.5 py-2 rounded shadow-lg text-xs font-medium animate-fade-in">
          <span>Atelier Concierge WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
