import { SiteSettings, Room, GalleryItem, Testimonial, CMSPage, MenuItem, AnalyticsData } from "./types";

export const defaultSettings: SiteSettings = {
  hotelName: "Hotel 77",
  tagline: "Where Heritage Meets Contemporary Elegance",
  logoUrl: "",
  faviconUrl: "",
  accentColor: "indigo", // indigo, amber, emerald, rose, slate
  primaryPhone: "+44 20 7777 0177",
  secondaryPhone: "+44 20 7777 0277",
  whatsappNumber: "+44777777177",
  whatsappPrefilledText: "Hello, I am interested in booking a luxury stay at Hotel 77. Please let me know your rates and availability of suites.",
  emailAddress: "concierge@hotel77.com",
  address: "77 Park Lane, London, W1K 1QA, United Kingdom",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d2483.1895648834947!2d-0.1558231!3d51.509355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487605330e2f8955%3A0xe5eb6c7ebd286d99!2sPark%20Ln%2C%20London!5e0!3m2!1sen!2suk!4v1689000000000!5m2!1sen!2suk",
  heroImageUrl: "https://images.unsplash.com/photo-1542314831-c6a420828f41?auto=format&fit=crop&w=800&q=80",
  instagramUrl: "https://instagram.com/hotel77",
  facebookUrl: "https://facebook.com/hotel77",
  twitterUrl: "https://twitter.com/hotel77",
  seoTitle: "Hotel 77 | Luxury Boutique Hotel",
  seoDescription: "Experience unparalleled contemporary luxury at Hotel 77, located in the prestigious heart of London. Impeccable bespoke services and timeless suites await.",
  seoKeywords: "luxury hotel london, boutique hotel west end, park lane suites, hotel 77, exclusive accommodation",
  footerContent: "© 2026 Hotel 77 Operations Ltd. Crafted for direct booking excellence.",
  maintenanceMode: false
};

