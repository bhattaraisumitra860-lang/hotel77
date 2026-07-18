import React from "react";
import { 
  Users, 
  BedDouble, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  Mail, 
  Maximize2, 
  X, 
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Compass
} from "lucide-react";
import { Room, SiteSettings } from "../types";

interface RoomsSectionProps {
  rooms: Room[];
  settings: SiteSettings;
  onChangePath: (path: string) => void;
  onTrackClick: (type: "whatsapp" | "phone") => void;
  onTrackRoomView: (roomId: string) => void;
  filterFeaturedOnly?: boolean;
}

export default function RoomsSection({
  rooms,
  settings,
  onChangePath,
  onTrackClick,
  onTrackRoomView,
  filterFeaturedOnly = false,
}: RoomsSectionProps) {
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0);

  // Search, categories and filter state
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [guestsCount, setGuestsCount] = React.useState<number>(0); // 0 means any
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Unique categories
  const categories = React.useMemo(() => {
    const list = new Set(rooms.map(r => r.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  }, [rooms]);

  // Filtering Rooms
  const filteredRooms = React.useMemo(() => {
    return rooms.filter(room => {
      if (filterFeaturedOnly && !room.featured) return false;

      const matchCategory = selectedCategory === "All" || room.category === selectedCategory;
      const matchGuests = guestsCount === 0 || room.capacityGuests >= guestsCount;
      const matchSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchGuests && matchSearch;
    });
  }, [rooms, filterFeaturedOnly, selectedCategory, guestsCount, searchQuery]);

  const handleOpenRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setActiveImageIndex(0);
    // Track conversion
    onTrackRoomView(room.id);
  };

  const handlePhoneDial = () => {
    onTrackClick("phone");
    window.location.href = `tel:${settings.primaryPhone}`;
  };

  const handleWhatsappBooking = (roomName: string) => {
    onTrackClick("whatsapp");
    const textStr = `Hello Concierge. I am looking to direct-book the magnificent [${roomName}] suite at Hotel 77. Please coordinate private booking details with me soon.`;
    const encoded = encodeURIComponent(textStr);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // Safe Related Rooms Finder
  const relatedRooms = React.useMemo(() => {
    if (!selectedRoom) return [];
    return rooms.filter(r => r.id !== selectedRoom.id && r.enabled).slice(0, 2);
  }, [selectedRoom, rooms]);

  return (
    <div className="py-16 bg-gray-50" id="rooms-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" id="rooms-headblock">
          <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-3 font-semibold">
            Bespoke Sanctuary Suites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            {filterFeaturedOnly ? "The Featured Suites & Penthouses" : "Our Private Curated Rooms"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
            Every chamber is balanced with architectural grandeur and peaceful ambiance. Select and initiate a direct consult to confirm availability.
          </p>
        </div>



        {/* Room cards list */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm" id="rooms-empty">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="font-serif text-xl font-semibold text-gray-900">No matching suites found</h4>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Please adjust your search criteria to view other exclusive Park Lane lodgings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="rooms-grid">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                
                {/* Image panel with badge */}
                <div className="relative h-64 overflow-hidden bg-navy-900">
                  <img
                    src={room.images[0] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/95 border border-gray-100 backdrop-blur text-[10px] font-mono tracking-widest text-gray-800 uppercase rounded-full">
                    {room.category || "Lodging"}
                  </div>



                  {room.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-golden-500 text-white px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase rounded-md shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Signature Collection
                    </div>
                  )}
                </div>

                {/* Content body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-golden-800 transition-colors">
                    {room.name}
                  </h3>
                  
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed font-light">
                    {room.shortDescription}
                  </p>

                  <div className="mt-6 flex items-center gap-4 py-3 border-y border-gray-100 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      Up to {room.capacityGuests} Guests
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-gray-400" />
                      {room.capacityBeds} {room.capacityBeds > 1 ? "Beds" : "Bed"}
                    </span>
                  </div>

                  <div className="mt-6 pt-1 flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleOpenRoomDetails(room)}
                      className="text-xs font-mono uppercase tracking-wider text-gray-900 hover:text-golden-700 underline flex items-center gap-1 transition-all"
                    >
                      View Suite Features
                    </button>
                    <button
                      onClick={() => handleWhatsappBooking(room.name)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 border border-transparent text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp Curation
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

        {/* Home featured suites footer call */}
        {filterFeaturedOnly && (
          <div className="text-center mt-12">
            <button
              onClick={() => onChangePath("/rooms")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy-950 hover:bg-navy-950 hover:text-white rounded-xl text-xs font-mono uppercase tracking-widest text-navy-900 transition-all font-semibold"
            >
              Discover all suites and layouts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* DETAILED LIGHTBOX / IN-PAGE OVERLAY MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex justify-center p-4 sm:p-6 md:p-10" id="room-lightbox-modal">
          <div className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-none h-fit">
            
            {/* Close trigger */}
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 z-20 bg-white/95 border border-gray-100 hover:bg-navy-900 hover:text-white p-2 rounded-full shadow-lg transition-colors"
              id="close-lightbox-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Multiphoto gallery */}
            <div className="w-full lg:w-3/5 bg-gray-100 flex flex-col relative h-[300px] sm:h-[400px] lg:h-auto">
              <div className="relative w-full h-full">
                <img
                  src={selectedRoom.images[activeImageIndex] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"}
                  alt={`${selectedRoom.name} view`}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />

                {/* Left / Right chevron helpers for multi-images */}
                {selectedRoom.images.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === 0 ? selectedRoom.images.length - 1 : prev - 1));
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow pointer-events-auto transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === selectedRoom.images.length - 1 ? 0 : prev + 1));
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow pointer-events-auto transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dots / Thumbnail bar */}
              {selectedRoom.images.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                  {selectedRoom.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        activeImageIndex === idx 
                          ? "bg-white scale-125 border-navy-900" 
                          : "bg-white/50 border-white/20 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Full description block */}
            <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto lg:max-h-[85vh]">
              <div>
                
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono tracking-[0.2em] font-semibold text-golden-600 uppercase">
                    {selectedRoom.category || "SUITE ACCOMMODATION"}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    ID: {selectedRoom.id}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{selectedRoom.name}</h3>



                <div className="prose prose-sm text-gray-600 font-light mb-6">
                  <p className="leading-relaxed text-sm">{selectedRoom.fullDescription}</p>
                </div>

                {/* Capacity breakdown */}
                <div className="mb-6 grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                  <div>
                    <h5 className="text-[10px] font-mono uppercase text-gray-400 mb-1">Max Allocation</h5>
                    <p className="text-xs font-mono font-semibold text-gray-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {selectedRoom.capacityGuests} Distinguished Guests
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-mono uppercase text-gray-400 mb-1">Bedding arrangement</h5>
                    <p className="text-xs font-mono font-semibold text-gray-800 flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                      {selectedRoom.capacityBeds} Premium {selectedRoom.capacityBeds > 1 ? "Beds" : "Bed"}
                    </p>
                  </div>
                </div>

                {/* Amenities List */}
                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div className="mb-8">
                    <h5 className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-3">Custom Room Curation Includes</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRoom.amenities.map((amenity, key) => (
                        <div key={key} className="flex items-center gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-golden-600 flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* ACTION FOOTER BLOCK */}
              <div className="bg-golden-50/50 border border-golden-100/80 rounded-2xl p-5 mt-4" id="lightbox-cta-box">
                <span className="text-[10px] font-mono uppercase text-golden-800 tracking-wider block mb-2 font-semibold">
                  Secure This Sanctuary Room Direct
                </span>
                <p className="text-xs text-gray-600 font-light mb-4">
                  We host no online booking automated checkout channels to keep your transactions private. Contact the concierge directly via one click:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleWhatsappBooking(selectedRoom.name)}
                    className="flex items-center justify-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handlePhoneDial}
                    className="flex items-center justify-center gap-1.5 py-3 border border-navy-900 hover:bg-navy-900 hover:text-white text-gray-900 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Direct
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedRoom(null);
                      onChangePath("/contact");
                    }}
                    className="text-[10px] font-mono text-gray-500 hover:text-gray-900 underline uppercase tracking-wider"
                  >
                    Redirect to Custom Inquiries Page
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
