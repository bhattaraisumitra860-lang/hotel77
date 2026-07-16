/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  ArrowDown, 
  ArrowUpRight, 
  ExternalLink, 
  ArrowRight,
  Globe,
  Share2,
  Link as LinkIcon,
  X,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Project, Profile } from '../types';

interface PortfolioViewProps {
  projects: Project[];
  profile: Profile;
  setView: (view: 'dashboard' | 'projects-list' | 'add-project' | 'public-portfolio') => void;
  onAddInquiry: (inquiry: { sender: string; company: string; email: string; message: string }) => void;
}

export default function PortfolioView({ projects, profile, setView, onAddInquiry }: PortfolioViewProps) {
  const [filter, setFilter] = useState<string>('All');
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Filter projects (only show published on the public portfolio)
  const publishedProjects = projects.filter(p => p.status === 'Published');
  
  const filteredProjects = filter === 'All' 
    ? publishedProjects 
    : publishedProjects.filter(p => p.category.toLowerCase() === filter.toLowerCase() || p.tags.toLowerCase().includes(filter.toLowerCase()));

  // Available filters based on existing categories in published projects
  const availableFilters = ['All', 'UI/UX', 'Architecture', 'Design', 'Visuals'];

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      alert('Please fill out the name, email, and message fields!');
      return;
    }

    onAddInquiry({
      sender: contactName,
      company: contactCompany || 'Independent',
      email: contactEmail,
      message: contactMessage
    });

    setShowContactSuccess(true);
    setContactName('');
    setContactCompany('');
    setContactEmail('');
    setContactMessage('');

    setTimeout(() => {
      setShowContactSuccess(false);
      setShowContactModal(false);
    }, 3000);
  };

  return (
    <div className="bg-editorial-bg text-editorial-ink min-h-screen selection:bg-editorial-accent selection:text-editorial-bg font-sans relative">
      
      {/* Floating Workspace Mode Switcher (For developer convenience) */}
      <div className="fixed bottom-6 left-6 z-[100] bg-editorial-surface text-editorial-ink px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-editorial-border">
        <Lock size={14} className="text-editorial-accent" />
        <span className="text-xs font-mono font-bold">Admin Sandbox</span>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg text-[11px] font-sans font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer"
        >
          Return to Console
        </button>
      </div>

      {/* Embedded Marquee and scroll helper CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <nav className="w-full sticky top-0 z-50 bg-editorial-bg/85 backdrop-blur-md border-b border-editorial-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center h-20">
          <a href="#" className="font-serif text-xl font-semibold text-editorial-ink tracking-tight">
            STUDIO_PRO
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#work" className="text-sm font-semibold text-editorial-accent border-b-2 border-editorial-accent pb-1">Work</a>
            <a 
              href="#archive" 
              onClick={(e) => { e.preventDefault(); alert('Archive contains full historical projects dating back to 2018. Available in Premium Tier.'); }} 
              className="text-sm font-medium text-editorial-neutral hover:text-editorial-ink transition-colors"
            >
              Archive
            </a>
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); alert('STUDIO_PRO is a creative framework developed for industry directors who value brutalist spaces and precision typography.'); }} 
              className="text-sm font-medium text-editorial-neutral hover:text-editorial-ink transition-colors"
            >
              About
            </a>
            <a href="#contact-section" className="text-sm font-medium text-editorial-neutral hover:text-editorial-ink transition-colors">Contact</a>
            
            <button 
              onClick={() => setShowContactModal(true)}
              className="bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ml-4 cursor-pointer"
            >
              Hire Me
            </button>
          </div>
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setShowContactModal(true)}
            className="md:hidden flex items-center gap-1.5 text-xs bg-editorial-accent text-editorial-bg px-4 py-2 rounded-full font-bold"
          >
            <MessageSquare size={14} />
            <span>Contact</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-editorial-bg border-b border-editorial-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-editorial-accent/10 text-editorial-accent text-xs font-bold mb-6 tracking-widest uppercase border border-editorial-accent/20">
              Digital Architect
            </span>
            <h1 className="text-5xl md:text-8xl font-normal font-serif text-editorial-ink leading-[1.1] tracking-tight mb-8">
              Architect of <br />
              <span className="text-editorial-accent inline-block mt-1">Digital Experiences</span>
            </h1>
            <p className="text-lg md:text-xl text-editorial-neutral max-w-2xl leading-relaxed mb-12">
              I bridge the gap between architectural precision and digital fluidity, creating high-fidelity interfaces for global visionaries and top-tier engineering teams.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#work" 
                className="bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg px-8 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                <span>View Showcase</span>
                <ArrowDown size={16} />
              </a>
              <button 
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-editorial-border text-editorial-ink hover:bg-white/5 px-8 py-4 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Let's Talk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-24 bg-editorial-bg" id="work">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-editorial-border pb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-normal text-editorial-ink tracking-tight mb-3">
                Featured Projects
              </h2>
              <p className="text-editorial-neutral max-w-lg text-sm md:text-base">
                A curated selection of works ranging from architectural visualizations to complex system designs.
              </p>
            </div>
            
            {/* Real filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-editorial-neutral uppercase tracking-widest mr-2 font-mono">Filter by:</span>
              {availableFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    filter === f 
                      ? 'bg-editorial-accent text-editorial-bg' 
                      : 'text-editorial-neutral hover:bg-[#252525] hover:text-editorial-ink bg-[#151515] border border-editorial-border'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout (Re-imagined beautifully with real filter support) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {filteredProjects.length === 0 ? (
              <div className="col-span-12 py-12 text-center bg-editorial-surface rounded-2xl border border-dashed border-editorial-border">
                <p className="text-editorial-neutral font-medium">No published projects found matching filter: {filter}</p>
                <button 
                  onClick={() => setFilter('All')} 
                  className="mt-2 text-xs font-bold text-editorial-accent underline"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredProjects.map((p, index) => {
                // Let's layout nicely. 
                // Index 0 -> large (8 cols on desktop), index 1 -> small vertical (4 cols), 
                // index 2 -> small vertical (4 cols), index 3 -> landscape wide (8 cols)
                const isFirst = index % 4 === 0;
                const isSecond = index % 4 === 1;
                const isThird = index % 4 === 2;
                const isFourth = index % 4 === 3;

                let colSpanClass = 'md:col-span-6';
                if (isFirst) colSpanClass = 'md:col-span-8';
                if (isSecond) colSpanClass = 'md:col-span-4';
                if (isThird) colSpanClass = 'md:col-span-4';
                if (isFourth) colSpanClass = 'md:col-span-8';

                return (
                  <div 
                    key={p.id}
                    className={`${colSpanClass} bg-editorial-surface rounded-2xl border border-editorial-border shadow-sm hover:border-editorial-accent/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer`}
                    onClick={() => {
                      alert(`Project Selected: ${p.title}\nClient: ${p.client}\nYear: ${p.year}\nDescription: ${p.description}`);
                    }}
                  >
                    {/* Project image */}
                    <div className="aspect-[16/10] overflow-hidden bg-editorial-bg border-b border-editorial-border relative">
                      <img 
                        src={p.image} 
                        alt={p.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-editorial-bg/85 backdrop-blur-xs text-editorial-accent text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-editorial-accent/20">
                        {p.category}
                      </div>
                    </div>

                    {/* Metadata body */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-2xl font-normal text-editorial-ink group-hover:text-editorial-accent transition-colors truncate">
                            {p.title}
                          </h3>
                          <span className="bg-editorial-accent text-editorial-bg text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                            {p.year}
                          </span>
                        </div>
                        <p className="text-editorial-neutral text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-editorial-border/60 pt-4 mt-auto">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {p.tags.split(',').slice(0, 2).map((t, i) => (
                            <span key={i} className="text-[10px] bg-editorial-bg text-editorial-neutral px-2.5 py-0.5 rounded-full font-sans font-medium border border-editorial-border">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                        
                        {/* Action icon */}
                        <span className="p-2 rounded-full bg-editorial-bg text-editorial-accent group-hover:bg-[#252525] transition-all">
                          {isFourth ? <ExternalLink size={14} /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Full archive link */}
          <div className="mt-16 text-center">
            <button 
              onClick={() => alert('Viewing older projects archive. System loaded 20 projects.')}
              className="font-serif text-sm font-semibold text-editorial-ink hover:text-editorial-accent flex items-center gap-2 mx-auto border-b border-editorial-ink hover:border-editorial-accent transition-all pb-1 cursor-pointer"
            >
              <span>Explore Full Archive</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Marquee Infinite Loop banner */}
      <section className="py-12 bg-editorial-surface border-y border-editorial-border overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-16 px-8">
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">ARCHITECTURE</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">DIGITAL PRODUCT</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">VISUAL DESIGN</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">SYSTEMS THINKING</span>
          </div>
          <div className="flex items-center gap-16 px-8" aria-hidden="true">
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">ARCHITECTURE</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">DIGITAL PRODUCT</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">VISUAL DESIGN</span>
            <span className="text-4xl md:text-5xl font-black text-editorial-neutral/15 tracking-widest uppercase font-serif">SYSTEMS THINKING</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-28 bg-editorial-bg border-b border-editorial-border" id="contact-section">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-editorial-ink tracking-tight mb-6">
            Ready to build the next horizon?
          </h2>
          <p className="text-editorial-neutral max-w-xl mx-auto mb-12 text-sm md:text-base animate-pulse">
            I'm currently accepting new projects and consulting opportunities for late 2026. Let's create something enduring.
          </p>

          <button 
            onClick={() => setShowContactModal(true)}
            className="inline-block bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg px-10 py-5 rounded-full text-base md:text-lg font-bold shadow-lg shadow-editorial-accent/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {profile.email}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-editorial-surface text-editorial-neutral border-t border-editorial-border text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-editorial-ink">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-lg font-semibold text-editorial-ink tracking-tight">STUDIO_PRO</span>
            <p className="text-editorial-neutral text-xs">© 2026 Studio Pro. Built for Architects & Directors.</p>
          </div>
          
          <div className="flex gap-6 text-editorial-neutral">
            <a href="#" className="hover:text-editorial-ink underline">Privacy Policy</a>
            <a href="#" className="hover:text-editorial-ink underline">Terms of Service</a>
            <a href="#" className="hover:text-editorial-ink underline">RSS Feed</a>
          </div>
          
          <div className="flex gap-4">
            <button className="text-editorial-neutral hover:text-editorial-accent transition-colors" title="Connect">
              <LinkIcon size={18} />
            </button>
            <button className="text-gray-400 hover:text-editorial-accent transition-colors" title="Share Portfolio">
              <Share2 size={18} />
            </button>
            <button className="text-gray-400 hover:text-editorial-accent transition-colors" title="Global Site">
              <Globe size={18} />
            </button>
          </div>
        </div>
      </footer>

      {/* High-Fidelity Contact Inquiry Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-editorial-surface border border-editorial-border rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-editorial-ink">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 text-editorial-neutral hover:text-editorial-ink hover:bg-white/5 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif text-editorial-ink font-normal tracking-wide mb-1">Let's build together</h3>
            <p className="text-xs text-editorial-neutral mb-6">Your message will go directly into the client inquiry inbox in my Admin Console.</p>

            {showContactSuccess ? (
              <div className="py-12 text-center flex flex-col items-center gap-4 bg-editorial-bg border border-editorial-border rounded-xl">
                <div className="w-16 h-16 bg-editorial-accent/10 text-editorial-accent rounded-full flex items-center justify-center border border-editorial-accent/20">
                  <MessageSquare size={32} />
                </div>
                <h4 className="text-lg font-bold text-editorial-ink">Inquiry Submitted!</h4>
                <p className="text-xs text-editorial-neutral max-w-xs">Your request was successfully autosaved in the STUDIO_PRO backend database.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-editorial-neutral">Your Name *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Alex Rivera" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-border rounded-lg p-3 text-sm text-editorial-ink placeholder-editorial-neutral/50 focus:ring-2 focus:ring-editorial-accent focus:border-editorial-accent outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-editorial-neutral">Company / Organization</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Atelier West" 
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-border rounded-lg p-3 text-sm text-editorial-ink placeholder-editorial-neutral/50 focus:ring-2 focus:ring-editorial-accent focus:border-editorial-accent outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-editorial-neutral">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="e.g. alex@atelier.com" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-border rounded-lg p-3 text-sm text-editorial-ink placeholder-editorial-neutral/50 focus:ring-2 focus:ring-editorial-accent focus:border-editorial-accent outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-editorial-neutral">Your Project Brief *</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Explain your vision, budget, and estimated timeline..." 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-border rounded-lg p-3 text-sm text-editorial-ink placeholder-editorial-neutral/50 focus:ring-2 focus:ring-editorial-accent focus:border-editorial-accent outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg py-3.5 rounded-xl text-sm font-bold mt-4 transition-all"
                >
                  Send Project Brief
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
