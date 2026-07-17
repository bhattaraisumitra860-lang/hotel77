import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import bcrypt from "bcryptjs";
import { CMSDatabase, Room, GalleryItem, Testimonial, ContactMessage, SiteSettings, CMSPage, MenuItem, AnalyticsData } from "./src/types.js";

// Paths
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "cms_db.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "upload-" + Date.now() + ext);
  }
});
const upload = multer({ storage });

// Initial default state is prepared beautifully with high-quality luxury records
const defaultSettings: SiteSettings = {
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

const defaultRooms: Room[] = [
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

const defaultGallery: GalleryItem[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80", category: "Exterior", caption: "The Historic Facade Illuminated at Dusk" },
  { id: "g2", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80", category: "Interior", caption: "The Grand Reception Lounge & Concierge Desk" },
  { id: "g3", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", category: "Dining", caption: "Sartorial Restaurant - Michelin Dining Space" },
  { id: "g4", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80", category: "Interior", caption: "Thermal Pools and Indoor Wellness Sanctuary" },
  { id: "g5", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", category: "Rooms", caption: "Suite 77 Living and Dressing Quarters" },
  { id: "g6", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", category: "Rooms", caption: "Breathtaking Views from the Penthouse Balcony" }
];

const defaultTestimonials: Testimonial[] = [
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

const defaultMessages: ContactMessage[] = [
  {
    id: "m1",
    name: "Lady Penelope Crewe",
    email: "penelope.crewe@mayfair.co.uk",
    phone: "+44 7911 123456",
    message: "I am planning an exclusive dinner event in the Sartorial dining quarters for 14 distinguished guests on September 15th. Do you offer private buyout options or customized menu pairings?",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    read: false,
    notes: "Awaiting confirmation from executive chef regarding bespoke menu availability. VIP guest."
  },
  {
    id: "m2",
    name: "Robert Downey Jr.",
    email: "robbie@rdjproduction.com",
    phone: "+1 310 555 0192",
    message: "Looking to charter the top penthouse suite for 6 nights starting early next month. Please have the senior concierge reach out to me via phone to discuss security precautions and secret luggage parking.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    notes: "Followed up. Booked via primary concierge WhatsApp chat. Highlighted as a premium conversion."
  }
];

const defaultPages: CMSPage[] = [
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

const defaultMenu: MenuItem[] = [
  { id: "mn1", label: "Home", path: "/", order: 1 },
  { id: "mn2", label: "Rooms & Suites", path: "/rooms", order: 2 },
  { id: "mn3", label: "About", path: "/page/about", order: 3 },
  { id: "mn4", label: "Gallery", path: "/gallery", order: 4 },
  { id: "mn5", label: "Contact", path: "/contact", order: 5 }
];

const defaultAnalytics: AnalyticsData = {
  pageViews: { "/": 194, "/rooms": 87, "/gallery": 42, "/contact": 35 },
  conversions: { whatsappClicks: 32, phoneClicks: 18, formSubmissions: 5 },
  roomViews: { "suite-77": 64, "deluxe-park": 42, "executive-suite": 38, "classic-double": 12 }
};

// Help load / save database helper
function loadDB(): CMSDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      // Migrate legacy string sessions to Session objects
      if (Array.isArray(db.activeSessions) && db.activeSessions.length > 0 && typeof db.activeSessions[0] === "string") {
        db.activeSessions = db.activeSessions.map((t: string) => ({ token: t, createdAt: Date.now() }));
        saveDB(db);
      }
      // Migrate plain-text password to bcrypt hash if needed
      if (db.adminPasswordHash && !db.adminPasswordHash.startsWith("$2")) {
        db.adminPasswordHash = bcrypt.hashSync(db.adminPasswordHash, 10);
        saveDB(db);
      }
      return db;
    }
  } catch (error) {
    console.error("Failed to load CMS database, using default values", error);
  }

  // Create default db
  const defaultDB: CMSDatabase = {
    settings: defaultSettings,
    rooms: defaultRooms,
    gallery: defaultGallery,
    testimonials: defaultTestimonials,
    messages: defaultMessages,
    pages: defaultPages,
    menu: defaultMenu,
    analytics: defaultAnalytics,
    adminPasswordHash: bcrypt.hashSync("admin77", 10),
    activeSessions: []
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: CMSDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save CMS database", error);
  }
}

async function startServer() {
  const app = express();
  // Serve uploaded files publicly
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use(express.json({ limit: "10mb" }));

  // Handle base64 image uploads
  app.use(express.raw({ type: "image/*", limit: "10mb" }));

  // Static files or upload simulations
  // We don't have physically persistent disk-based image uploads, but we can accept drag-drop base64 or link URLs for CMS, which is infinitely robust and never fails!

  // Helpers
  const getDB = () => loadDB();
  const updateDB = (modifier: (db: CMSDatabase) => void) => {
    const db = loadDB();
    modifier(db);
    saveDB(db);
  };

  // Middlewares
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No authorization header." });
      return;
    }
    const token = authHeader.replace("Bearer ", "");
    const db = getDB();
    const session = db.activeSessions.find(s => s.token === token);
    if (session && (Date.now() - session.createdAt) < 24 * 60 * 60 * 1000) {
      next();
    } else {
      // Clean up expired session if found
      if (session) {
        updateDB((d) => {
          d.activeSessions = d.activeSessions.filter(s => s.token !== token);
        });
      }
      res.status(401).json({ error: "Session expired or invalid token." });
    }
  };

  // PUBLIC ENDPOINTS
  app.get("/api/public/data", (req, res) => {
    const db = getDB();
    // Return only active/public stuff to optimize and shield secrets
    res.json({
      settings: db.settings,
      rooms: db.rooms.filter(r => r.enabled),
      gallery: db.gallery,
      testimonials: db.testimonials,
      pages: db.pages,
      menu: db.menu.sort((a,b) => a.order - b.order)
    });
  });

  // Track page views
  app.post("/api/public/track-pageview", (req, res) => {
    const { path: routePath } = req.body;
    if (!routePath) {
      res.status(400).json({ error: "Missing path parameter." });
      return;
    }
    updateDB((db) => {
      if (!db.analytics) db.analytics = defaultAnalytics;
      if (!db.analytics.pageViews) db.analytics.pageViews = {};
      db.analytics.pageViews[routePath] = (db.analytics.pageViews[routePath] || 0) + 1;
    });
    res.json({ success: true });
  });

  // Track clicks (phone conversion, WhatsApp conversion)
  app.post("/api/public/track-conversion", (req, res) => {
    const { type } = req.body; // "whatsapp", "phone"
    updateDB((db) => {
      if (!db.analytics) db.analytics = defaultAnalytics;
      if (!db.analytics.conversions) db.analytics.conversions = { whatsappClicks: 0, phoneClicks: 0, formSubmissions: 0 };
      if (type === "whatsapp") {
        db.analytics.conversions.whatsappClicks += 1;
      } else if (type === "phone") {
        db.analytics.conversions.phoneClicks += 1;
      }
    });
    res.json({ success: true });
  });

  // Track specific room views
  app.post("/api/public/track-room-view", (req, res) => {
    const { roomId } = req.body;
    if (!roomId) {
      res.status(400).json({ error: "Missing roomId." });
      return;
    }
    updateDB((db) => {
      if (!db.analytics) db.analytics = defaultAnalytics;
      if (!db.analytics.roomViews) db.analytics.roomViews = {};
      db.analytics.roomViews[roomId] = (db.analytics.roomViews[roomId] || 0) + 1;
    });
    res.json({ success: true });
  });

  // Public Submit contact query
  app.post("/api/public/contact", (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required." });
      return;
    }
    const newMessage: ContactMessage = {
      id: "msg-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name,
      email,
      phone: phone || "",
      message,
      createdAt: new Date().toISOString(),
      read: false,
      notes: ""
    };
    updateDB((db) => {
      if (!db.messages) db.messages = [];
      db.messages.unshift(newMessage);
      if (!db.analytics) db.analytics = defaultAnalytics;
      if (!db.analytics.conversions) db.analytics.conversions = { whatsappClicks: 0, phoneClicks: 0, formSubmissions: 0 };
      db.analytics.conversions.formSubmissions += 1;
    });
    res.json({ success: true, message: "Thank you. Your discrete custom request has been routed to the concierge office." });
  });

  // --- ADMIN ENDPOINTS ---

  // Upload endpoint
  app.post("/api/admin/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });

  // Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const db = getDB();
    if (bcrypt.compareSync(password, db.adminPasswordHash)) {
      const token = "tok-" + crypto.randomBytes(32).toString("hex");
      updateDB((d) => {
        if (!d.activeSessions) d.activeSessions = [];
        d.activeSessions.push({ token, createdAt: Date.now() });
      });
      res.json({ success: true, token });
    } else {
      res.status(400).json({ error: "Invalid password key. Connection rejected." });
    }
  });

  // Logout
  app.post("/api/admin/logout", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      updateDB((db) => {
        db.activeSessions = (db.activeSessions || []).filter(s => s.token !== token);
      });
    }
    res.json({ success: true });
  });

  // Fetch full Admin CMS layout (all tables + auth secrets)
  app.get("/api/admin/data", requireAuth, (req, res) => {
    const fullDb = getDB();
    const { adminPasswordHash, activeSessions, ...safeData } = fullDb;
    res.json(safeData);
  });

  // Update Global Settings
  app.post("/api/admin/update-settings", requireAuth, (req, res) => {
    const newSettings: SiteSettings = req.body;
    updateDB((db) => {
      db.settings = { ...db.settings, ...newSettings };
    });
    res.json({ success: true, settings: getDB().settings });
  });

  // Save/Update/Create a Room
  app.post("/api/admin/rooms", requireAuth, (req, res) => {
    const room: Room = req.body;
    if (!room.name) {
      res.status(400).json({ error: "Room name is required." });
      return;
    }
    updateDB((db) => {
      if (!db.rooms) db.rooms = [];
      if (room.id) {
        const index = db.rooms.findIndex(r => r.id === room.id);
        if (index >= 0) {
          db.rooms[index] = { ...db.rooms[index], ...room };
          return;
        }
      }
      const id = "rm-" + Date.now();
      db.rooms.push({ ...room, id });
    });
    res.json({ success: true, rooms: getDB().rooms });
  });

  // Delete Room
  app.delete("/api/admin/rooms/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    updateDB((db) => {
      db.rooms = db.rooms.filter(r => r.id !== id);
    });
    res.json({ success: true, rooms: getDB().rooms });
  });

  // Create / Update Gallery Item
  app.post("/api/admin/gallery", requireAuth, (req, res) => {
    const items: GalleryItem[] = req.body; // Can accept single or bulk
    updateDB((db) => {
      if (!db.gallery) db.gallery = [];
      items.forEach(itm => {
        const existsId = db.gallery.findIndex(g => g.id === itm.id);
        if (existsId >= 0) {
          db.gallery[existsId] = { ...db.gallery[existsId], ...itm };
        } else {
          db.gallery.push({
            id: itm.id || "gal-" + Date.now() + Math.random().toString(36).substr(2, 4),
            url: itm.url,
            category: itm.category || "Exterior",
            caption: itm.caption || ""
          });
        }
      });
    });
    res.json({ success: true, gallery: getDB().gallery });
  });

  // Delete gallery item
  app.delete("/api/admin/gallery/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    updateDB((db) => {
      db.gallery = db.gallery.filter(g => g.id !== id);
    });
    res.json({ success: true, gallery: getDB().gallery });
  });

  // Create / Update Testimonial
  app.post("/api/admin/testimonials", requireAuth, (req, res) => {
    const testimonial: Testimonial = req.body;
    updateDB((db) => {
      if (!db.testimonials) db.testimonials = [];
      const idx = db.testimonials.findIndex(t => t.id === testimonial.id);
      if (idx >= 0) {
        db.testimonials[idx] = { ...db.testimonials[idx], ...testimonial };
      } else {
        db.testimonials.push({
          ...testimonial,
          id: "tst-" + Date.now()
        });
      }
    });
    res.json({ success: true, testimonials: getDB().testimonials });
  });

  // Delete testimonial
  app.delete("/api/admin/testimonials/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    updateDB((db) => {
      db.testimonials = db.testimonials.filter(t => t.id !== id);
    });
    res.json({ success: true, testimonials: getDB().testimonials });
  });

  // Mark message read status
  app.post("/api/admin/messages/:id/read", requireAuth, (req, res) => {
    const id = req.params.id;
    const { read } = req.body;
    updateDB((db) => {
      const idx = db.messages.findIndex(m => m.id === id);
      if (idx >= 0) {
        db.messages[idx].read = read;
      }
    });
    res.json({ success: true, messages: getDB().messages });
  });

  // Update administrative notes on contacts
  app.post("/api/admin/messages/:id/notes", requireAuth, (req, res) => {
    const id = req.params.id;
    const { notes } = req.body;
    updateDB((db) => {
      const idx = db.messages.findIndex(m => m.id === id);
      if (idx >= 0) {
        db.messages[idx].notes = notes;
      }
    });
    res.json({ success: true, messages: getDB().messages });
  });

  // Delete contact form submission
  app.delete("/api/admin/messages/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    updateDB((db) => {
      db.messages = db.messages.filter(m => m.id !== id);
    });
    res.json({ success: true, messages: getDB().messages });
  });

  // Create / Edit CMS Pages
  app.post("/api/admin/pages", requireAuth, (req, res) => {
    const page: CMSPage = req.body;
    updateDB((db) => {
      if (!db.pages) db.pages = [];
      const idx = db.pages.findIndex(p => p.id === page.id || p.slug === page.slug);
      const updatedPage = {
        ...page,
        id: page.id || page.slug || "pg-" + Date.now(),
        lastUpdated: new Date().toISOString()
      };
      if (idx >= 0) {
        db.pages[idx] = updatedPage;
      } else {
        db.pages.push(updatedPage);
      }
    });
    res.json({ success: true, pages: getDB().pages });
  });

  // Delete CMS page
  app.delete("/api/admin/pages/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    updateDB((db) => {
      db.pages = db.pages.filter(p => p.id !== id);
    });
    res.json({ success: true, pages: getDB().pages });
  });

  // Save Navigation menu configuration
  app.post("/api/admin/menu", requireAuth, (req, res) => {
    const items: MenuItem[] = req.body;
    updateDB((db) => {
      // Re-assign order based on input array indices, then save
      db.menu = items.map((itm, index) => ({
        ...itm,
        order: index + 1
      }));
    });
    res.json({ success: true, menu: getDB().menu });
  });

  // Reset or seed fresh CMS values to clear logs
  app.post("/api/admin/reset-db", requireAuth, (req, res) => {
    updateDB((db) => {
      db.settings = defaultSettings;
      db.rooms = defaultRooms;
      db.gallery = defaultGallery;
      db.testimonials = defaultTestimonials;
      db.messages = defaultMessages;
      db.pages = defaultPages;
      db.menu = defaultMenu;
      db.analytics = defaultAnalytics;
      db.adminPasswordHash = bcrypt.hashSync("admin77", 10);
    });
    res.json({ success: true, db: getDB() });
  });

  // Save new security keys (update password)
  app.post("/api/admin/update-password", requireAuth, (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 4) {
      res.status(400).json({ error: "Password must be at least 4 characters long." });
      return;
    }
    const hashed = bcrypt.hashSync(password, 10);
    updateDB((db) => {
      db.adminPasswordHash = hashed;
    });
    res.json({ success: true });
  });

  // VITE DEV SERVER OR STATIC PRODUCTION BUILD HANDLER
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Hotel 77 CMS Engine] Live and listening on host 0.0.0.0, port ${PORT}`);
  });

  // Clean expired sessions every 15 minutes
  setInterval(() => {
    try {
      const db = loadDB();
      const before = db.activeSessions.length;
      db.activeSessions = db.activeSessions.filter(
        (s) => Date.now() - s.createdAt < 24 * 60 * 60 * 1000
      );
      if (db.activeSessions.length < before) {
        saveDB(db);
        console.log(`Cleaned ${before - db.activeSessions.length} expired session(s)`);
      }
    } catch (err) {
      console.error("Session cleanup error:", err);
    }
  }, 15 * 60 * 1000);
}

startServer();
