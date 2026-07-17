import React, { useState } from "react";
import { 
  Shield, 
  Key, 
  TrendingUp, 
  Wrench, 
  Phone, 
  MessageSquare, 
  Settings, 
  BedDouble, 
  Camera, 
  MessageSquareQuote, 
  ClipboardList, 
  BookOpen, 
  Menu as MenuIcon, 
  Database,
  Plus,
  Trash,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Save,
  Sliders,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  FileText
} from "lucide-react";
import { 
  CMSDatabase, 
  Room, 
  GalleryItem, 
  Testimonial, 
  ContactMessage, 
  SiteSettings, 
  CMSPage, 
  MenuItem, 
  AnalyticsData 
} from "../types";

interface AdminPanelProps {
  onLogout: () => void;
  publicDB: CMSDatabase;
  triggerRefresh: () => void;
}

export default function AdminPanel({ onLogout, publicDB, triggerRefresh }: AdminPanelProps) {
  const [passwordInput, setPasswordInput] = React.useState("");
  const [token, setToken] = React.useState<string>(() => {
    return localStorage.getItem("luxury_admin_token") || "";
  });

  const [db, setDb] = React.useState<CMSDatabase | null>(null);
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "settings" | "rooms" | "gallery" | "testimonials" | "messages" | "pages" | "navigation" | "maintenance">("dashboard");

  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loginError, setLoginError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [settingsFormKey, setSettingsFormKey] = React.useState(0);

  // Form edit states
  const [editingRoom, setEditingRoom] = React.useState<Partial<Room> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = React.useState<Partial<Testimonial> | null>(null);
  const [newGalleryItem, setNewGalleryItem] = React.useState({ url: "", category: "Exterior", caption: "" });
  const [uploadedImage, setUploadedImage] = React.useState("");
  const [uploadError, setUploadError] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedPageId, setSelectedPageId] = React.useState<string>("about");
  const [formKey, setFormKey] = React.useState(0);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("luxury_admin_token", data.token);
        setToken(data.token);
        fetchAdminData(data.token);
      } else {
        const error = await res.json();
        setLoginError(error.error || "Access denied.");
      }
    } catch {
      setLoginError("Could not reach validation server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutAction = () => {
    // Notify server
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    localStorage.removeItem("luxury_admin_token");
    setToken("");
    setDb(null);
    onLogout();
  };

  const fetchAdminData = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/admin/data", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const fullDb = await res.json();
        setDb(fullDb);
      } else {
        // expired token
        localStorage.removeItem("luxury_admin_token");
        setToken("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Handle generic state updates to API
  const updateSettingsOnServer = async (settingsToSave: SiteSettings) => {
    try {
      const res = await fetch("/api/admin/update-settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(settingsToSave)
      });
      if (res.ok) {
        showFeedback("Settings saved successfully.");
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Failed to update site settings.", "error");
      }
    } catch (err) {
      showFeedback("Network error while updating settings.", "error");
    }
  };

  // Rooms creation & update
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || !editingRoom.name) {
      showFeedback("Please specify at least room name.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingRoom)
      });
      if (res.ok) {
        showFeedback("Suite saved successfully.");
        setEditingRoom(null);
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Failed to commit suite updates.", "error");
      }
    } catch (err) {
      showFeedback("Exception committed in suite post.", "error");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this room? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback("Room safely expunged from register.");
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Expungement rejected.", "error");
      }
    } catch {
      showFeedback("Network error during deletion.", "error");
    }
  };

  // Gallery bulk and single inserts
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.url) {
      showFeedback("A valid visual asset URL is required.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify([newGalleryItem])
      });
      if (res.ok) {
        showFeedback("Visual asset committed.");
        setNewGalleryItem({ url: "", category: "Exterior", caption: "" });
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Commit rejected.", "error");
      }
    } catch {
      showFeedback("Network commit failed.", "error");
    }
  };

  // Upload image to server and return the URL
  const uploadImageToServer = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        setUploadError("Upload to server failed.");
        return null;
      }
    } catch (err) {
      setUploadError("Network error during upload.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      setUploadedImage("");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file must be smaller than 10MB.");
      setUploadedImage("");
      e.target.value = "";
      return;
    }
    // Try server upload first
    const serverUrl = await uploadImageToServer(file);
    if (serverUrl) {
      setUploadedImage(serverUrl);
      setUploadError("");
      setNewGalleryItem({ ...newGalleryItem, url: serverUrl });
    } else {
      // Fallback to base64 local preview
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        setUploadedImage(dataUrl);
        setUploadError("Server upload unavailable - using local preview.");
        setNewGalleryItem({ ...newGalleryItem, url: dataUrl });
      };
      reader.onerror = () => {
        setUploadError("Could not read image file.");
        setUploadedImage("");
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Remove this image from public gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback("Visual asset removed.");
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Asset removal rejected.", "error");
      }
    } catch {
      showFeedback("Network error.", "error");
    }
  };

  // Testimonial Updates
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.authorName || !editingTestimonial.content) {
      showFeedback("Testimonial review content and author are required.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        showFeedback("Testimonial committed details.");
        setEditingTestimonial(null);
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Reconciliation rejected.", "error");
      }
    } catch {
      showFeedback("Network exception.", "error");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm("Purge this review recommendation?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback("Review safely purged.");
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Purging failed.", "error");
      }
    } catch {
      showFeedback("Exception.", "error");
    }
  };

  // Contact Inquiries Actions
  const toggleMessageRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ read: !currentStatus })
      });
      if (res.ok) {
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveMessageNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        showFeedback("Administrative notes updated.");
        fetchAdminData();
      }
    } catch {
      showFeedback("Could not update notes.", "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Delete this form records?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback("Message expunged.");
        fetchAdminData();
        triggerRefresh();
      }
    } catch {
      showFeedback("Expungement failed.", "error");
    }
  };

  // Custom Pages manager
  const handleSavePage = async (page: CMSPage) => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(page)
      });
      if (res.ok) {
        showFeedback(`Page [${page.title}] successfully reconciled.`);
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Page commitment rejected.", "error");
      }
    } catch {
      showFeedback("Network error.", "error");
    }
  };

  // Maintenance & System Controls
  const handleDatabaseReset = async () => {
    if (!window.confirm("CRITICAL WARNING: This will immediately delete all modified pages, settings, custom suites, testimonials, and clear contact submissions. It will restore the website to the original pristine London Mayfair standard presets. Proceed?")) return;
    try {
      const res = await fetch("/api/admin/reset-db", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback("Database instantly reset & seeded matching original standard presets.");
        fetchAdminData();
        triggerRefresh();
      } else {
        showFeedback("Reset denied.", "error");
      }
    } catch {
      showFeedback("Reset exception.", "error");
    }
  };

  const handleUpdatePassword = async (newVal: string) => {
    if (!newVal || newVal.length < 4) {
      showFeedback("Password must contain at least 4 letters/digits.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ password: newVal })
      });
      if (res.ok) {
        showFeedback("Administrative password key updated.");
      } else {
        showFeedback("Password update rejected.", "error");
      }
    } catch {
      showFeedback("Exception.", "error");
    }
  };

  // LOGIN SCREEN RENDER
  if (!token || !db) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-navy-900 text-white py-16 px-4">
        <div className="w-full max-w-md bg-gray-800 border border-gray-700/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Logo badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-golden-600/10 border border-golden-500/30 flex items-center justify-center text-golden-500 mb-4 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-widest text-white uppercase">
              LUXURYADMIN CMS
            </h2>
              <p className="mt-1.5 text-xs text-gray-400 font-mono tracking-wider">
                HOTEL 77 SECURE GATEWAY
              </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 tracking-wider mb-2">
                Administrative Security Password Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-navy-950 border border-gray-700 focus:border-golden-600 focus:outline-none rounded-xl pl-10 pr-4 py-3.5 text-sm text-white font-mono tracking-widest transition-colors disabled:opacity-50"
                />
                <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-golden-600 hover:bg-golden-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Opening Gateway..." : "Verify Identity"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center text-[10px] font-mono text-gray-500">
            SECURE SESSION SYSTEM SHIELDED BY TOKEN PROTOCOLS
              </div>

        </div>
      </div>
    );
  }

  const analytics: AnalyticsData = db.analytics || { pageViews: {}, conversions: { whatsappClicks: 0, phoneClicks: 0, formSubmissions: 0 }, roomViews: {} };
  const totalViewsSum = Object.values(analytics.pageViews || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-gray-900" id="admin-dashboard-container">
      
      <aside className="w-full md:w-64 bg-navy-900 text-white flex flex-col justify-between p-6 select-none shrink-0 border-r border-gray-800">
        <div>
          
          <div className="flex items-center gap-2.5 pb-6 border-b border-gray-800 mb-8">
            <div className="w-8 h-8 rounded-lg bg-golden-600 flex items-center justify-center text-white font-serif font-bold text-base shadow">
              77
            </div>
            <div>
              <span className="font-serif text-[15px] font-bold tracking-widest uppercase block">
                {db.settings.hotelName}
              </span>
              <span className="text-[8px] tracking-[0.2em] text-gray-400 block font-mono">
                LUXURYADMIN CMS
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 font-mono text-xs max-h-[70vh] overflow-y-auto">
            
            <button
              onClick={() => { setActiveTab("dashboard"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "dashboard" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Overview Cockpit
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "settings" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              Global Settings
            </button>

            <button
              onClick={() => { setActiveTab("rooms"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "rooms" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <BedDouble className="w-4 h-4" />
              Room Management
            </button>

            <button
              onClick={() => { setActiveTab("gallery"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "gallery" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Camera className="w-4 h-4" />
              Gallery Portfolio
            </button>

            <button
              onClick={() => { setActiveTab("testimonials"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "testimonials" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              Testimonials
            </button>

            <button
              onClick={() => { setActiveTab("messages"); setEditingRoom(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "messages" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ClipboardList className="w-4 h-4" />
                Contact Inquiries
              </span>
              {db.messages.filter(m => !m.read).length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono animate-pulse">
                  {db.messages.filter(m => !m.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("pages"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "pages" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              CMS Static Pages
            </button>

            <button
              onClick={() => { setActiveTab("navigation"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "navigation" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <MenuIcon className="w-4 h-4" />
              Menu Navigation
            </button>

            <button
              onClick={() => { setActiveTab("maintenance"); setEditingRoom(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "maintenance" ? "bg-golden-600 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Wrench className="w-4 h-4" />
              System Maintenance
            </button>

          </nav>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center">
          <button
            onClick={handleLogoutAction}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-700 hover:border-white hover:bg-white hover:text-gray-900 rounded-xl text-xs font-mono uppercase transition-all"
          >
            <LogOut className="w-4 h-4" />
            Admin Logout
          </button>
        </div>

      </aside>

      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
          {/* Notification Top bar */}
          {feedback && (
            <div className={`p-4 rounded-xl shadow-md border text-sm flex items-center gap-2.5 ${
              feedback.type === "success" 
                ? "bg-blue-50 border-blue-200 text-blue-950" 
                : "bg-rose-50 border-rose-200 text-rose-950"
            }`}>
              {feedback.type === "success" ? <CheckCircle className="w-5 h-5 text-blue-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* TITLE HEADER BRAND */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Manager
              </h1>
              <p className="text-xs text-mono text-gray-500 uppercase mt-1">
                Admin Management Portal for {db.settings.hotelName}
              </p>
            </div>
            {db.settings.maintenanceMode && (
              <div className="bg-golden-500 text-white text-[10px] font-mono tracking-widest font-bold px-3 py-1.5 rounded-full uppercase shadow-sm">
                ⚠️ SITE IN MAINTENANCE MODE
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1: Total visitors */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400">Sum Total Page Views</span>
                    <p className="text-3xl font-bold font-mono tracking-tight text-gray-900 mt-1">{totalViewsSum}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 text-gray-800 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Stat 2: WhatsApp conversion */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400">WhatsApp Desk Clicks</span>
                    <p className="text-3xl font-bold font-mono tracking-tight text-blue-600 mt-1">{analytics.conversions?.whatsappClicks || 0}</p>
                  </div>
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>

                {/* Stat 3: Phone conversion */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400">Phone Dial Conversions</span>
                    <p className="text-3xl font-bold font-mono tracking-tight text-indigo-600 mt-1">{analytics.conversions?.phoneClicks || 0}</p>
                  </div>
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                </div>

                {/* Stat 4: Contact inquiries */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400">Inquiry form transmissions</span>
                    <p className="text-3xl font-bold font-mono tracking-tight text-golden-600 mt-1">{db.messages.length}</p>
                  </div>
                  <div className="p-3.5 bg-golden-50 text-golden-600 rounded-xl">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Col Left: Suite metrics table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span>Chamber suite popularity metrics</span>
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider">ROOMS CLICK ANALYSIS</span>
                  </h3>
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {db.rooms.map((room) => {
                      const views = analytics.roomViews?.[room.id] || 0;
                      return (
                        <div key={room.id} className="flex items-center justify-between gap-4 py-1.5">
                          <div className="min-w-0">
                            <span className="text-sm font-serif font-medium text-gray-900 block truncate">{room.name}</span>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{room.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-600 bg-gray-50 border px-2 py-0.5 rounded-full">{views} Views</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Col Right: Page Views detail */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span>Popular Route Traffics</span>
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider">TRAFFIC INSIGHT</span>
                  </h3>
                  <div className="space-y-3.5">
                    {Object.entries(analytics.pageViews || {}).sort((a,b)=>b[1]-a[1]).map(([route, count]) => (
                      <div key={route} className="flex items-center justify-between gap-4 text-xs font-mono border-b border-dashed border-gray-100 pb-2">
                        <span className="text-gray-600 font-semibold truncate max-w-sm">{route}</span>
                        <div className="flex items-center gap-2">
                          <span className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden block">
                            <span className="bg-golden-500 h-full block rounded-full" style={{ width: `${Math.min(100, (count/Math.max(1, totalViewsSum))*100)}%` }} />
                          </span>
                          <span className="font-bold text-navy-900">{count} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent messages segment */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-navy-900">Recent Contact Form submissions</h3>
                  <button onClick={() => setActiveTab("messages")} className="text-xs font-mono text-golden-600 hover:underline">Manage All ({db.messages.length})</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {db.messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="py-3 flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <span className="font-serif text-sm font-semibold text-gray-900 block">{msg.name}</span>
                        <span className="text-[10px] font-mono text-gray-400 tracking-wide">{msg.email} | {new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${msg.read ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-600 font-semibold"}`}>{msg.read ? "Read" : "Unread"}</span>
                      </div>
                    </div>
                  ))}
                  {db.messages.length === 0 && <span className="text-xs font-mono text-gray-400">No submissions on file.</span>}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GLOBAL SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="tab-settings">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 border-b pb-3 border-gray-100">Global Website Branding Settings</h3>
              <SettingsForm
                initial={db?.settings}
                onSave={async (updated) => {
                  await updateSettingsOnServer(updated);
                  setSettingsFormKey(k => k + 1);
                }}
              />
            </div>
          )}

          {/* TAB 3: ROOMS & SUITES MANAGER */}
          {activeTab === "rooms" && (
            <div className="space-y-6" id="tab-rooms">
              
              <div className="flex justify-between items-center bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <span className="text-sm font-serif font-semibold text-gray-700">Currently hosting {db.rooms.length} exclusive suite layouts</span>
                <button
                  onClick={() => setEditingRoom({
                    id: "",
                    name: "New Curated Suite",
                    shortDescription: "",
                    fullDescription: "",
                    capacityGuests: 2,
                    capacityBeds: 1,
                    amenities: ["Flat TV Screen", "Minibar", "Rain Shower", "WIFI Access"],
                    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"],
                    featured: false,
                    enabled: true,
                    category: "Signature Double"
                  })}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-golden-600 hover:bg-golden-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Suite Room layout
                </button>
              </div>

              {/* EDITOR POPUP FOR ROOMS */}
              {editingRoom && (
                <div className="bg-white rounded-3xl border border-golden-200 p-6 sm:p-8 shadow-lg relative">
                  <h4 className="font-serif text-lg font-bold text-gray-900 border-b pb-3 mb-6">
                    {editingRoom.id ? `Editing Suite: [ ${editingRoom.name} ]` : "Specifying Fresh Room details Layout"}
                  </h4>

                  <form onSubmit={handleSaveRoom} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Suite Name *</label>
                        <input
                          type="text"
                          required
                          value={editingRoom.name || ""}
                          onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Category Segment</label>
                        <input
                          type="text"
                          placeholder="e.g. Penthouse, Suite, Regular Double"
                          value={editingRoom.category || ""}
                          onChange={(e) => setEditingRoom({ ...editingRoom, category: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Brief Summary Slogan</label>
                        <input
                          type="text"
                          value={editingRoom.shortDescription || ""}
                          onChange={(e) => setEditingRoom({ ...editingRoom, shortDescription: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Guests count limit</label>
                          <input
                            type="number"
                            value={editingRoom.capacityGuests || 2}
                            onChange={(e) => setEditingRoom({ ...editingRoom, capacityGuests: Number(e.target.value) })}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Beds arrangement</label>
                          <input
                            type="number"
                            value={editingRoom.capacityBeds || 1}
                            onChange={(e) => setEditingRoom({ ...editingRoom, capacityBeds: Number(e.target.value) })}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Full Narrative Narrative Details</label>
                      <textarea
                        rows={4}
                        value={editingRoom.fullDescription || ""}
                        onChange={(e) => setEditingRoom({ ...editingRoom, fullDescription: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-navy-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Room Amenities (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Frette Linens, Butler, Private Bar..."
                          value={editingRoom.amenities?.join(", ") || ""}
                          onChange={(e) => setEditingRoom({ ...editingRoom, amenities: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Image URLs list (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Paste image web links..."
                          value={editingRoom.images?.join(", ") || ""}
                          onChange={(e) => setEditingRoom({ ...editingRoom, images: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900"
                        />
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-400">OR</span>
                          <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-xs font-mono font-bold text-gray-700 transition-colors">
                            {isUploading ? "Uploading..." : "Upload Image"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await uploadImageToServer(file);
                                if (url) {
                                  const currentImages = editingRoom.images || [];
                                  setEditingRoom({ ...editingRoom, images: [...currentImages, url] });
                                }
                                e.target.value = "";
                              }}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                          {editingRoom.images && editingRoom.images.length > 0 && (
                            <span className="text-[10px] font-mono text-green-600">{editingRoom.images.length} image(s)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-8 py-3 border-y border-dashed border-gray-100 text-xs font-mono">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingRoom.featured || false}
                          onChange={(e) => setEditingRoom({ ...editingRoom, featured: e.target.checked })}
                          className="w-4 h-4 text-golden-600 rounded"
                        />
                        <span>Feature Room on Web Homepage</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingRoom.enabled || false}
                          onChange={(e) => setEditingRoom({ ...editingRoom, enabled: e.target.checked })}
                          className="w-4 h-4 text-golden-600 rounded"
                        />
                        <span>Publish Visibility (Live)</span>
                      </label>
                    </div>

                    {/* Action panel */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-navy-950 hover:bg-golden-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Suite specs
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRoom(null)}
                        className="px-5 py-3 border border-gray-300 hover:text-red-700 hover:border-red-700 rounded-xl text-xs font-mono uppercase tracking-wider transition-all"
                      >
                        Close Editor
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Suites list table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full font-serif text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-mono uppercase text-gray-400">
                      <th className="p-4 pl-6">Room layout</th>
                      <th className="p-4">segment</th>
                      <th className="p-4">homepage featured?</th>
                      <th className="p-4 pr-6 text-right">actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {db.rooms.map((rm) => (
                      <tr key={rm.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-gray-900">{rm.name} {!rm.enabled && <span className="bg-red-100 text-red-600 text-[9px] px-1 rounded">Hidden</span>}</div>
                          <p className="text-xs text-gray-500 font-light max-w-sm truncate mt-1">{rm.shortDescription}</p>
                        </td>
                        <td className="p-4 font-mono font-medium text-gray-800">Bespoke Rate</td>
                        <td className="p-4 text-xs font-mono uppercase text-gray-500">{rm.category}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${rm.featured ? "bg-golden-100 text-golden-900" : "bg-gray-100 text-gray-400"}`}>{rm.featured ? "Featured" : "Regular"}</span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingRoom(rm);
                              // Smooth scroll upwards to editor if viewing wide screen
                              window.scrollTo({ top: 300, behavior: "smooth" });
                            }}
                            className="text-xs font-mono text-golden-600 hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(rm.id)}
                            className="text-xs font-mono text-red-600 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: GALLERY MANAGER */}
          {activeTab === "gallery" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="tab-gallery">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 border-b pb-3 border-gray-100">Portfolio Image Manager</h3>
              
              {/* Quick insert bar */}
              <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8 items-start">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1.5">Image URL (optional if uploading file)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newGalleryItem.url}
                    onChange={(e) => {
                      setUploadedImage("");
                      setNewGalleryItem({ ...newGalleryItem, url: e.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1.5">Upload Image File (max 10MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full bg-white border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-navy-900 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-mono file:uppercase file:bg-golden-600 file:text-white file:cursor-pointer"
                  />
                  {isUploading && <p className="text-[10px] text-blue-500 mt-1 font-mono">Uploading image to server...</p>}
                  {uploadError && <p className="text-[10px] text-red-500 mt-1 font-mono">{uploadError}</p>}
                  {uploadedImage && <p className="text-[10px] text-green-600 mt-1 font-mono">✓ Image ready</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1.5">Category</label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    className="w-full bg-white border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-navy-900"
                  >
                    <option value="Exterior">Exterior</option>
                    <option value="Interior">Interior</option>
                    <option value="Rooms">Rooms</option>
                    <option value="Dining">Dining</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-navy-950 hover:bg-golden-600 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                  >
                    Add Asset
                  </button>
                </div>
              </form>

              {/* Grid visualizers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {db.gallery.map((itm) => (
                  <div key={itm.id} className="relative group rounded-xl overflow-hidden shadow-sm border bg-gray-50">
                    <img src={itm.url} alt="look tag" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                    <div className="p-2 border-t text-[10px] font-mono flex justify-between items-center bg-white">
                      <span className="text-gray-500">{itm.category}</span>
                      <button
                        onClick={() => handleDeleteGallery(itm.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete asset"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6" id="tab-testimonials">
              
              <div className="flex justify-between items-center bg-white rounded-2xl border border-gray-100 p-4">
                <span className="text-sm font-serif text-gray-600">Represented guest review recommendations</span>
                <button
                  onClick={() => setEditingTestimonial({
                    id: "",
                    authorName: "Guest Name",
                    rating: 5,
                    content: "",
                    source: "Direct",
                    featured: true
                  })}
                  className="px-4 py-2.5 bg-golden-600 hover:bg-golden-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider"
                >
                  Create Review
                </button>
              </div>

              {editingTestimonial && (
                <div className="bg-white rounded-2xl border border-golden-300 p-6 shadow-md">
                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">Author Name *</label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.authorName || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorName: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:outline-none px-3 py-2 text-sm text-navy-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">Star rating (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={editingTestimonial.rating || 5}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                          className="w-full bg-gray-50 border border-gray-200 focus:outline-none px-3 py-2 text-sm text-navy-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">Source / Channel label</label>
                        <input
                          type="text"
                          value={editingTestimonial.source || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, source: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:outline-none px-3 py-2 text-sm text-navy-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1">Review feedback text *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.content || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:outline-none p-3 text-sm text-navy-900"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button type="submit" className="px-4 py-2 bg-navy-950 text-white text-xs font-mono rounded">Save</button>
                      <button type="button" onClick={() => setEditingTestimonial(null)} className="px-3 py-2 border text-xs font-mono rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {db.testimonials.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-gray-900">{t.authorName}</span>
                        <span className="text-golden-500 text-xs">{"★".repeat(t.rating)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{t.source || "Direct Guest"}</span>
                      <p className="text-xs text-gray-600 italic font-light">"{t.content}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setEditingTestimonial(t)} className="text-xs font-mono text-golden-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="text-xs font-mono text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: CONTACT INQUIRIES GUEST PORTAL */}
          {activeTab === "messages" && (
            <div className="space-y-6" id="tab-messages">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-gray-400">Archived Inquiry transmissions log</span>
                <span className="font-mono text-xs text-gray-600 font-bold bg-gray-50 border px-3 py-1 rounded-full">{db.messages.length} Submissions Total</span>
              </div>

              <div className="space-y-6">
                {db.messages.map((msg) => (
                  <div key={msg.id} className={`bg-white rounded-3xl border ${msg.read ? "border-gray-100" : "border-golden-200 shadow-md"} overflow-hidden`}>
                    
                    {/* Header with quick parameters */}
                    <div className="p-5 bg-gray-50/80 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-golden-600 uppercase font-semibold">TICKET ID: {msg.id}</span>
                        <h4 className="font-serif text-lg font-bold text-gray-900 mt-1">{msg.name}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{msg.email} | {msg.phone || "No phone given"} | Received: {new Date(msg.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleMessageRead(msg.id, msg.read)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all border ${
                            msg.read
                              ? "bg-white text-gray-500 hover:bg-gray-100 border-gray-200"
                              : "bg-golden-600 text-white hover:bg-golden-700 border-transparent font-semibold"
                          }`}
                        >
                          {msg.read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 px-2.5 border rounded-lg text-red-600 hover:bg-red-50 border-gray-200 text-xs font-mono"
                          title="Delete message"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Form message content body */}
                    <div className="p-5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block mb-2 font-semibold">Inquiry body details</span>
                      <p className="text-sm text-gray-800 leading-relaxed font-light whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    {/* Administrative notes builder */}
                    <div className="p-5 bg-gray-50/50 border-t border-gray-100">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-2 font-semibold">Senior Concierge follow-up logs notes</span>
                      <textarea
                        rows={2}
                        defaultValue={msg.notes || ""}
                        placeholder="Add discreet guest follow-up notes here (e.g. VIP met, booked Presidential Suite WA, Chef notified regarding menus)..."
                        onBlur={(e) => saveMessageNotes(msg.id, e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:border-golden-600 rounded-xl p-3 text-xs text-navy-900 resize-none font-mono"
                      />
                      <span className="text-[9px] text-gray-400 mt-1 block font-mono">
                        Note: Typing inside this field automatically persists details on blur.
                      </span>
                    </div>

                  </div>
                ))}

                {db.messages.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <span className="text-xs font-mono text-gray-400">Zero active transmissions on file.</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 7: CMS PAGES MANAGER */}
          {activeTab === "pages" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="tab-pages">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 border-b pb-3 border-gray-100">Custom Static CMS Pages</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                
                {/* List Column */}
                <div className="space-y-1.5 font-mono text-xs">
                  {db.pages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPageId(p.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center justify-between ${
                        selectedPageId === p.id ? "bg-golden-100 text-golden-900 border-l-3 border-golden-600 font-semibold" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{p.title}</span>
                    </button>
                  ))}
                </div>

                {/* Rich Editor Column */}
                <div className="md:col-span-3 space-y-4">
                  {(() => {
                    const page = db.pages.find(p => p.id === selectedPageId);
                    if (!page) return <span className="text-xs text-gray-400 font-mono">Select a page to edit coordinates.</span>;

                    return (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const fd = new FormData(target);
                          const updatedPage: CMSPage = {
                            ...page,
                            title: fd.get("title") as string,
                            content: fd.get("content") as string,
                          };
                          handleSavePage(updatedPage);
                        }}
                        className="space-y-4 text-xs font-mono"
                      >
                        <div>
                          <label className="block text-gray-500 mb-1">Page Title *</label>
                          <input
                            type="text"
                            name="title"
                            required
                            defaultValue={page.title}
                            className="w-full bg-gray-50 border border-gray-200 focus:outline-none p-3 text-sm text-gray-900 font-serif font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">Body Markdown/Text content *</label>
                          <textarea
                            name="content"
                            rows={15}
                            required
                            defaultValue={page.content}
                            className="w-full bg-gray-50 border border-gray-200 focus:outline-none p-4 text-sm text-navy-900 font-serif h-96 [tab-size:4]"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-mono">Last preserved: {new Date(page.lastUpdated).toLocaleString()}</span>
                          <button
                            type="submit"
                            className="px-6 py-3 bg-navy-950 hover:bg-golden-600 text-white rounded-xl uppercase tracking-wider font-semibold shadow transition-colors flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            Preserve Page coordinates
                          </button>
                        </div>
                      </form>
                    );
                  })()}
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: NAVIGATION BUILDER */}
          {activeTab === "navigation" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="tab-navigation">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 border-b pb-3 border-gray-100">Global Website Menu Navigation builder</h3>
              
              <div className="space-y-4">
                
                {/* Visual items mapping list */}
                {db.menu.map((itm, index) => (
                  <div key={itm.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-gray-400">#{index+1}</span>
                      <div>
                        <span className="font-serif text-sm font-semibold text-gray-900 block">{itm.label}</span>
                        <span className="text-[10px] font-mono text-gray-400">Path URI: {itm.path}</span>
                      </div>
                    </div>

                    {/* Sorting & deletion triggers */}
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (index === 0) return;
                          const reordered = [...db.menu];
                          // exchange values
                          const tmp = reordered[index];
                          reordered[index] = reordered[index-1];
                          reordered[index-1] = tmp;
                          
                          const res = await fetch("/api/admin/menu", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify(reordered)
                          });
                          if (res.ok) { showFeedback("Menu order updated."); fetchAdminData(); triggerRefresh(); }
                        }}
                        disabled={index === 0}
                        className="p-1.5 bg-white border rounded text-xs hover:bg-gray-100 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={async () => {
                          if (index === db.menu.length - 1) return;
                          const reordered = [...db.menu];
                          const tmp = reordered[index];
                          reordered[index] = reordered[index+1];
                          reordered[index+1] = tmp;

                          const res = await fetch("/api/admin/menu", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify(reordered)
                          });
                          if (res.ok) { showFeedback("Menu order updated."); fetchAdminData(); triggerRefresh(); }
                        }}
                        disabled={index === db.menu.length - 1}
                        className="p-1.5 bg-white border rounded text-xs hover:bg-gray-100 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* TAB 9: MAINTENANCE & CORE UTILITY SYSTEM RESTORE */}
          {activeTab === "maintenance" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="tab-maintenance">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-6 border-b pb-3 border-gray-100">Power Maintenance Utilities & Password updates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Col: Password configuration */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="font-serif text-[15px] font-bold text-gray-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-golden-600" />
                    Reset Administrator Password
                  </h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Set a customized, high-security plain password to shield the administrative control dashboard from random third-party visitors.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as HTMLFormElement;
                      const pw = new FormData(target).get("new_pw") as string;
                      handleUpdatePassword(pw);
                      target.reset();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <input
                        type="password"
                        name="new_pw"
                        required
                        placeholder="Enter brand new password key (Min 4 chars)..."
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:border-golden-600 rounded-xl px-3 py-2 text-xs text-navy-900 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-navy-950 hover:bg-golden-600 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                    >
                      Update Password Key
                    </button>
                  </form>
                </div>

                {/* Col: Hard reset database seeds */}
                <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-4">
                  <h4 className="font-serif text-[15px] font-bold text-rose-950 flex items-center gap-2">
                    <Database className="w-4 h-4 text-rose-600" />
                    Restore Default Presets
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed font-light">
                    This triggers a high-severity reset. All custom gallery links, customized rates on suites, static policy amendments, and logged contact inquiries are immediately expunged.
                  </p>
                  <div>
                    <button
                      onClick={handleDatabaseReset}
                      className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      Expunge & Seed Default Database
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}

interface SettingsFormProps {
  initial?: SiteSettings | null;
  onSave: (settings: SiteSettings) => Promise<void>;
}

function SettingsForm({ initial, onSave }: SettingsFormProps) {
  const [form, setForm] = useState<SiteSettings>({
    hotelName: initial?.hotelName || "",
    tagline: initial?.tagline || "",
    logoUrl: initial?.logoUrl || "",
    faviconUrl: initial?.faviconUrl || "",
    accentColor: initial?.accentColor || "indigo",
    primaryPhone: initial?.primaryPhone || "",
    secondaryPhone: initial?.secondaryPhone || "",
    whatsappNumber: initial?.whatsappNumber || "",
    whatsappPrefilledText: initial?.whatsappPrefilledText || "",
    emailAddress: initial?.emailAddress || "",
    address: initial?.address || "",
    googleMapsEmbedUrl: initial?.googleMapsEmbedUrl || "",
    instagramUrl: initial?.instagramUrl || "",
    facebookUrl: initial?.facebookUrl || "",
    twitterUrl: initial?.twitterUrl || "",
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    seoKeywords: initial?.seoKeywords || "",
    footerContent: initial?.footerContent || "",
    maintenanceMode: initial?.maintenanceMode || false,
    heroImageUrl: initial?.heroImageUrl || "https://images.unsplash.com/photo-1542314831-c6a420828f41?auto=format&fit=crop&w=2000&q=80"
  });
  const [saving, setSaving] = useState(false);

  const update = (key: keyof SiteSettings, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("luxury_admin_token");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        update("heroImageUrl", data.url);
      } else {
        alert("Hero image upload failed.");
      }
    } catch (err) {
      alert("Network error uploading hero image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Hotel Name</label>
          <input type="text" required value={form.hotelName} onChange={e => update("hotelName", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Tagline</label>
          <input type="text" value={form.tagline} onChange={e => update("tagline", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
        <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-3">Homepage Hero Image</label>
        <div className="flex items-start gap-4">
          <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative group">
            {form.heroImageUrl ? (
              <img src={form.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-mono">Preview</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <input type="text" value={form.heroImageUrl} onChange={e => update("heroImageUrl", e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-navy-900" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">OR</span>
              <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-xs font-mono font-bold text-gray-700 transition-colors">
                Upload File
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Primary Phone</label>
          <input type="text" required value={form.primaryPhone} onChange={e => update("primaryPhone", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Secondary Phone</label>
          <input type="text" value={form.secondaryPhone} onChange={e => update("secondaryPhone", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">WhatsApp Number</label>
          <input type="text" required value={form.whatsappNumber} onChange={e => update("whatsappNumber", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">WhatsApp Prefilled Message</label>
        <textarea name="whatsappPrefilledText" rows={2} value={form.whatsappPrefilledText} onChange={e => update("whatsappPrefilledText", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-navy-900 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Email Address</label>
          <input type="email" required value={form.emailAddress} onChange={e => update("emailAddress", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Street Address</label>
          <input type="text" required value={form.address} onChange={e => update("address", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Google Maps Embed URL</label>
        <input type="text" value={form.googleMapsEmbedUrl} onChange={e => update("googleMapsEmbedUrl", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-xs text-navy-900" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">SEO Title</label>
          <input type="text" value={form.seoTitle} onChange={e => update("seoTitle", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">SEO Description</label>
          <input type="text" value={form.seoDescription} onChange={e => update("seoDescription", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">SEO Keywords</label>
          <input type="text" value={form.seoKeywords} onChange={e => update("seoKeywords", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Footer Copyright</label>
          <input type="text" value={form.footerContent} onChange={e => update("footerContent", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Instagram URL</label>
          <input type="text" value={form.instagramUrl} onChange={e => update("instagramUrl", e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">Maintenance Mode</label>
          <select value={form.maintenanceMode ? "true" : "false"} onChange={e => update("maintenanceMode", e.target.value === "true")} className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-navy-900">
            <option value="false">Live</option>
            <option value="true">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-navy-950 hover:bg-golden-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-60">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}






