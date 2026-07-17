export interface SiteSettings {
  hotelName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string; // Tailwind tint or custom
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  whatsappPrefilledText: string;
  emailAddress: string;
  address: string;
  googleMapsEmbedUrl: string;
  heroImageUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  footerContent: string;
  maintenanceMode: boolean;
}

export interface Room {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  capacityGuests: number;
  capacityBeds: number;
  amenities: string[];
  images: string[]; // URLs
  featured: boolean;
  enabled: boolean;
  category: string; // e.g. "Suite", "Deluxe", "Standard", "Penthouse"
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string; // "Rooms", "Exterior", "Interior", "Events", "Dining"
  caption?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  avatarUrl?: string; // Optional
  rating: number; // 1-5
  content: string;
  source: string; // e.g. "TripAdvisor", "Google Maps", "Direct"
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string; // ISO String
  read: boolean;
  notes?: string; // Admin notes
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string; // markdown or rich text
  lastUpdated: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string; // e.g. "/rooms", "/contact", "/about" or external
  order: number;
  isOpenNewTab?: boolean;
}

export interface AnalyticsData {
  pageViews: { [path: string]: number };
  conversions: {
    whatsappClicks: number;
    phoneClicks: number;
    formSubmissions: number;
  };
  roomViews: { [roomId: string]: number };
}

export interface Session {
  token: string;
  createdAt: number;
}

export interface CMSDatabase {
  settings: SiteSettings;
  rooms: Room[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  pages: CMSPage[];
  menu: MenuItem[];
  analytics: AnalyticsData;
  adminPasswordHash: string; // bcrypt hash of the admin password
  activeSessions: Session[]; // Active session tokens with timestamps
}
