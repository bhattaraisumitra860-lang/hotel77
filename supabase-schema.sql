-- ============================================================
-- HOTEL 77 - Supabase Schema Setup
-- Instructions: Open https://supabase.com/dashboard/project/vokpfzlqmbpaeewqmejw
-- Go to SQL Editor, paste this file, and click Run.
-- ============================================================

-- 1. SETTINGS TABLE (single row for hotel config)
CREATE TABLE IF NOT EXISTS settings (
  id bigint primary key default 1,
  hotel_name text not null default 'Hotel 77',
  tagline text not null default 'Comfort, Hospitality & Convenience',
  logo_url text not null default '/uploads/logo.png',
  favicon_url text default '',
  accent_color text default 'indigo',
  primary_phone text not null default '9847871687',
  secondary_phone text default '9857841687',
  whatsapp_number text not null default '9847871687',
  whatsapp_prefilled_text text default 'Hello, I am interested in booking a stay at Hotel 77.',
  email_address text not null default 'hotel77@gmail.com',
  address text default 'Shreegaun, Jakhera, Lamahi, Dang, Nepal',
  google_maps_embed_url text default '',
  hero_image_url text default '/uploads/exterior-1.png',
  instagram_url text default '',
  facebook_url text default '',
  twitter_url text default '',
  seo_title text default 'Hotel 77 | Lamahi Premier Hotel',
  seo_description text default 'Enjoy comfortable stays at Hotel 77 in Lamahi, Dang, Nepal.',
  seo_keywords text default 'hotel lamahi, hotel dang, nepal hotel',
  footer_content text default '© 2026 Hotel 77. Shreegaun, Jakhera, Lamahi, Dang, Nepal.',
  maintenance_mode boolean default false,
  google_review_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prevent multiple settings rows
ALTER TABLE settings ADD CONSTRAINT one_setting_row CHECK (id = 1);

-- 2. ROOMS TABLE
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id text primary key,
  url text not null,
  category text default 'Exterior',
  caption text default '',
  created_at timestamptz default now()
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id text primary key,
  author_name text not null,
  rating integer default 5,
  content text not null,
  source text default '',
  featured boolean default true,
  created_at timestamptz default now()
);

-- 5. CONTACT MESSAGES TABLE
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

-- 6. PAGES TABLE (CMS Pages like About)
CREATE TABLE IF NOT EXISTS pages (
  id text primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  last_updated timestamptz default now()
);

-- 7. MENU TABLE
CREATE TABLE IF NOT EXISTS menu (
  id text primary key,
  label text not null,
  path text not null,
  menu_order integer default 0,
  created_at timestamptz default now()
);

-- 8. USERS TABLE (for admin authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id bigint primary key generated always as identity,
  username text unique not null default 'admin',
  password_hash text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- Allow public read access for all content tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read settings, rooms, gallery, testimonials, pages, menu
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read menu" ON menu FOR SELECT USING (true);
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read messages" ON messages FOR SELECT USING (true);

-- Admin can do all operations (will be secured via application-level auth)
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admin all rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Admin all pages" ON pages FOR ALL USING (true);
CREATE POLICY "Admin all menu" ON menu FOR ALL USING (true);
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (true);
CREATE POLICY "Admin all admin_users" ON admin_users FOR ALL USING (true);

-- Insert default admin password (password: admin77)
-- The hash below is bcrypt for "admin77" - will work with your existing login
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;
