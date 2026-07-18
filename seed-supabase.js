/**
 * SEED SUPABASE SCRIPT
 * Run with: node seed-supabase.js
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Credentials
const supabaseUrl = 'https://vokpfzlqmbpaeewqmejw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZva3BmemxxbWJwYWVld3FtZWp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM0Njk3NSwiZXhwIjoyMDk5OTIyOTc1fQ.pi5D9by-SHUBHPyb2eGeRfrzdZbp3_roAMLzeVRRd2A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Data to seed (based on your defaultData.ts)
const settings = {
  id: 1,
  hotel_name: "Hotel 77",
  tagline: "Comfort, Hospitality & Convenience in Shreegaun, Jakhera, Lamahi",
  logo_url: "/uploads/logo.png",
  primary_phone: "9847871687",
  secondary_phone: "9857841687",
  whatsapp_number: "9847871687",
  whatsapp_prefilled_text: "Hello, I am interested in booking a stay at Hotel 77. Please let me know your rates and availability.",
  email_address: "hotel77@gmail.com",
  address: "Shreegaun, Jakhera, Lamahi, Dang, Nepal",
  google_maps_embed_url: "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3527.2722631552697!2d82.5657133753295!3d27.862905676093725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997a36fb3930c71%3A0x49ac19d8da197d81!2sHotel%2077!5e0!3m2!1sen!2snp!4v1781294849874!5m2!1sen!2snp\" width=\"800\" height=\"600\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>",
  hero_image_url: "/uploads/exterior-1.png",
  seo_title: "Hotel 77 | Lamahi's Premier Hotel",
  seo_description: "Enjoy comfortable stays at Hotel 77 in Shreegaun, Jakhera, Lamahi, Dang, Nepal. Standard, Deluxe, and Family Suite rooms with Wi-Fi, AC, and warm hospitality.",
  seo_keywords: "hotel in lamahi, hotel in dang, hotel 77, shreegaun hotel, jakhera hotel, nepal hotel, budget hotel lamahi",
  footer_content: "© 2026 Hotel 77. Shreegaun, Jakhera, Lamahi, Dang, Nepal. All rights reserved."
};

const rooms = [
  {
    id: "room-110",
    name: "Suite – Room 110",
    short_description: "Spacious family suite designed for comfort, relaxation, and memorable stays.",
    full_description: "Room 110 is one of our premium suites, offering generous space for families and small groups. Featuring one double bed and one single bed, the suite comfortably accommodates up to three guests.",
    capacity_guests: 3,
    capacity_beds: 2,
    amenities: ["Air Conditioning", "Free Wi-Fi", "Double Bed", "Single Bed", "Room Service"],
    images: ["/uploads/110.png"],
    featured: true,
    category: "Suite"
  },
  {
    id: "room-107",
    name: "Suite – Room 107",
    short_description: "A spacious suite with a cozy seating area for families and small groups.",
    full_description: "Room 107 is a spacious suite offering one double bed and one single bed for up to three guests.",
    capacity_guests: 3,
    capacity_beds: 2,
    amenities: ["Air Conditioning", "Free Wi-Fi", "Seating Area", "Dining Table", "Room Service"],
    images: ["/uploads/107.png"],
    featured: true,
    category: "Suite"
  },
  {
    id: "room-105",
    name: "Deluxe Room – Room 105",
    short_description: "Comfortable deluxe accommodation with a king-size bed and private seating area.",
    full_description: "Room 105 is a spacious Deluxe Room featuring a king-size bed and a cozy seating area.",
    capacity_guests: 2,
    capacity_beds: 1,
    amenities: ["Air Conditioning", "Free Wi-Fi", "King Bed", "Room Service"],
    images: ["/uploads/105.png"],
    featured: true,
    category: "Deluxe Room"
  }
];

const gallery = [
  { id: "g-ext-1", url: "/uploads/exterior-1.png", category: "Exterior", caption: "Hotel 77 Front View" },
  { id: "g-ext-2", url: "/uploads/exterior-2.png", category: "Exterior", caption: "Hotel 77 Entrance & Surroundings" },
  { id: "g-int-1", url: "/uploads/interior-1.png", category: "Interior", caption: "Reception & Lounge Area" }
];

const menu = [
  { id: "mn1", label: "Home", path: "/", menu_order: 1 },
  { id: "mn2", label: "Rooms & Suites", path: "/rooms", menu_order: 2 },
  { id: "mn3", label: "Gallery", path: "/gallery", menu_order: 3 },
  { id: "mn4", label: "About", path: "/page/about", menu_order: 4 },
  { id: "mn5", label: "Contact", path: "/contact", menu_order: 5 }
];

async function seed() {
  console.log('--- STARTING SEED ---');

  // Settings
  const { error: setErr } = await supabase.from('settings').upsert(settings);
  if (setErr) console.error('Settings error:', setErr);
  else console.log('✅ Settings seeded');

  // Rooms
  const { error: rmErr } = await supabase.from('rooms').upsert(rooms);
  if (rmErr) console.error('Rooms error:', rmErr);
  else console.log('✅ Rooms seeded');

  // Gallery
  const { error: galErr } = await supabase.from('gallery').upsert(gallery);
  if (galErr) console.error('Gallery error:', galErr);
  else console.log('✅ Gallery seeded');

  // Menu
  const { error: menuErr } = await supabase.from('menu').upsert(menu);
  if (menuErr) console.error('Menu error:', menuErr);
  else console.log('✅ Menu seeded');

  console.log('--- SEED COMPLETE ---');
}

seed();
