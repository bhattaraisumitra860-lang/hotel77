/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  ArrowLeft, 
  Info, 
  UploadCloud, 
  CheckCircle, 
  Eye, 
  Trash2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Project } from '../types';

interface AddProjectViewProps {
  editingProject: Project | null;
  onSave: (project: Project) => void;
  setView: (view: 'dashboard' | 'projects-list' | 'add-project' | 'public-portfolio') => void;
  onDiscard: () => void;
}

// Preset high-fidelity design image URLs that the user can pick immediately
const PRESET_IMAGES = [
  { name: 'Glass Pavilion (Architecture)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpFZ7y23Eemp5uGwLWpP-YUcdCfrqNSZkbmyUKrbSMyN8Y14-h3esD_yk1NSyAvtrXgTv-HUHxhkOkHyoM5EGQa4SoOFBc_4-mtMbjzIlkrN94fUWTtBBFUiXHVzeyWgAqc4-XVEcRG5REUUmtYyno865_jQFGwjPo4EzkmpyiJHLJjCBeocCFDAIvcAncU7SbrXpBDhNGo7SfOXTxRrTs9N1Y0ZZEgyRZsavu-1TptW86vzr5lPFEBeKmMwbZy67TPCTh0JIzE8Q' },
  { name: 'Nexus Dashboard (UI/UX)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_4DyJAFMh_3Z5Zbq9I0SMYddQ-GCRBdcYS6i4mdofRtYO13tQJTeiNIw1KIVt_rrH61HwNI9tSXGKNvBwivuGt3gqYYTlwFNjPNa2wIGl6flyUzFDv-oXog-GDENwyHTOL6zYkmig1Q-fLRzOp0pxTV28UU-arxP9OYR-oqyvgYHdpho2jOUGzMUuJhbm4CNtMY6cp7IRvoJhbLWh_GaNAyj9Ysta6F4rWO_BQkqz-OBeSLFiRG62nBL4jpr0YjtIDGdCUUmuJOo' },
  { name: 'Monolith (Visual Branding)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFImFPAYwpPtpE0FETCiZbil_nJ3REVbOpvRq5XxBI2Axn0sXwl_28F8gcaiECjq6OFRb9jQp7NitdRrqInKPzl93z4MYmr2Z_TCFP2NrYhz8ZPTcOhcgpY2zOGbZctuar94GhJsVV2qmKJEReiPJ1J1Uw-Q5mX92BMJG1kcdE4vioGAtRIgEvyhTIxczWfvaajlp-d0laYP7GRuWQdLeOzOstWd32NZyfh_5UHp1M_Ge5A0psnLM5PX04uTX_MvnxwE2cH3GWJQI' },
  { name: 'Urban Transit Hub (Smart City)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd3iR6UQxHoEIp2_m-utDApzkGTqHCg48pxSOlLDKqt7obkkx5iqhwYB0FGFGn7sO0HSDFTKv5Pp6MQKzBuVt9deBp5DTCuDG0VuwWBjO3NxH6B57CH4F9o79F7wUUut7nVjZbC5HuHLmnJjYLZhy7hzkVq_l3D5O-iUOm9SWTZL43btdKjIxo2jtL9EIT5dcyAfGSpfm6mFZmddFtuCEyhoznf1rdhvdqfV9LrztLgWdNHVhhR9vXA5qDmkIP7tmIR6Y8_IMlsXE' },
  { name: 'Brutalist Pavilion (Concrete)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Jbtl9NkAhEL59izcEuvh7OLtfwp64slslyYrnQnnj5x9hNQSGIy3456i27Ehl8GmmWCeLdDIiHaOwlHr4wpgiuhtvdis2me9RJRMxX2GIvRMs-Ftmrlh4aBZllbvqawErWLS5iGlWD3pt58Y3zhjb7qtXAJt5BNn9lUW6vQ1ujAwUIOXhwi6wPSiJ62nqlziD-HS-fTI0WWLYf0UrSTb773ZY8fOfkRPGXLMGQ5hG3GwL3OZZYWDOC6sdowJfLNao_6mjCK2AqU' }
];

