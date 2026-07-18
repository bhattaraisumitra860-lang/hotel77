import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import bcrypt from "bcryptjs";
import { CMSDatabase, Room, GalleryItem, Testimonial, ContactMessage, SiteSettings, CMSPage, MenuItem, AnalyticsData } from "./src/types.js";
import { defaultSettings, defaultRooms, defaultGallery, defaultTestimonials, defaultPages, defaultMenu, defaultAnalytics } from "./src/defaultData.js";

// Paths
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "cms_db.json");

// Uploads can be in either dist/uploads or public/uploads depending on the environment
const DIST_UPLOADS_DIR = path.join(process.cwd(), "dist", "uploads");
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const UPLOADS_DIR = fs.existsSync(DIST_UPLOADS_DIR) ? DIST_UPLOADS_DIR : PUBLIC_UPLOADS_DIR;

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { /* ignore on Vercel */ }
}

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) { /* ignore on Vercel */ }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, UPLOADS_DIR); },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "upload-" + Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/avif"];
    if (allowedTypes.includes(file.mimetype)) { cb(null, true); }
    else { cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPG, PNG, GIF, WebP, SVG, AVIF`)); }
  }
});

const defaultMessages: ContactMessage[] = [];

function loadDB(): CMSDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      if (Array.isArray(db.activeSessions) && db.activeSessions.length > 0 && typeof db.activeSessions[0] === "string") {
        db.activeSessions = db.activeSessions.map((t: string) => ({ token: t, createdAt: Date.now() }));
        saveDB(db);
      }
      if (db.adminPasswordHash && !db.adminPasswordHash.startsWith("$2")) {
        db.adminPasswordHash = bcrypt.hashSync(db.adminPasswordHash, 10);
        saveDB(db);
      }
      return db;
    }
  } catch (error) {
    console.error("Failed to load CMS database, using default values", error);
  }

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
  try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8"); }
  catch (error) { console.error("Failed to save CMS database", error); }
}

// Create Express app
const app = express();

// Serve uploaded files publicly
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.json({ limit: "10mb" }));
app.use(express.raw({ type: "image/*", limit: "10mb" }));

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
  if (!authHeader) { res.status(401).json({ error: "No authorization header." }); return; }
  const token = authHeader.replace("Bearer ", "");
  const db = getDB();
  const session = db.activeSessions.find(s => s.token === token);
  if (session && (Date.now() - session.createdAt) < 24 * 60 * 60 * 1000) { next(); return; }
  if (session) { updateDB((d) => { d.activeSessions = d.activeSessions.filter(s => s.token !== token); }); }
  res.status(401).json({ error: "Session expired or invalid token." });
};

// PUBLIC ENDPOINTS
app.get("/api/public/data", (req, res) => {
  const db = getDB();
  res.json({
    settings: db.settings,
    rooms: db.rooms.filter(r => r.enabled),
    gallery: db.gallery,
    testimonials: db.testimonials,
    pages: db.pages,
    menu: db.menu.sort((a,b) => a.order - b.order)
  });
});

app.post("/api/public/track-pageview", (req, res) => {
  const { path: routePath } = req.body;
  if (!routePath) { res.status(400).json({ error: "Missing path parameter." }); return; }
  updateDB((db) => {
    if (!db.analytics) db.analytics = defaultAnalytics;
    if (!db.analytics.pageViews) db.analytics.pageViews = {};
    db.analytics.pageViews[routePath] = (db.analytics.pageViews[routePath] || 0) + 1;
  });
  res.json({ success: true });
});

app.post("/api/public/track-conversion", (req, res) => {
  const { type } = req.body;
  updateDB((db) => {
    if (!db.analytics) db.analytics = defaultAnalytics;
    if (!db.analytics.conversions) db.analytics.conversions = { whatsappClicks: 0, phoneClicks: 0, formSubmissions: 0 };
    if (type === "whatsapp") db.analytics.conversions.whatsappClicks += 1;
    else if (type === "phone") db.analytics.conversions.phoneClicks += 1;
  });
  res.json({ success: true });
});

app.post("/api/public/track-room-view", (req, res) => {
  const { roomId } = req.body;
  if (!roomId) { res.status(400).json({ error: "Missing roomId." }); return; }
  updateDB((db) => {
    if (!db.analytics) db.analytics = defaultAnalytics;
    if (!db.analytics.roomViews) db.analytics.roomViews = {};
    db.analytics.roomViews[roomId] = (db.analytics.roomViews[roomId] || 0) + 1;
  });
  res.json({ success: true });
});

app.post("/api/public/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) { res.status(400).json({ error: "Name, email, and message are required." }); return; }
  const newMessage: ContactMessage = {
    id: "msg-" + Date.now() + Math.random().toString(36).substr(2, 4),
    name, email, phone: phone || "", message,
    createdAt: new Date().toISOString(), read: false, notes: ""
  };
  updateDB((db) => {
    if (!db.messages) db.messages = [];
    db.messages.unshift(newMessage);
    if (!db.analytics) db.analytics = defaultAnalytics;
    if (!db.analytics.conversions) db.analytics.conversions = { whatsappClicks: 0, phoneClicks: 0, formSubmissions: 0 };
    db.analytics.conversions.formSubmissions += 1;
  });
  res.json({ success: true, message: "Thank you. Your request has been received." });
});

// ADMIN ENDPOINTS
app.post("/api/admin/upload", requireAuth, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: `Upload error: ${err.message}` });
      return res.status(400).json({ error: err.message || "Upload rejected." });
    }
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  });
});

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const db = getDB();
  if (bcrypt.compareSync(password, db.adminPasswordHash)) {
    const token = "tok-" + crypto.randomBytes(32).toString("hex");
    updateDB((d) => { if (!d.activeSessions) d.activeSessions = []; d.activeSessions.push({ token, createdAt: Date.now() }); });
    res.json({ success: true, token });
  } else {
    res.status(400).json({ error: "Invalid password key. Connection rejected." });
  }
});

app.post("/api/admin/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) updateDB((db) => { db.activeSessions = (db.activeSessions || []).filter(s => s.token !== token); });
  res.json({ success: true });
});

app.get("/api/admin/data", requireAuth, (req, res) => {
  const fullDb = getDB();
  const { adminPasswordHash, activeSessions, ...safeData } = fullDb;
  res.json(safeData);
});

app.post("/api/admin/update-settings", requireAuth, (req, res) => {
  const newSettings: SiteSettings = req.body;
  updateDB((db) => { db.settings = { ...db.settings, ...newSettings }; });
  res.json({ success: true, settings: getDB().settings });
});

app.post("/api/admin/rooms", requireAuth, (req, res) => {
  const room: Room = req.body;
  if (!room.name) { res.status(400).json({ error: "Room name is required." }); return; }
  updateDB((db) => {
    if (!db.rooms) db.rooms = [];
    if (room.id) {
      const index = db.rooms.findIndex(r => r.id === room.id);
      if (index >= 0) { db.rooms[index] = { ...db.rooms[index], ...room }; return; }
    }
    db.rooms.push({ ...room, id: "rm-" + Date.now() });
  });
  res.json({ success: true, rooms: getDB().rooms });
});

app.delete("/api/admin/rooms/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  updateDB((db) => { db.rooms = db.rooms.filter(r => r.id !== id); });
  res.json({ success: true, rooms: getDB().rooms });
});

app.post("/api/admin/gallery", requireAuth, (req, res) => {
  const items: GalleryItem[] = req.body;
  updateDB((db) => {
    if (!db.gallery) db.gallery = [];
    items.forEach(itm => {
      const existsId = db.gallery.findIndex(g => g.id === itm.id);
      if (existsId >= 0) { db.gallery[existsId] = { ...db.gallery[existsId], ...itm }; }
      else { db.gallery.push({ id: itm.id || "gal-" + Date.now() + Math.random().toString(36).substr(2, 4), url: itm.url, category: itm.category || "Exterior", caption: itm.caption || "" }); }
    });
  });
  res.json({ success: true, gallery: getDB().gallery });
});

app.delete("/api/admin/gallery/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  updateDB((db) => { db.gallery = db.gallery.filter(g => g.id !== id); });
  res.json({ success: true, gallery: getDB().gallery });
});

app.post("/api/admin/testimonials", requireAuth, (req, res) => {
  const testimonial: Testimonial = req.body;
  updateDB((db) => {
    if (!db.testimonials) db.testimonials = [];
    const idx = db.testimonials.findIndex(t => t.id === testimonial.id);
    if (idx >= 0) { db.testimonials[idx] = { ...db.testimonials[idx], ...testimonial }; }
    else { db.testimonials.push({ ...testimonial, id: "tst-" + Date.now() }); }
  });
  res.json({ success: true, testimonials: getDB().testimonials });
});

app.delete("/api/admin/testimonials/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  updateDB((db) => { db.testimonials = db.testimonials.filter(t => t.id !== id); });
  res.json({ success: true, testimonials: getDB().testimonials });
});

app.post("/api/admin/messages/:id/read", requireAuth, (req, res) => {
  const id = req.params.id;
  const { read } = req.body;
  updateDB((db) => { const idx = db.messages.findIndex(m => m.id === id); if (idx >= 0) db.messages[idx].read = read; });
  res.json({ success: true, messages: getDB().messages });
});

app.post("/api/admin/messages/:id/notes", requireAuth, (req, res) => {
  const id = req.params.id;
  const { notes } = req.body;
  updateDB((db) => { const idx = db.messages.findIndex(m => m.id === id); if (idx >= 0) db.messages[idx].notes = notes; });
  res.json({ success: true, messages: getDB().messages });
});

app.delete("/api/admin/messages/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  updateDB((db) => { db.messages = db.messages.filter(m => m.id !== id); });
  res.json({ success: true, messages: getDB().messages });
});

app.post("/api/admin/pages", requireAuth, (req, res) => {
  const page: CMSPage = req.body;
  updateDB((db) => {
    if (!db.pages) db.pages = [];
    const idx = db.pages.findIndex(p => p.id === page.id || p.slug === page.slug);
    const updatedPage = { ...page, id: page.id || page.slug || "pg-" + Date.now(), lastUpdated: new Date().toISOString() };
    if (idx >= 0) db.pages[idx] = updatedPage;
    else db.pages.push(updatedPage);
  });
  res.json({ success: true, pages: getDB().pages });
});

app.delete("/api/admin/pages/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  updateDB((db) => { db.pages = db.pages.filter(p => p.id !== id); });
  res.json({ success: true, pages: getDB().pages });
});

app.post("/api/admin/menu", requireAuth, (req, res) => {
  const items: MenuItem[] = req.body;
  updateDB((db) => { db.menu = items.map((itm, index) => ({ ...itm, order: index + 1 })); });
  res.json({ success: true, menu: getDB().menu });
});

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

app.post("/api/admin/update-password", requireAuth, (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 4) { res.status(400).json({ error: "Password must be at least 4 characters long." }); return; }
  updateDB((db) => { db.adminPasswordHash = bcrypt.hashSync(password, 10); });
  res.json({ success: true });
});

// In production, also serve static files from dist
if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  // SPA fallback - all non-API, non-upload routes go to index.html
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Export for Vercel serverless
export default app;

// Start server for local development
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  // For development with Vite, we need to set up Vite middleware
  const startDev = async () => {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Hotel 77 CMS Engine] Live and listening on host 0.0.0.0, port ${PORT}`);
    });

    // Clean expired sessions every 15 minutes
    setInterval(() => {
      try {
        const db = loadDB();
        const before = db.activeSessions.length;
        db.activeSessions = db.activeSessions.filter((s) => Date.now() - s.createdAt < 24 * 60 * 60 * 1000);
        if (db.activeSessions.length < before) { saveDB(db); console.log(`Cleaned ${before - db.activeSessions.length} expired session(s)`); }
      } catch (err) { console.error("Session cleanup error:", err); }
    }, 15 * 60 * 1000);
  };
  startDev();
}