export const defaultRooms: Room[] = [
  {
    id: "suite-77",
    name: "The Signature Suite 77",
    shortDescription: "Our flagship double-level apartment featuring breathtaking views and bespoke mid-century design.",
    fullDescription: "Designed for the ultimate connoisseur, The Signature Suite 77 combines high-ceilinged Edwardian architecture with minimalist German engineering. Enjoy a private marble fireplace, floor-to-ceiling soundproof acoustic windows, and a state-of-the-art master bedroom. Includes round-the-clock personal butler service, complimentary airport limousine transfer, and private cocktail cupboard setup.",
    capacityGuests: 4,
    capacityBeds: 2,
    amenities: ["24/7 Butler Support", "Private Bar & Lounge", "Carrara Marble Fireplace", "Limousine Services", "Soundproof Acoustic Windows", "Dyson Supersonic Dryer", "Frette Linens", "Bang & Olufsen Audio"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    enabled: true,
    category: "Presidential Suit"
  },
  {
    id: "deluxe-park",
    name: "Deluxe Park King Room",
    shortDescription: "Elegant spatial beauty overlooking beautiful greenery with private workspace and rain shower.",
    fullDescription: "Perfect for corporate leadership or executive travelers, the Deluxe Park Room offers a stunning vista of Westminster and the Royal Parks. Features an curated selection of modern photography, an ergonomic solid walnut writing desk, automatic circadian dimming lighting, and a rainfall sensory wet-room clad in graphite slate.",
    capacityGuests: 2,
    capacityBeds: 1,
    amenities: ["Sensory Rain Shower", "Pre-stocked Wine Cooler", "Walnut Executive Desk", "Nespresso Expert Machine", "Circadian Smart Lighting", "Plush Kimonos & Slippers"],
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    enabled: true,
    category: "Deluxe King"
  },
  {
    id: "executive-suite",
    name: "Executive Penthouse Suite",
    shortDescription: "Plush elevated living spanning the top floor with wrap-around private terrace balcony.",
    fullDescription: "Occupying the entire western crest of our top floor, the Penthouse Suite is defined by its architectural layout and panoramic wrap-around terrace. An open-concept living area splits into a curated private library, entertainment parlor, and a grand master bedroom detailed with solid brass trim and hand-tufted carpets.",
    capacityGuests: 2,
    capacityBeds: 1,
    amenities: ["Private Wrap-around Balcony", "Walk-in Dressing Parlor", "Bespoke Whiskey Cabinet", "Deep Soaking Freestanding Tub", "Smart Heated Toilets", "Private Lift Entrance"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    enabled: true,
    category: "Penthouse"
  },
  {
    id: "classic-double",
    name: "Atelier Double Room",
    shortDescription: "Cozy metropolitan sanctuary celebrating British heritage with elegant bespoke textures.",
    fullDescription: "Our entry room celebrates curated micro-living. Features customized wool fabrics, curated travel literature collections, a sleek smart TV screen, and a beautiful walk-in tiled shower suite. Perfect for solo explorers or couples demanding high-quality standards in a compact city sanctuary.",
    capacityGuests: 2,
    capacityBeds: 1,
    amenities: ["Heritage Wool Linens", "Smart Apple TV Setup", "Heated Towel Racks", "Organic Botanical Toiletries", "Bespoke Minibar Selection"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    enabled: true,
    category: "Standard Double"
  }
];

export const defaultGallery: GalleryItem[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80", category: "Exterior", caption: "The Historic Facade Illuminated at Dusk" },
  { id: "g2", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80", category: "Interior", caption: "The Grand Reception Lounge & Concierge Desk" },
  { id: "g3", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", category: "Dining", caption: "Sartorial Restaurant - Michelin Dining Space" },
  { id: "g4", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80", category: "Interior", caption: "Thermal Pools and Indoor Wellness Sanctuary" },
  { id: "g5", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", category: "Rooms", caption: "Suite 77 Living and Dressing Quarters" },
  { id: "g6", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", category: "Rooms", caption: "Breathtaking Views from the Penthouse Balcony" }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    authorName: "Alistair Sterling",
    rating: 5,
    content: "The level of tailored curation at Hotel 77 is utterly exceptional. From the moment the airport vehicle arrived to the prompt, pre-filled WhatsApp concierge support, it was an incredibly smooth, discrete, and stylish London retreat.",
    source: "TripAdvisor",
    featured: true
  },
  {
    id: "t2",
    authorName: "Marie de Tourvel",
    rating: 5,
    content: "No online booking stress, no automated cookie-cutter confirmations—just direct, hyper-fast, highly personalized WhatsApp care. The Signature Suite 77 is a masterpiece of modern luxury architecture.",
    source: "Google Places Premier",
    featured: true
  },
  {
    id: "t3",
    authorName: "Kenzo Takahashi",
    rating: 5,
    content: "An immaculate, design-led boutique haven in central London. Extreme privacy combined with warm hospitality. Highly recommended for travelers valuing quiet high-end craftsmanship.",
    source: "Direct Guest Survey",
    featured: true
  }
];

export const defaultPages: CMSPage[] = [
  {
    id: "about",
    slug: "about",
    title: "The Legacy of Hotel 77",
    content: `### A Sanctuary of Rare Craftsmanship

Nestled comfortably in the historical avenues of Park Lane, Hotel 77 stands as a monument to refined living and absolute privacy. Established originally as an elegant high-society townhouse, the brickwork and cornices preserve a grand heritage, while the interiors have been reconstructed by pioneering designers to tell a tale of boutique modernity.

Our philosophy dismisses the modern automated booking assembly line. We believe true hospitality is a collaborative, human affair. Every reservation begins as a dialogue with our concierge team, crafting bespoke itineraries, coordinating secret entries, or tailoring culinary menus before your arrival.

* **Design Philosophy:** Understated elegance, soft custom ambient tones, sustainable acoustics.
* **Service Ethos:** 24-hour dedicated attention without intrusive presence.
* **The Heart of London:** Minutes from Mayfair, Hyde Park, and elite couture.`,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "terms",
    slug: "terms",
    title: "Terms and Direct Accommodation Guidelines",
    content: `### Respect, Privacy, and Elite Living

Welcome to Hotel 77. Because we run an exclusive direct contact lodging model, the following guidelines govern reservations and luxury stays:

1. **Direct Communication Requirement:** All reservations are orchestrated via direct phone consult or verified WhatsApp message. We hold no automated inventory online to guard the safety of our guests.
2. **Cancellation and Rescheduling:** Changes to reserved stays must be communicated directly to your assigned concierge at least 72 hours prior to scheduled arrival.
3. **Privacy and Media:** We maintain a absolute privacy mandate. Photography of other distinguished guests in common luxury spaces like the Sartorial Lounge is strictly prohibited.
4. **Pet Lodging:** Specialized luxury pet suites are available upon prior notice to curate custom allergen-free environments.`,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "privacy",
    slug: "privacy",
    title: "Privacy & Discretion Protocol",
    content: `### Your Integrity is Our Paramount Priority

At Hotel 77, your discretion is protected by institutional safeguards. We collect and handle details solely to support personalized communications for direct direct-to-concierge planning:

* **No Selling of Guest Data:** We do not broker, trade, or distribute your name, email, or telephone logs.
* **Temporary Messaging Storage:** Inquiries made through the contact portal are hosted on secure local partitions, visible exclusively to senior management in the LuxuryAdmin panel.
* **Secure Communications:** Standard WhatsApp communications leverage end-to-end encryption protocols.
* **CCTV and Security:** Visual recordings of entrances are stored on-site with automatic overwrite cycles to defend secure retreats.`,
    lastUpdated: new Date().toISOString()
  }
];

export const defaultMenu: MenuItem[] = [
  { id: "mn1", label: "Home", path: "/", order: 1 },
  { id: "mn2", label: "Rooms & Suites", path: "/rooms", order: 2 },
  { id: "mn3", label: "About", path: "/page/about", order: 3 },
  { id: "mn4", label: "Gallery", path: "/gallery", order: 4 },
  { id: "mn5", label: "Contact", path: "/contact", order: 5 }
];

export const defaultAnalytics: AnalyticsData = {
  pageViews: { "/": 194, "/rooms": 87, "/gallery": 42, "/contact": 35 },
  conversions: { whatsappClicks: 32, phoneClicks: 18, formSubmissions: 5 },
  roomViews: { "suite-77": 64, "deluxe-park": 42, "executive-suite": 38, "classic-double": 12 }
};