export default function AddProjectView({ editingProject, onSave, setView, onDiscard }: AddProjectViewProps) {
  // Local Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');
  const [customImageMode, setCustomImageMode] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Auto-fill form if editing an existing project
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setTags(editingProject.tags);
      setDescription(editingProject.description);
      setClient(editingProject.client || '');
      setYear(editingProject.year || 2026);
      setLocation(editingProject.location || '');
      setImage(editingProject.image);
      setStatus(editingProject.status);
      
      // Determine if image is preset
      const isPreset = PRESET_IMAGES.some(p => p.url === editingProject.image);
      if (!isPreset) {
        setCustomImageMode(true);
        setCustomImageUrl(editingProject.image);
      } else {
        setCustomImageMode(false);
      }
    } else {
      // Clear form for new draft
      setTitle('');
      setCategory('Architecture');
      setTags('');
      setDescription('');
      setClient('');
      setYear(2026);
      setLocation('');
      setImage(PRESET_IMAGES[0].url);
      setStatus('Draft');
      setCustomImageMode(false);
      setCustomImageUrl('');
    }
  }, [editingProject]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Project Title is required!');
      return;
    }

    const finalImage = customImageMode && customImageUrl.trim() ? customImageUrl : image;

    const savedProject: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      category,
      tags: tags.trim() || category,
      image: finalImage,
      views: editingProject ? editingProject.views : Math.floor(Math.random() * 500) + 10,
      viewsGrowth: editingProject ? editingProject.viewsGrowth : Number((Math.random() * 15 * (Math.random() > 0.3 ? 1 : -1)).toFixed(1)),
      modifiedAt: 'Just now',
      createdAtDate: editingProject ? editingProject.createdAtDate : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      client: client.trim() || 'Independent',
      year: year || 2026,
      status,
      location: location.trim() || 'Global',
      featured: editingProject ? editingProject.featured : true
    };

    onSave(savedProject);
  };

  const handlePresetSelect = (url: string) => {
    setCustomImageMode(false);
    setImage(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-editorial-ink">
      
      {/* Top Header */}
      <header className="h-20 flex items-center justify-between border-b border-editorial-border/60 sticky top-0 bg-editorial-bg/90 backdrop-blur-md z-40 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onDiscard}
            className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-editorial-neutral hover:text-editorial-ink active:scale-95"
            title="Go back without saving"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-serif text-3xl font-normal text-editorial-ink tracking-tight">
            {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-editorial-neutral font-sans text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-editorial-accent animate-pulse"></span>
            Autosaved just now
          </span>
        </div>
      </header>

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Fields (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Card 1: Primary Details */}
          <section className="bg-editorial-surface p-6 md:p-8 rounded-2xl border border-editorial-border shadow-sm flex flex-col gap-6">
            
            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1" htmlFor="p-title">
                Project Title *
              </label>
              <input 
                required
                id="p-title"
                type="text" 
                placeholder="e.g., Minimalist Glass House"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-4 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none transition-all text-editorial-ink font-semibold placeholder-editorial-neutral/40"
              />
            </div>

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1" htmlFor="p-category">
                  Category *
                </label>
                <select 
                  id="p-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-4 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none transition-all text-editorial-ink font-semibold"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Interior">Interior Design</option>
                  <option value="Visual Branding">Visual Branding</option>
                  <option value="Design">Commercial Design</option>
                  <option value="Visuals">Visual Art</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>

              {/* Tags Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1" htmlFor="p-tags">
                  Tags (Optional)
                </label>
                <input 
                  id="p-tags"
                  type="text" 
                  placeholder="e.g. Modern, Sustainable, Glass"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-4 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none transition-all text-editorial-ink placeholder-editorial-neutral/40"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1" htmlFor="p-desc">
                Project Description
              </label>
              <textarea 
                id="p-desc"
                rows={7}
                placeholder="Detailed explanation of the concept, materials, structural components, and overarching design philosophy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-4 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none resize-none transition-all text-editorial-ink leading-relaxed placeholder-editorial-neutral/40"
              />
            </div>
          </section>

          {/* Card 2: Metadata Fields */}
          <section className="bg-editorial-surface p-6 md:p-8 rounded-2xl border border-editorial-border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-normal text-editorial-ink tracking-tight flex items-center gap-2">
                <span>Metadata specifications</span>
              </h3>
              <Info size={18} className="text-editorial-accent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1">
                  Client Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Atelier West"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-3.5 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none text-editorial-ink placeholder-editorial-neutral/40"
                />
              </div>

              {/* Completion Year */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1">
                  Completion Year
                </label>
                <input 
                  type="number" 
                  placeholder="2026"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-3.5 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none text-editorial-ink font-semibold placeholder-editorial-neutral/40"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest ml-1">
                  Location / City
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Seattle, WA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-xl p-3.5 text-sm font-sans focus:ring-2 focus:ring-editorial-accent outline-none text-editorial-ink placeholder-editorial-neutral/40"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Upload, Presets & Publish (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Card 1: Hero Image and Presets */}
          <section className="bg-editorial-surface p-6 rounded-2xl border border-editorial-border shadow-sm flex flex-col gap-4">
            <h3 className="font-mono text-[10px] font-black text-editorial-accent uppercase tracking-widest">
              Hero Image Asset
            </h3>

            {/* Current Selected Image Preview */}
            <div className="aspect-[16/10] bg-editorial-bg rounded-xl overflow-hidden border border-editorial-border/60 relative group">
              <img 
                src={customImageMode && customImageUrl.trim() ? customImageUrl : image} 
                alt="Selected Showcase Banner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-editorial-accent text-editorial-bg text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Showcase Preview
                </span>
              </div>
            </div>

            {/* Custom URL mode vs Preset Presets selection */}
            <div className="flex gap-2 border-b border-editorial-border/40 pb-3 mt-1">
              <button
                type="button"
                onClick={() => setCustomImageMode(false)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  !customImageMode 
                    ? 'bg-editorial-accent text-editorial-bg shadow' 
                    : 'bg-editorial-bg text-editorial-neutral border border-editorial-border hover:text-editorial-ink'
                }`}
              >
                Presets
              </button>
              <button
                type="button"
                onClick={() => setCustomImageMode(true)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  customImageMode 
                    ? 'bg-editorial-accent text-editorial-bg shadow' 
                    : 'bg-editorial-bg text-editorial-neutral border border-editorial-border hover:text-editorial-ink'
                }`}
              >
                Custom URL
              </button>
            </div>

            {/* Conditional input display based on mode */}
            {customImageMode ? (
              <div className="flex flex-col gap-1.5 mt-2 bg-editorial-bg p-3 rounded-xl border border-editorial-border/60">
                <span className="text-[10px] text-editorial-accent font-mono">Input high-res HTTP image link:</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 bg-editorial-surface border border-editorial-border rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <span className="text-[10px] text-editorial-neutral font-bold uppercase tracking-wider block">Choose from high-fidelity assets:</span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-editorial-border">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePresetSelect(img.url)}
                      className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center gap-3 border transition-all cursor-pointer ${
                        image === img.url && !customImageMode
                          ? 'border-editorial-accent bg-editorial-accent/15 text-editorial-accent font-bold'
                          : 'border-editorial-border bg-editorial-bg hover:bg-white/5 text-editorial-neutral'
                      }`}
                    >
                      <div className="w-8 h-6 bg-editorial-surface rounded overflow-hidden shrink-0 border border-editorial-border/40">
                        <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="truncate">{img.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Drag and drop mock layout */}
            <div className="border border-dashed border-editorial-border hover:border-editorial-accent rounded-xl p-4 text-center mt-2 flex flex-col items-center justify-center gap-2 cursor-pointer bg-editorial-bg transition-all">
              <UploadCloud size={28} className="text-editorial-accent" />
              <div>
                <p className="text-xs font-bold text-editorial-ink">Drag &amp; drop local file</p>
                <p className="text-[10px] text-editorial-neutral">PNG, JPG, WEBP (simulated upload)</p>
              </div>
            </div>
          </section>

          {/* Card 2: Publishing controls */}
          <section className="bg-editorial-surface p-6 rounded-2xl border border-editorial-border shadow-lg flex flex-col gap-6 sticky top-28">
            
            {/* Toggle Status */}
            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-[10px] font-black text-editorial-accent uppercase tracking-widest">
                Publishing Status
              </h3>
              
              <div className="flex gap-2 bg-editorial-bg p-1 rounded-xl border border-editorial-border/60">
                <button
                  type="button"
                  onClick={() => setStatus('Draft')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    status === 'Draft' 
                      ? 'bg-editorial-surface text-editorial-ink shadow-md' 
                      : 'text-editorial-neutral hover:text-editorial-ink'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-editorial-neutral/50"></span>
                  <span>Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Published')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    status === 'Published' 
                      ? 'bg-editorial-accent text-editorial-bg shadow-md' 
                      : 'text-editorial-neutral hover:text-editorial-ink'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-editorial-surface"></span>
                  <span>Published</span>
                </button>
              </div>
              <p className="text-[10px] text-editorial-neutral leading-relaxed px-1">
                * Published projects instantly sync onto the dynamic Client Portfolio public site.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-3 pt-4 border-t border-editorial-border/60">
              <button 
                type="submit"
                className="w-full bg-editorial-accent text-editorial-bg py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-editorial-accent-hover transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle size={18} />
                <span>Save Project</span>
              </button>

              <div className="flex items-center justify-between text-xs font-semibold px-1 mt-1">
                <button 
                  type="button"
                  onClick={onDiscard}
                  className="text-editorial-neutral hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Discard Draft
                </button>
                
                <button 
                  type="button"
                  onClick={() => setView('public-portfolio')}
                  className="text-editorial-neutral hover:text-editorial-accent transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Preview Page</span>
                  <Eye size={14} />
                </button>
              </div>
            </div>
          </section>

        </div>
      </form>
    </div>
  );
}
