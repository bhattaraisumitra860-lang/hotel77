import React from "react";
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "../types";

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export default function GallerySection({ galleryItems }: GallerySectionProps) {
  const [activeTab, setActiveTab] = React.useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  // Compute tabs automatically based on available data
  const tabs = React.useMemo(() => {
    const list = new Set(galleryItems.map(item => item.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  }, [galleryItems]);

  // Filtered gallery dataset
  const filteredItems = React.useMemo(() => {
    if (activeTab === "All") return galleryItems;
    return galleryItems.filter(item => item.category === activeTab);
  }, [galleryItems, activeTab]);

  const handleOpenLightbox = (originalId: string) => {
    const idx = filteredItems.findIndex(g => g.id === originalId);
    if (idx >= 0) {
      setLightboxIndex(idx);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
    }
  };

  return (
    <div className="py-16 bg-white" id="gallery-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-3 font-semibold">
            Visual Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            The Hotel 77 Gallery
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-light leading-relaxed">
            Glance upon our private Mayfair palazzo exterior, the sleek contemporary interiors of Sartorial restaurant, and meticulously groomed suite coordinates.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="gallery-tabs-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-navy-950 text-white shadow-md font-semibold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry or flexible cards grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <span className="text-[15px] font-serif font-semibold text-gray-500 block">No visual media published</span>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6" id="gallery-photos-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`gallery-item-${item.id}`}
                className="break-inside-avoid relative overflow-hidden rounded-2xl group border border-gray-100 bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleOpenLightbox(item.id)}
              >
                <img
                  src={item.url}
                  alt={item.caption || "Hotel 77 luxury look"}
                  className="w-full object-cover rounded-2xl transition-transform duration-[6s] group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Dark overlay showing caption & magnifier */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between gap-3 text-white">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-golden-400 uppercase font-semibold">
                        {item.category}
                      </span>
                      <p className="font-serif text-sm font-medium tracking-wide mt-1 text-gray-100">{item.caption || "Exquisite Setting"}</p>
                    </div>
                    <div className="bg-white/10 border border-white/20 p-2 rounded-full backdrop-blur-md">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* OVERLAY GALLERY LIGHTBOX */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          id="gallery-lightbox"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-55 bg-white/10 hover:bg-white text-white hover:text-navy-950 p-2.5 rounded-full border border-white/15 transition-all cursor-pointer"
            id="close-gallery-lightbox-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Core photo container */}
          <div className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].caption || "Hotel 77 preview"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {/* Left Chevron */}
            <button
              onClick={handlePrev}
              className="absolute left-1/2 -translate-x-12 sm:left-4 sm:translate-x-0 -bottom-16 sm:top-1/2 sm:-translate-y-1/2 bg-white/5 hover:bg-white text-white hover:text-navy-950 border border-white/10 p-3 rounded-full transition-all"
              id="gallery-prev-btn"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Chevron */}
            <button
              onClick={handleNext}
              className="absolute right-1/2 translate-x-12 sm:right-4 sm:translate-x-0 -bottom-16 sm:top-1/2 sm:-translate-y-1/2 bg-white/5 hover:bg-white text-white hover:text-navy-950 border border-white/10 p-3 rounded-full transition-all"
              id="gallery-next-btn"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption footer */}
          <div className="text-center text-white mt-20 max-w-md px-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-mono tracking-widest text-golden-500 uppercase font-semibold">
              {filteredItems[lightboxIndex].category}
            </span>
            <p className="font-serif text-lg font-light italic mt-2 text-gray-200">
              "{filteredItems[lightboxIndex].caption || "Elegant Atmosphere"}"
            </p>
            <span className="text-xs text-gray-500 mt-2 font-mono block">
              Image {lightboxIndex + 1} of {filteredItems.length}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
