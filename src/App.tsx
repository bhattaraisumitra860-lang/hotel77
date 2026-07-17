import React from "react";
import {
  Phone,
  ShieldCheck,
  Award,
  Clock,
  Wifi,
  Wine,
  Utensils,
  ShieldAlert,
  ConciergeBell,
  HeartHandshake,
  Lock
} from "lucide-react";
import { CMSDatabase, Room, GalleryItem, Testimonial, ContactMessage, SiteSettings, CMSPage, MenuItem } from "./types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RoomsSection from "./components/RoomsSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import MapSection from "./components/MapSection";
import AdminPanel from "./components/AdminPanel";
import { defaultSettings, defaultRooms, defaultGallery, defaultTestimonials, defaultPages, defaultMenu } from "./defaultData";

export default function App() {
  const [currentPath, setCurrentPath] = React.useState<string>(() => {
    return window.location.hash.slice(1) || "/";
  });

  const [dbData, setDbData] = React.useState<{
    settings: SiteSettings;
    rooms: Room[];
    gallery: GalleryItem[];
    testimonials: Testimonial[];
    pages: CMSPage[];
    menu: MenuItem[];
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFAQIndex, setActiveFAQIndex] = React.useState<number | null>(null);
  const [refreshCounter, setRefreshCounter] = React.useState(0);

  // Sync window hash for clean SPA bookmarking support
  React.useEffect(() => {
    const handleHash = () => {
      const hashPath = window.location.hash.slice(1) || "/";
      setCurrentPath(prev => prev === hashPath ? prev : hashPath);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleNavigate = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    setCurrentPath(prev => prev === normalizedPath ? prev : normalizedPath);
    if (window.location.hash.slice(1) !== normalizedPath) {
      window.location.hash = normalizedPath;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackPageview(normalizedPath);
  };

  // Fetch initial raw public CMS data
  const fetchPublicData = async () => {
    try {
      // Timeout after 3s so the fallback kicks in quickly on static hosting (Vercel)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch("/api/public/data", { signal: controller.signal });
      clearTimeout(timeoutId);

      // Check content-type before trying to parse JSON.
      // On Vercel (static host), /api/public/data returns index.html (text/html)
      // which means there's no backend — fall back to default data immediately.
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const payload = await res.json();
        setDbData(payload);
        setIsLoading(false);
        return;
      }
      // Not JSON → no backend server → use static fallback
      console.warn("No backend API detected, using static default data for Vercel hosting.");
    } catch (err) {
      console.error("Could not fetch Hotel 77 public data, falling back to static default data", err);
    }
    loadDefaultFallback();
  };

  const loadDefaultFallback = () => {
    setDbData({
      settings: defaultSettings,
      rooms: defaultRooms,
      gallery: defaultGallery,
      testimonials: defaultTestimonials,
      pages: defaultPages,
      menu: defaultMenu
    });
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchPublicData();
  }, [refreshCounter]);

  // API Analytics tracking integrations
  const trackPageview = async (pathString: string) => {
    try {
      fetch("/api/public/track-pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathString })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const trackConversion = async (typeString: "whatsapp" | "phone") => {
    try {
      fetch("/api/public/track-conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: typeString })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const trackRoomView = async (roomIdString: string) => {
    try {
      fetch("/api/public/track-room-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: roomIdString })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Simple Markdown renderer helper
  const renderMarkdownContent = (markdownText: string) => {
    if (!markdownText) return null;
    const lines = markdownText.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={idx} className="font-serif text-2xl font-bold text-gray-900 mt-6 mb-3 border-l-2 border-golden-600 pl-3">{trimmed.replace("###", "")}</h3>;
      }
      if (trimmed.startsWith("##")) {
        return <h4 key={idx} className="font-serif text-xl font-bold text-navy-900 mt-5 mb-2.5">{trimmed.replace("##", "")}</h4>;
      }
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        return (
          <div key={idx} className="flex items-start gap-2.5 pl-4 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-golden-600 mt-2 flex-shrink-0" />
            <p className="text-gray-700 text-sm font-light font-sans">{trimmed.substring(1).trim()}</p>
          </div>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-3" />;
      }
      return <p key={idx} className="text-sm sm:text-base text-gray-600 font-light leading-relaxed my-3 font-sans">{trimmed}</p>;
    });
  };

  // Hardcoded premium static FAQs details
  const faqs = [
    {
      q: "Why is there no online checkout calendar booking form?",
      a: "As a distinct central London luxury boutique brand, we prioritize discretion and direct transaction integrity. All stays are planned as custom guest coordinate dialogs directly with our concierge desk. This protects key itineraries, ensures room selections are tailored, and guarantees premium pricing accuracy."
    },
    {
      q: "Can I coordinate airport limousine and secure parking arrangements?",
      a: "Yes. Our senior on-duty concierge will coordinates bespoke airport transport, secret subterranean parking, and specialized secure entry points upon direct request during WhatsApp or phone consultation."
    },
    {
      q: "What dining options exist in Sartorial Lounge?",
      a: "Our signature Michelin-calibre dining hall offers high-concept customized seasonal menus prepared by Chef de Cuisine. Private buyout reservations or room service degustation are coordinated directly."
    },
    {
      q: "Is there a wellness retreat or indoor pool?",
      a: "Yes, Hotel 77 houses a private indoor thermal pool sanctuary, massage suites, and fitness training systems accessible solely by our in-house suite residents."
    }
  ];

  if (isLoading || !dbData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-900 font-serif">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold text-lg animate-spin mx-auto">
            77
          </div>
          <p className="text-sm font-mono tracking-widest text-golden-600 uppercase">
            Hotel 77 loading
          </p>
        </div>
      </div>
    );
  }

  const { settings, rooms, gallery, testimonials, pages, menu } = dbData;

  // MAINTENANCE MODE BLANKET SCREEN
  if (settings.maintenanceMode && currentPath !== "/admin") {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6 text-center font-serif">
        <div className="max-w-md space-y-6">
          <Award className="w-16 h-16 text-golden-500 mx-auto animate-pulse" />
          <h1 className="text-4xl font-extrabold tracking-tight italic">Hotel 77 London</h1>
          <div className="w-20 h-px bg-golden-600 mx-auto" />
          <p className="text-gray-300 font-light text-base leading-relaxed">
            Our digital coordinates are receiving scheduled custom curator updates to serve our distinguished guests with elevated speed.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-400">
            Concierge lines remain open. <br />
            Primary: <a href={`tel:${settings.primaryPhone}`} className="text-golden-400 font-semibold">{settings.primaryPhone}</a>
          </div>
        </div>
      </div>
    );
  }

  // AMENITIES DATA MODEL
  const amenitiesList = [
    { icon: <Clock className="w-6 h-6 text-golden-600" />, title: "24/7 Personal Butler Curation", desc: "Private concierge assigned to coordinate custom meals, laundry, entries, and travel." },
    { icon: <Wifi className="w-6 h-6 text-golden-600" />, title: "Ultraband Acoustic Audio Systems", desc: "Equipped with Bang & Olufsen bespoke noise-filtering acoustics and high fiber access." },
    { icon: <Wine className="w-6 h-6 text-golden-600" />, title: "Bespoke Whiskey Cabinetry", desc: "Curated collection of aged regional spirits pre-stocked inside your chamber cellar." },
    { icon: <Utensils className="w-6 h-6 text-golden-600" />, title: "Michelin-Sartorial Fine Dining", desc: "Enjoy private in-room seasonal degustation or table buyouts coordinated anytime." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans" id="hotel-77-global-root">
      
      {/* Dynamic Header Component */}
      <Header
        settings={settings}
        menu={menu}
        currentPath={currentPath}
        onChangePath={handleNavigate}
        onTrackClick={trackConversion}
      />

      {/* CORE ROUTER LAYOUTS */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOMEPAGE (/) */}
        {currentPath === "/" && (
          <div className="space-y-20 animate-fade-in" id="view-homepage">
            
            {/* Bold Luxury Hero */}
            <Hero
              settings={settings}
              onChangePath={handleNavigate}
              onTrackClick={trackConversion}
            />

            {/* Premium Slogan Section */}
            <section className="max-w-4xl mx-auto px-4 text-center py-6" id="homepage-slogan">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-golden-600 block mb-4 font-semibold">
                An Elite London Sanctuary
              </span>
              <p className="font-serif text-3xl sm:text-4xl text-gray-900 italic font-light leading-snug">
                "We discard automated checkout portals because elite service demands active, real-time collaboration with key personnel."
              </p>
              <p className="mt-6 text-sm text-gray-500 font-mono uppercase tracking-widest">
                — Ground Operations Office, Park Lane
              </p>
            </section>

            {/* Featured Rooms Grid Anchor */}
            <div id="featured-suites-anchor">
              <RoomsSection
                rooms={rooms}
                settings={settings}
                onChangePath={handleNavigate}
                onTrackClick={trackConversion}
                onTrackRoomView={trackRoomView}
                filterFeaturedOnly={true}
              />
            </div>

            {/* Amenities Section */}
            <section className="py-16 bg-white border-y border-gray-100" id="homepage-amenities">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-2 font-semibold">
                    The Hotel 77 Crest
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    Sartorial Amenities &amp; Services
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {amenitiesList.map((a, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow transition-shadow">
                      <div>
                        <div className="mb-4">{a.icon}</div>
                        <h4 className="font-serif text-[17px] font-bold text-gray-900">{a.title}</h4>
                        <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Location Map Section */}
            <MapSection 
              hotelName={settings.hotelName} 
              address={settings.address} 
              mapUrl={settings.googleMapsEmbedUrl}
            />

            {/* Gallery Preview Box */}
            {gallery.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="homepage-gallery-preview">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-2 font-semibold">Visual Portfolios</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Grandeur Details</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {gallery.slice(0, 6).map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border bg-gray-50 group cursor-pointer" onClick={() => handleNavigate("/gallery")}>
                      <img src={img.url} alt="look preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/50 transition-colors flex items-center justify-center">
                        <span className="text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-semibold">View Gallery</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Interactive FAQs Accordion */}
            <section className="py-16 bg-gray-50 border-t border-gray-100" id="homepage-faqs">
              <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                  <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-2 font-semibold">Reservations Support</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Direct Contacts Guidelines &amp; FAQs</h3>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFAQIndex === idx;
                    return (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <button
                          onClick={() => setActiveFAQIndex(isOpen ? null : idx)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-[15px] font-semibold text-gray-900 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <span className="text-lg text-golden-600 font-mono">{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className="p-5 pt-0 text-sm text-gray-600 font-light leading-relaxed font-sans border-t border-gray-50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Contact CTA banner */}
            <section className="max-w-5xl mx-auto px-4 py-8 mb-10" id="homepage-cta-banner">
              <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80" alt="lobby background" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight italic">Coordinate Your Park Lane Escape</h3>
                  <p className="text-gray-300 text-sm sm:text-base font-light max-w-xl mx-auto">
                    Initiate a direct dialog with our Mayfair concierge lounge now. We are fully equipped for discrete coordinates, custom bookings, and butler planning.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
                    <button
                      onClick={() => {
                        trackConversion("whatsapp");
                        const enc = encodeURIComponent(settings.whatsappPrefilledText);
                        window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${enc}`, "_blank");
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                    >
                      Instant WhatsApp Connect
                    </button>
                    <button
                      onClick={() => handleNavigate("/contact")}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-100 text-navy-900 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                    >
                      Custom Inquiry Form
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: ALL ROOMS CATALOGUE (/rooms) */}
        {currentPath === "/rooms" && (
          <div className="animate-fade-in" id="view-rooms-page">
            <RoomsSection
              rooms={rooms}
              settings={settings}
              onChangePath={handleNavigate}
              onTrackClick={trackConversion}
              onTrackRoomView={trackRoomView}
              filterFeaturedOnly={false}
            />
          </div>
        )}

        {/* VIEW 3: PORTFOLIO GALLERY (/gallery) */}
        {currentPath === "/gallery" && (
          <div className="animate-fade-in" id="view-gallery-page">
            <GallerySection galleryItems={gallery} />
          </div>
        )}

        {/* VIEW 4: CONTACT PAGE (/contact) */}
        {currentPath === "/contact" && (
          <div className="animate-fade-in" id="view-contact-page">
            <ContactSection
              settings={settings}
              onTrackClick={trackConversion}
            />
          </div>
        )}

        {/* VIEW 5: DYNAMIC CMS PAGES (/page/:slug) */}
        {currentPath.startsWith("/page/") && (
          <div className="py-16 bg-white animate-fade-in" id="view-cms-pages">
            <div className="max-w-3xl mx-auto px-4">
              {(() => {
                const slug = currentPath.replace("/page/", "");
                const pageItem = pages.find(p => p.slug === slug);
                if (!pageItem) {
                  return (
                    <div className="text-center py-20">
                      <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                      <h3 className="font-serif text-2xl font-bold text-gray-900">404 - Page Coordinates Missing</h3>
                      <button onClick={() => handleNavigate("/")} className="mt-4 text-xs font-mono text-golden-600 underline uppercase tracking-wider">Back to home</button>
                    </div>
                  );
                }

                return (
                  <article className="space-y-6">
                    <span className="text-[10px] font-mono tracking-widest text-golden-600 uppercase font-semibold">
                      Official Page coordinates
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight border-b border-gray-100 pb-4">
                      {pageItem.title}
                    </h1>
                    <div className="prose max-w-none prose-amber mt-8 font-light">
                      {renderMarkdownContent(pageItem.content)}
                    </div>
                    <div className="pt-8 border-t border-gray-100 text-[10px] font-mono text-gray-400">
                      Coordinates last verified on: {new Date(pageItem.lastUpdated).toLocaleDateString()}
                    </div>
                  </article>
                );
              })()}
            </div>
          </div>
        )}

        {/* VIEW 6: COCKPIT ADMIN CONTROL (/admin) */}
        {currentPath === "/admin" && (
          <div className="animate-fade-in" id="view-admin-dashboard">
            <AdminPanel
              onLogout={() => {
                fetchPublicData();
              }}
              publicDB={dbData as any}
              triggerRefresh={() => setRefreshCounter(prev => prev + 1)}
            />
          </div>
        )}

      </main>

      {/* CORE LUXURY FOOTER PORTAL */}
      <footer className="bg-navy-950 text-white pt-16 pb-6 border-t border-navy-900 font-sans mt-20 relative" id="hotel-77-global-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white text-navy-900 font-serif font-black flex items-center justify-center text-sm">77</div>
              <span className="font-serif text-lg font-bold tracking-widest text-golden-500 uppercase">{settings.hotelName}</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              An award-winning discrete lodging experience situated high in Westminster, London. We foster customized care over automated reservations queues.
            </p>
            <div className="pt-2 text-xs text-gray-500 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              SOCIALLY DISCRETE &amp; SECURE OPERATED
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-mono uppercase tracking-widest text-golden-500 font-semibold">Navigation</h5>
            <ul className="space-y-2 text-xs font-mono text-gray-400">
              <li><button onClick={() => handleNavigate("/")} className="hover:text-white transition-colors">Return Home</button></li>
              <li><button onClick={() => handleNavigate("/rooms")} className="hover:text-white transition-colors">Chamber Specs &amp; Details</button></li>
              <li><button onClick={() => handleNavigate("/gallery")} className="hover:text-white transition-colors">Grandeur Portfolio</button></li>
              <li><button onClick={() => handleNavigate("/contact")} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          {/* Guidelines Links Col */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-mono uppercase tracking-widest text-golden-500 font-semibold">Information</h5>
            <ul className="space-y-2 text-xs font-mono text-gray-400">
              {pages.map((p) => (
                <li key={p.id}>
                  <button onClick={() => handleNavigate(`/page/${p.slug}`)} className="hover:text-white transition-colors">
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Global base disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            {settings.footerContent || "© 2026 Hotel 77 Operations. All Rights Reserved."}
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1"><ConciergeBell className="w-3.5 h-3.5" /> Direct Support</span>
            <span className="flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5" /> High Discretion</span>
          </div>
        </div>

        {/* Hidden CMS Link - Visible on hover */}
        <div className="group relative mt-4 flex justify-center">
          <button
            onClick={() => handleNavigate("/admin")}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 px-4 py-2 text-[10px] font-mono text-gray-500 hover:text-golden-400 uppercase tracking-widest"
            title="Admin Panel"
          >
            <Lock className="w-3.5 h-3.5" />
            CMS Panel
          </button>
        </div>

      </footer>

    </div>
  );
}
