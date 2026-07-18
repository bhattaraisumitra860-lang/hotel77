import React from "react";
import { Phone, MessageSquare, Mail, MapPin, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { SiteSettings } from "../types";

interface ContactSectionProps {
  settings: SiteSettings;
  onTrackClick: (type: "whatsapp" | "phone") => void;
}

export default function ContactSection({ settings, onTrackClick }: ContactSectionProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = React.useState<{
    type: "idle" | "submitting" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneClick = () => {
    onTrackClick("phone");
    window.location.href = `tel:${settings.primaryPhone}`;
  };

  const handleWhatsappClick = () => {
    onTrackClick("whatsapp");
    const encodedText = encodeURIComponent(settings.whatsappPrefilledText);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setStatus({ type: "submitting", message: "Submitting request..." });

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Your discrete custom request has been successfully routed to our senior concierge team. We will follow up shortly.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        const errorData = await res.json();
        setStatus({
          type: "error",
          message: errorData.error || "Internal connection error. Please try calling directly instead.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Network request failed. Please connect with our team directly via phone or WhatsApp.",
      });
    }
  };

  // Extract URL if user pasted full iframe HTML
  const getEmbedUrl = (input: string) => {
    if (!input) return "";
    const srcMatch = input.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : input;
  };

  const finalMapUrl = getEmbedUrl(settings.googleMapsEmbedUrl);

  return (
    <div className="py-16 bg-gray-50" id="contact-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header summary */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-3 font-semibold">
            Bespoke Contact Coordination
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Initiate Contact
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-light leading-relaxed">
            Whether organizing discrete airport limousine pickups, setting dining plans, or specifying allergy requirements, our operations room is standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Contact numbers & Details (Column span: 5) */}
          <div className="lg:col-span-5 space-y-6" id="contact-details-panel">
            
            {/* Cards container */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
              
              <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                The Concierge Office
              </h3>

              {/* Phone Line 1 */}
              <div className="flex items-start gap-4" id="primary-phone-block">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-800 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Primary Telephone Line</span>
                  <p 
                    onClick={handlePhoneClick}
                    className="text-base text-gray-900 hover:text-golden-700 transition-colors font-mono cursor-pointer mt-1 font-medium"
                  >
                    {settings.primaryPhone}
                  </p>
                </div>
              </div>

              {/* Phone Line 2 */}
              {settings.secondaryPhone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl text-gray-800 flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Secondary Phone Line</span>
                    <p 
                      onClick={() => {
                        onTrackClick("phone");
                        window.location.href = `tel:${settings.secondaryPhone}`;
                      }}
                      className="text-base text-gray-900 hover:text-golden-700 transition-colors font-mono cursor-pointer mt-1"
                    >
                      {settings.secondaryPhone}
                    </p>
                  </div>
                </div>
              )}

              {/* WhatsApp click dispatch */}
              <div className="flex items-start gap-4" id="whatsapp-dispatch-block">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Secure Encrypted WhatsApp Curation</span>
                  <p 
                    onClick={handleWhatsappClick}
                    className="text-base text-blue-600 hover:text-blue-700 transition-colors cursor-pointer mt-1 font-mono font-medium"
                  >
                    Send Direct Text
                  </p>
                </div>
              </div>

              {/* Email service */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-800 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Direct Reception Email</span>
                  <p className="text-base text-gray-900 font-mono mt-1 select-all hover:text-golden-700 transition-colors">
                    <a href={`mailto:${settings.emailAddress}`}>{settings.emailAddress}</a>
                  </p>
                </div>
              </div>

              {/* Ground address details */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-800 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Ground Operations Address</span>
                  <p className="text-sm text-gray-800 mt-1 leading-relaxed font-serif">
                    {settings.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Micro FAQ helper bullet card */}
            <div className="bg-golden-50/50 border border-golden-100/60 rounded-2xl p-5">
              <h5 className="text-[10px] font-mono uppercase tracking-wider text-golden-900 block mb-2 font-semibold">Immediate Dispatch Policy</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Our front desks maintain constant attendance details. Messages submitted via this secure gateway are printed directly at the concierge lounge, receiving a high priority.
              </p>
            </div>

          </div>

          {/* Right Panel: Interactive Form (Column span: 7) */}
          <div className="lg:col-span-7 space-y-6" id="contact-form-panel">
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                  Contact Form Inquiry
              </h3>

              {/* Status Alert Windows */}
              {status.type === "success" && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 text-xs sm:text-sm rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transmission Complete</span>
                    <p className="mt-1 text-blue-800 font-light">{status.message}</p>
                  </div>
                </div>
              )}

              {status.type === "error" && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-900 text-xs sm:text-sm rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transmission Rejected</span>
                    <p className="mt-1 text-rose-800 font-light">{status.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inputs layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sir Edward Cole"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={status.type === "submitting"}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. edward@coleventures.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={status.type === "submitting"}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">
                    Direct Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +44 7111 222333"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={status.type === "submitting"}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">
                    Details of Your Request *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Please let us know your preferred suite, dates of interest, catering requirements, or ground transport wishes..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={status.type === "submitting"}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-golden-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors resize-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.type === "submitting"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {status.type === "submitting" ? (
                    "Transmitting request..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Transmit Direct Inquiry
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Map Box */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-72">
              <iframe
                title="Hotel 77 Ground Location coordinates map"
                src={finalMapUrl}
                className="w-full h-full border-0 select-none grayscale contrast-110"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
