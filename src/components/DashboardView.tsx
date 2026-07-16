/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FolderOpen, 
  Eye, 
  CheckCircle, 
  ArrowRight, 
  Bolt, 
  FileText, 
  BarChart3, 
  Mail, 
  Share2, 
  MoreVertical,
  Activity,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Project, Profile } from '../types';
import { INITIAL_TRAFFIC_DATA } from '../data';

interface DashboardViewProps {
  projects: Project[];
  profile: Profile;
  setView: (view: AppView) => void;
  setEditingProject: (project: Project | null) => void;
  onShowToast: (message: string) => void;
}

type AppView = 'dashboard' | 'projects-list' | 'add-project' | 'public-portfolio';

export default function DashboardView({ 
  projects, 
  profile, 
  setView, 
  setEditingProject,
  onShowToast
}: DashboardViewProps) {
  const [activeBar, setActiveBar] = useState<string | null>('Sun');
  const [showInquiriesModal, setShowInquiriesModal] = useState(false);

  // Inquiries dummy data
  const inquiries = [
    { id: 1, sender: 'Sarah Jenkins', company: 'Atelier Berlin', email: 'sarah@atelierberlin.de', message: 'Hello! We love your architectural work, specifically The Glass Pavilion. Are you available for a remote consultancy project starting in August?', date: '2 hours ago' },
    { id: 2, sender: 'Kenji Sato', company: 'Tokyo Nexus', email: 'sato@tokyonexus.jp', message: 'Outstanding work on the Neo-Core Platform UI. We are looking for an expert digital architect to design a new trading dashboard. Let us know if you have bandwidth.', date: '1 day ago' },
    { id: 3, sender: 'Amara Diop', company: 'Vogue Global', email: 'amara@vogue.co.uk', message: 'We are organizing our Autumn Showcase 2026 and would love to feature a physical installation of your Monolith project. Let’s hop on a call.', date: '3 days ago' }
  ];

  // Dynamic portfolio stats
  const totalProjects = projects.length;
  const publishedCount = projects.filter(p => p.status === 'Published').length;
  const totalViews = projects.reduce((acc, p) => acc + p.views, 0);
  const formattedViews = new Intl.NumberFormat('en-US').format(totalViews);

  // Calculate views growth (average or cumulative sum weighted)
  const averageGrowth = projects.length > 0 
    ? (projects.reduce((acc, p) => acc + p.viewsGrowth, 0) / projects.length).toFixed(1) 
    : '0.0';

  // Sort projects to show the 3 most recently modified
  const recentProjects = [...projects]
    .slice(0, 3); // Grab first 3 as recent or sorted as needed

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setView('add-project');
  };

  const handleShareClick = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    onShowToast('Portfolio share link copied to clipboard!');
  };

  const handleReportsClick = () => {
    alert(`Generating Portfolio Performance Report...\n\nTotal Projects: ${totalProjects}\nPublished: ${publishedCount}\nCumulative Showcase Views: ${formattedViews}\nAverage View Growth: ${averageGrowth}%\nSystem integrity verified: Stable.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-editorial-ink">
      {/* Header section */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="font-serif text-5xl font-normal text-editorial-ink tracking-tight">
            Dashboard
          </h2>
          <p className="font-sans text-base text-editorial-neutral mt-2 max-w-xl">
            Welcome back. Here is what is happening with your portfolio today.
          </p>
        </div>
        
        {/* Admin profile snippet */}
        <div className="flex items-center gap-4 bg-editorial-surface p-3 rounded-2xl border border-editorial-border self-stretch sm:self-auto">
          <div className="text-right">
            <p className="font-sans text-sm font-semibold text-editorial-ink">{profile.name}</p>
            <p className="font-sans text-xs text-editorial-accent font-bold uppercase tracking-widest">{profile.role}</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-editorial-accent/20 shrink-0">
            <img 
              className="w-full h-full object-cover" 
              alt={profile.name} 
              src={profile.avatar}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Projects Card */}
        <div className="bg-editorial-surface p-8 rounded-2xl border border-editorial-border shadow-sm hover:border-editorial-accent/30 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 rounded-xl bg-editorial-accent/10 text-editorial-accent">
              <FolderOpen size={24} />
            </span>
            <span className="text-xs font-semibold text-editorial-accent bg-editorial-accent/10 rounded-full px-3 py-1 font-mono uppercase tracking-wider border border-editorial-accent/20">
              +{projects.filter(p => p.year === 2024).length} this year
            </span>
          </div>
          <p className="font-mono text-[10px] font-bold text-editorial-neutral uppercase tracking-widest mb-1">
            Total Projects
          </p>
          <p className="font-serif text-5xl font-light text-editorial-ink">{totalProjects}</p>
        </div>

        {/* Recent Views Card */}
        <div className="bg-editorial-surface p-8 rounded-2xl border border-editorial-border shadow-sm hover:border-editorial-accent/30 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 rounded-xl bg-editorial-accent/10 text-editorial-accent">
              <Eye size={24} />
            </span>
            <span className="text-xs font-semibold text-editorial-accent bg-editorial-accent/10 rounded-full px-3 py-1 font-mono uppercase tracking-wider border border-editorial-accent/20 flex items-center gap-1">
              <TrendingUp size={12} />
              Up {averageGrowth}% avg
            </span>
          </div>
          <p className="font-mono text-[10px] font-bold text-editorial-neutral uppercase tracking-widest mb-1">
            Recent Views
          </p>
          <p className="font-serif text-5xl font-light text-editorial-ink">{formattedViews}</p>
        </div>

        {/* System Status Card */}
        <div className="bg-editorial-surface p-8 rounded-2xl border border-editorial-border shadow-sm hover:border-editorial-accent/30 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <CheckCircle size={24} />
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-900/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="font-mono text-[10px] font-bold text-editorial-neutral uppercase tracking-widest mb-1">
            System Status
          </p>
          <p className="font-serif text-5xl font-light text-editorial-ink">Stable</p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (Launch new case study + Quick Actions) - spans 4 cols */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Launch New Case Study Card */}
          <div className="bg-editorial-surface border-2 border-editorial-accent/30 text-editorial-ink p-8 rounded-2xl shadow-lg relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute -bottom-10 -right-10 text-editorial-accent opacity-10 rotate-12 transition-transform duration-500 group-hover:scale-110">
              <Activity size={180} />
            </div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-2xl font-normal mb-3 tracking-wide">
                Launch New Case Study
              </h3>
              <p className="font-sans text-sm text-editorial-neutral leading-relaxed mb-8">
                Ready to showcase your latest work? Add assets, context, and metadata in one dynamic go.
              </p>
              <button 
                onClick={() => {
                  setEditingProject(null);
                  setView('add-project');
                }}
                className="bg-editorial-accent text-editorial-bg hover:bg-editorial-accent-hover px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-pointer"
              >
                <span>Start Drafting</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-[#151515] p-8 rounded-2xl border border-editorial-border shadow-sm">
            <h3 className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest mb-6 flex items-center gap-2">
              <Bolt size={16} className="text-editorial-accent" />
              <span>Quick Actions</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setView('public-portfolio')}
                className="bg-editorial-surface hover:bg-editorial-accent/10 text-editorial-ink hover:text-editorial-accent p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-editorial-border group cursor-pointer active:scale-95"
              >
                <Eye size={20} className="text-editorial-neutral group-hover:text-editorial-accent transition-colors" />
                <span className="font-sans text-xs font-semibold">View Home</span>
              </button>

              <button 
                onClick={handleReportsClick}
                className="bg-editorial-surface hover:bg-editorial-accent/10 text-editorial-ink hover:text-editorial-accent p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-editorial-border group cursor-pointer active:scale-95"
              >
                <FileText size={20} className="text-editorial-neutral group-hover:text-editorial-accent transition-colors" />
                <span className="font-sans text-xs font-semibold">Reports</span>
              </button>

              <button 
                onClick={() => setShowInquiriesModal(true)}
                className="bg-editorial-surface hover:bg-editorial-accent/10 text-editorial-ink hover:text-editorial-accent p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-editorial-border group cursor-pointer relative active:scale-95"
              >
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-400"></div>
                <Mail size={20} className="text-editorial-neutral group-hover:text-editorial-accent transition-colors" />
                <span className="font-sans text-xs font-semibold">Inquiries</span>
              </button>

              <button 
                onClick={handleShareClick}
                className="bg-editorial-surface hover:bg-editorial-accent/10 text-editorial-ink hover:text-editorial-accent p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-editorial-border group cursor-pointer active:scale-95"
              >
                <Share2 size={20} className="text-editorial-neutral group-hover:text-editorial-accent transition-colors" />
                <span className="font-sans text-xs font-semibold">Share Site</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column (Recent activity list + Traffic bar chart) - spans 8 cols */}
        <div className="col-span-12 lg:col-span-8 bg-editorial-surface rounded-2xl border border-editorial-border p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-normal text-editorial-ink tracking-wide">
                Recent Project Activity
              </h3>
              <button 
                onClick={() => setView('projects-list')}
                className="font-sans text-sm font-semibold text-editorial-accent hover:text-editorial-accent-hover cursor-pointer flex items-center gap-1 group"
              >
                <span>View All Projects</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* List block */}
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => handleEditClick(project)}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#252525] transition-all group cursor-pointer border border-transparent hover:border-editorial-border shadow-sm"
                  title="Click to edit project details"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-editorial-bg border border-editorial-border shrink-0">
                      <img 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        alt={project.title} 
                        src={project.image}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-base font-bold text-editorial-ink truncate">
                        {project.title}
                      </h4>
                      <p className="font-sans text-xs text-editorial-neutral mt-0.5 truncate">
                        Modified {project.modifiedAt || 'Recently'} • {project.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="font-serif text-sm font-normal text-editorial-ink">{project.views} Views</p>
                      <p className={`font-mono text-xs font-bold ${
                        project.viewsGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {project.viewsGrowth >= 0 ? `+${project.viewsGrowth}%` : `${project.viewsGrowth}%`}
                      </p>
                    </div>
                    <button className="p-1.5 hover:bg-[#333] rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} className="text-editorial-neutral" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic over time section */}
          <div id="traffic-chart-section" className="mt-8 pt-8 border-t border-editorial-border/60">
            <div className="flex justify-between items-center mb-6">
              <p className="font-mono text-[10px] font-bold text-editorial-accent uppercase tracking-widest">
                Traffic Over Time
              </p>
              <div className="text-xs text-editorial-accent bg-editorial-bg border border-editorial-border rounded px-2.5 py-1 font-mono">
                Active: {activeBar ? `${activeBar} (${INITIAL_TRAFFIC_DATA.find(d => d.day === activeBar)?.views} views)` : 'Hover on a day'}
              </div>
            </div>

            {/* Bars wrapper */}
            <div className="h-44 w-full flex items-end gap-2 px-2">
              {INITIAL_TRAFFIC_DATA.map((d) => {
                const isActive = activeBar === d.day;
                return (
                  <div 
                    key={d.day}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setActiveBar(d.day)}
                  >
                    {/* The Bar */}
                    <div 
                      style={{ height: `${d.pct}%` }}
                      className={`w-full rounded-t transition-all duration-300 relative ${
                        isActive 
                          ? 'bg-editorial-accent shadow-sm shadow-editorial-accent/20' 
                          : 'bg-editorial-accent/20 hover:bg-editorial-accent/45'
                      }`}
                    >
                      {/* Tooltip on active hover */}
                      {isActive && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-editorial-bg text-editorial-accent border border-editorial-border text-[10px] py-1 px-2 rounded font-mono shadow-md whitespace-nowrap z-30">
                          {d.views} views
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-3 px-2 text-editorial-neutral font-mono text-xs font-medium">
              {INITIAL_TRAFFIC_DATA.map((d) => (
                <span 
                  key={d.day} 
                  className={`cursor-pointer pb-1 border-b-2 transition-all ${
                    activeBar === d.day ? 'text-editorial-accent border-editorial-accent' : 'border-transparent text-editorial-neutral/50'
                  }`}
                  onMouseEnter={() => setActiveBar(d.day)}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiries Modal */}
      {showInquiriesModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-editorial-surface border border-editorial-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto text-editorial-ink">
            <button 
              onClick={() => setShowInquiriesModal(false)}
              className="absolute top-4 right-4 p-2 text-editorial-neutral hover:text-editorial-ink hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-serif text-2xl font-normal text-editorial-ink tracking-wide mb-2 flex items-center gap-2">
              <Mail className="text-editorial-accent" />
              <span>Inquiries Inbox</span>
            </h3>
            <p className="font-sans text-sm text-editorial-neutral mb-6">
              Messages received via your public portfolio contact form.
            </p>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl bg-editorial-bg border border-editorial-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-serif text-base font-bold text-editorial-ink">{inq.sender}</h4>
                      <p className="font-sans text-xs text-editorial-neutral">{inq.company} • {inq.email}</p>
                    </div>
                    <span className="text-[10px] text-editorial-accent bg-editorial-surface border border-editorial-border px-2 py-0.5 rounded-full font-mono">
                      {inq.date}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-editorial-neutral leading-relaxed bg-editorial-surface p-3 rounded-lg border border-editorial-border mt-2">
                    "{inq.message}"
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <button 
                      onClick={() => alert(`Replying to ${inq.email}...`)}
                      className="text-xs bg-editorial-accent hover:bg-editorial-accent-hover text-editorial-bg px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
