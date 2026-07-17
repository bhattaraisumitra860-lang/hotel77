import React from "react";
import { Phone, MessageSquare, Shield, Menu, X } from "lucide-react";
import { SiteSettings, MenuItem } from "../types";
import Logo from "./Logo";

interface HeaderProps {
  settings: SiteSettings;
  menu: MenuItem[];
  currentPath: string;
  onChangePath: (path: string) => void;
  onTrackClick: (type: "whatsapp" | "phone") => void;
}

export default function Header({
  settings,
  menu,
  currentPath,
  onChangePath,
  onTrackClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handlePhoneClick = () => {
    onTrackClick("phone");
    window.location.href = `tel:${settings.primaryPhone}`;
  };

  const handleWhatsappClick = () => {
    onTrackClick("whatsapp");
    const encodedText = encodeURIComponent(settings.whatsappPrefilledText);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 border-b border-gray-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand area */}
          <div 
            onClick={() => onChangePath("/")} 
            className="flex items-center gap-2 cursor-pointer group"
            id="brand-logo-container"
          >
            <Logo className="w-10 h-10 rounded-lg object-contain" logoUrl={settings.logoUrl} />
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-navy-900 group-hover:text-navy-800 transition-colors uppercase block">
                {settings.hotelName || "Hotel 77"}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-golden-600 block leading-tight font-mono">
                Mayfair London
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menu.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onChangePath(item.path)}
                  className={`relative font-serif text-[15px] tracking-wide transition-colors py-2 ${
                    isActive 
                      ? "text-gray-900 font-medium" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-golden-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handlePhoneClick}
              id="header-phone-btn"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-navy-950 text-gray-800 rounded-full text-xs font-mono uppercase tracking-wider transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              {settings.primaryPhone}
            </button>
            <button
              onClick={handleWhatsappClick}
              id="header-whatsapp-btn"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Concierge
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-gray-900"
              id="mobile-menu-trigger"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute top-20 left-0 right-0 py-4 px-4 z-50">
          <div className="flex flex-col gap-4">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangePath(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-serif py-2.5 px-3 rounded-lg text-base transition-colors ${
                  currentPath === item.path 
                    ? "bg-gray-50 text-gray-900 font-medium border-l-2 border-golden-600 pl-2.5" 
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-px bg-gray-100 my-1" />
            
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => {
                  handlePhoneClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 uppercase"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Concierge
              </button>
              <button
                onClick={() => {
                  handleWhatsappClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-mono uppercase"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
