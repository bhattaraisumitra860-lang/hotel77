import React from "react";
import { ArrowDown, MessageSquare, Compass, Hotel } from "lucide-react";
import { SiteSettings } from "../types";

interface HeroProps {
  settings: SiteSettings;
  onChangePath: (path: string) => void;
  onTrackClick: (type: "whatsapp" | "phone") => void;
}

export default function Hero({ settings, onChangePath, onTrackClick }: HeroProps) {
  const handleWhatsappClick = () => {
    onTrackClick("whatsapp");
    const encodedText = encodeURIComponent(settings.whatsappPrefilledText);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-navy-950 text-white">
      {/* Visual background image representing the palazzo exterior of Hotel 77 at dusk */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl || "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=80"}
          alt="Hotel 77 Palazzo Exterior"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[pulse_8s_infinite] transition-transform duration-[4000ms]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Curated Crown Badge */}
        <div 
          className="mb-6 flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-xs font-mono text-golden-400 tracking-widest uppercase animate-fade-in"
          id="hero-badge"
        >
          <Hotel className="w-3.5 h-3.5" />
          ESTABLISHED LONDON W1
        </div>

        {/* Brand headline */}
        <h1 
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-white max-w-4xl"
          id="hero-hotel-title"
        >
          {settings.hotelName || "Hotel 77"}
        </h1>

        <p 
          className="mt-6 font-serif text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl font-light italic tracking-wide"
          id="hero-tagline"
        >
          "{settings.tagline || "Where Heritage Meets Contemporary Elegance"}"
        </p>

        {/* Minimal location details and visual separation */}
        <div className="w-32 h-px bg-golden-600/60 my-8" />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={() => onChangePath("/rooms")}
            id="hero-explore-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-navy-900 rounded-xl font-serif text-base tracking-wide font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Compass className="w-4 h-4 text-golden-600" />
            Explore Rooms & Suites
          </button>
          <button
            onClick={handleWhatsappClick}
            id="hero-whatsapp-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-semibold shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Instant WhatsApp Desk
          </button>
        </div>

        {/* Floating contact indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5 grayscale opacity-80">
            ● Direct Phone Support
          </span>
          <span className="flex items-center gap-1.5 grayscale opacity-80">
            ● bespoke butler curation
          </span>
          <span className="flex items-center gap-1.5 grayscale opacity-80">
            ● private car coordinates
          </span>
        </div>

        {/* Slow oscillating scroll down assist */}
        <div 
          onClick={() => {
            const el = document.getElementById("featured-suites-anchor");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 hover:text-white transition-colors"
          id="hero-scroll-assist"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-golden-500" />
        </div>

      </div>
    </div>
  );
}
