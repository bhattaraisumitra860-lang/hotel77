/**
 * HOTEL 77 - Supabase Data Seed
 *
 * HOW TO RUN:
 * Option 1: Paste this into Supabase SQL Editor (recommended)
 * Option 2: Run `npx tsx seed-supabase.js` locally (requires .env setup)
 */

// ===== SUPABASE SETTINGS =====
export const SUPABASE_URL = 'https://vokpfzlqmbpaeewqmejw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZva3BmemxxbWJwYWVld3FtZWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNDY5NzUsImV4cCI6MjA5OTkyMjk3NX0.qk8V4Vv7wqlpZv7vedfZcA11EpmYheTyK3k4MqMU7LA';

// ===== SQL to run in Supabase SQL Editor =====
export const SCHEMA_SQL = `
-- Create tables
CREATE TABLE IF NOT EXISTS settings (
  id bigint primary key default 1,
  hotel_name text not null default 'Hotel 77',
  tagline text default 'Comfort, Hospitality & Convenience',
  logo_url text default '/uploads/logo.png',
  favicon_url text default '',
  accent_color text default 'indigo',
  primary_phone text default '9847871687',
  secondary_phone text default '9857841687',
  whatsapp_number text default '9847871687',
  whatsapp_prefilled_text text default 'Hello, I am interested in booking a stay at Hotel 77.',
  email_address text default 'hotel77@gmail.com',
  address text default 'Shreegaun, Jakhera, Lamahi, Dang, Nepal',
  google_maps_embed_url text default '',
  hero_image_url text default '/uploads/exterior-1.png',
  instagram_url text default '',
  facebook_url text default '',
  twitter_url text default '',
  seo_title text default 'Hotel 77 | Lamahi Premier Hotel',
  seo_description text default 'Enjoy comfortable stays at Hotel 77 in Lamahi, Dang, Nepal.',
  seo_keywords text default 'hotel lamahi, hotel dang, nepal',
  footer_content text default '© 2026 Hotel 77. All rights reserved.',
  maintenance_mode boolean default false,
  google_review_url text default '',
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS rooms (
  id text primary key,
  name text not null,
  short_description text,
  full_description text,
  capacity_guests integer default 2,
  capacity_beds integer default 1,
  amenities jsonb default '[]',
  images jsonb default '[]',
  featured boolean default false,
  enabled boolean default true,
  category text default 'Standard Room',
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id text primary key,
  url text not null,
  category text default 'Exterior',
  caption text default '',
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id text primary key,
  author_name text not null,
  rating integer default 5,
  content text not null,
  source text default '',
  featured boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text default '',
  message text not null,
  read boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS pages (
  id text primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  last_updated timestamptz default now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id text primary key,
  label text not null,
  path text not null,
  menu_order integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admin all rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Admin all pages" ON pages FOR ALL USING (true);
CREATE POLICY "Admin all menu" ON menu_items FOR ALL USING (true);
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (true);

-- Insert default data
INSERT INTO settings (id, hotel_name, tagline, logo_url, primary_phone, secondary_phone, whatsapp_number, whatsapp_prefilled_text, email_address, address, hero_image_url, seo_title, seo_description, footer_content)
VALUES (1, 'Hotel 77', 'Comfort, Hospitality & Convenience in Shreegaun, Jakhera, Lamahi', '/uploads/logo.png', '9847871687', '9857841687', '9847871687', 'Hello, I am interested in booking a stay at Hotel 77.', 'hotel77@gmail.com', 'Shreegaun, Jakhera, Lamahi, Dang, Nepal', '/uploads/exterior-1.png', 'Hotel 77 | Lamahi Premier Hotel', 'Enjoy comfortable stays at Hotel 77 in Lamahi, Dang, Nepal.', '© 2026 Hotel 77. Shreegaun, Jakhera, Lamahi, Dang, Nepal.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, name, short_description, full_description, capacity_guests, capacity_beds, amenities, images, featured, category) VALUES
('room-110', 'Suite - Room 110', 'Spacious family suite designed for comfort and relaxation.', 'Room 110 offers generous space for families. Features one double and one single bed for up to three guests.', 3, 2, '["Air Conditioning","Free Wi-Fi","Double Bed","Single Bed","Room Service","Attached Bathroom","Hot & Cold Shower"]', '["/uploads/110.png"]', true, 'Suite'),
('room-107', 'Suite - Room 107', 'A spacious suite with a cozy seating area for families.', 'Room 107 features a double and single bed with a seating area, dining table, and chairs.', 3, 2, '["Air Conditioning","Free Wi-Fi","Double Bed","Single Bed","Seating Area","Room Service"]', '["/uploads/107.png"]', true, 'Suite'),
('room-105', 'Deluxe Room - Room 105', 'Comfortable deluxe room with king-size bed.', 'Room 105 features a king-size bed, seating area with table and chairs.', 2, 1, '["Air Conditioning","Free Wi-Fi","King Bed","Seating Area","Room Service"]', '["/uploads/105.png"]', true, 'Deluxe Room'),
('room-101', 'Deluxe Room - Room 101', 'Modern deluxe room offering comfort and convenience.', 'Room 101 has a king-size bed with AC, Wi-Fi, and quality furnishings.', 2, 1, '["Air Conditioning","Free Wi-Fi","King Bed","Room Service"]', '["/uploads/101.png"]', false, 'Deluxe Room'),
('room-104', 'Standard Room - Room 104', 'Affordable comfort for a pleasant stay.', 'Room 104 features a king-size bed, ceiling fan, Wi-Fi, and clean bathroom.', 2, 1, '["Free Wi-Fi","King Bed","Ceiling Fan","Room Service"]', '["/uploads/104.png"]', false, 'Standard Room'),
('room-103', 'Standard Room - Room 103', 'Simple, clean, and comfortable.', 'Room 103 offers a king-size bed, Wi-Fi, ceiling fan, and essential amenities.', 2, 1, '["Free Wi-Fi","King Bed","Ceiling Fan","Room Service"]', '["/uploads/103.png"]', false, 'Standard Room'),
('room-102', 'Standard Room - Room 102', 'Budget-friendly comfort for all travelers.', 'Room 102 provides a king-size bed, Wi-Fi, ceiling fan, and clean bathroom.', 2, 1, '["Free Wi-Fi","King Bed","Ceiling Fan","Room Service"]', '["/uploads/102.png"]', false, 'Standard Room')
ON CONFLICT (id) DO NOTHING;

INSERT INTO gallery (id, url, category, caption) VALUES
('g-ext-1', '/uploads/exterior-1.png', 'Exterior', 'Hotel 77 Front View'),
('g-ext-2', '/uploads/exterior-2.png', 'Exterior', 'Hotel 77 Entrance & Surroundings'),
('g-int-1', '/uploads/interior-1.png', 'Interior', 'Reception & Lounge Area'),
('g-int-2', '/uploads/interior-2.png', 'Interior', 'Interior Hallway'),
('g-int-3', '/uploads/interior-3.png', 'Interior', 'Common Area'),
('g-int-4', '/uploads/interior-4.png', 'Interior', 'Hotel Interior Design'),
('g-room-110', '/uploads/110.png', 'Rooms', 'Suite 110 - Family Suite'),
('g-room-107', '/uploads/107.png', 'Rooms', 'Suite 107'),
('g-room-105', '/uploads/105.png', 'Rooms', 'Deluxe Room 105'),
('g-room-101', '/uploads/101.png', 'Rooms', 'Deluxe Room 101'),
('g-room-104', '/uploads/104.png', 'Rooms', 'Standard Room 104'),
('g-room-103', '/uploads/103.png', 'Rooms', 'Standard Room 103'),
('g-room-102', '/uploads/102.png', 'Rooms', 'Standard Room 102')
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, author_name, rating, content, source) VALUES
('t1', 'Sita Sharma', 5, 'Hotel 77 is the best place to stay in Lamahi. Clean rooms, friendly staff, and great food.', 'Google Review'),
('t2', 'Rajesh Hamal', 5, 'Excellent service and very comfortable rooms. Perfect location for travelers on the East-West Highway.', 'Direct Guest'),
('t3', 'Anita Gurung', 4, 'Very clean and well-maintained deluxe room. Staff were helpful and welcoming. Great value.', 'Booking.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, label, path, menu_order) VALUES
('mn1', 'Home', '/', 1),
('mn2', 'Rooms & Suites', '/rooms', 2),
('mn3', 'Gallery', '/gallery', 3),
('mn4', 'About', '/page/about', 4),
('mn5', 'Contact', '/contact', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO pages (id, slug, title, content) VALUES
('about', 'about', 'The Story of Hotel 77', E'### Comfort & Hospitality in Shreegaun, Jakhera, Lamahi\\n\\nLocated in the peaceful surroundings of Shreegaun, Jakhera, Lamahi, Dang, Nepal, **Hotel 77** offers a comfortable and welcoming stay for travelers, families, and business guests visiting western Nepal.\\n\\n### Our Philosophy\\nWe believe great hospitality begins with genuine care. Our goal is to provide clean, comfortable accommodations, friendly service, and excellent value.\\n\\n### Our Rooms\\nHotel 77 features **Standard Rooms**, **Deluxe Rooms**, and **Family Suites** designed for solo travelers, couples, families, and business guests.\\n\\n### Why Choose Hotel 77?\\n* Comfortable Standard, Deluxe, and Family Suite rooms\\n* Complimentary High-Speed Wi-Fi\\n* Clean and spacious rooms\\n* Daily housekeeping\\n* Peaceful and secure environment\\n* Friendly and professional staff\\n* Convenient location in Shreegaun, Jakhera, Lamahi\\n* Ample parking for guests\\n* Excellent value for business and leisure travelers')
ON CONFLICT (id) DO NOTHING;
`;
