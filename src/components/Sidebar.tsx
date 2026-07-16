/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  FolderKanban, 
  LineChart, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut, 
  Globe 
} from 'lucide-react';
import { AppView, Profile } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  profile: Profile;
  onLogout?: () => void;
  onOpenSupport?: () => void;
}

export default function Sidebar({ currentView, setView, profile, onLogout, onOpenSupport }: SidebarProps) {
  // Determine if a view is active or sub-view (like 'add-project' is under 'projects-list')
  const isProjectsActive = currentView === 'projects-list' || currentView === 'add-project';

  return (
    <aside 
      id="admin-sidebar"
      className="hidden md:flex flex-col py-6 bg-editorial-surface h-screen w-64 fixed left-0 top-0 border-r border-editorial-border z-50 transition-all duration-300"
    >
      {/* Brand Header */}
      <div className="px-6 mb-8 flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-editorial-ink tracking-tight flex items-center gap-2">
          <span>STUDIO_PRO</span>
        </h1>
        <p className="font-sans text-xs text-editorial-accent tracking-widest uppercase font-bold">
          {profile.role}
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        <button
          onClick={() => setView('dashboard')}
          className={`w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-editorial-accent/15 text-editorial-accent border-l-2 border-editorial-accent font-semibold'
              : 'text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2]'
          }`}
        >
          <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'text-editorial-accent' : 'text-editorial-neutral'} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => setView('projects-list')}
          className={`w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${
            isProjectsActive
              ? 'bg-editorial-accent/15 text-editorial-accent border-l-2 border-editorial-accent font-semibold'
              : 'text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2]'
          }`}
        >
          <FolderKanban size={20} className={isProjectsActive ? 'text-editorial-accent' : 'text-editorial-neutral'} />
          <span className="text-sm font-medium">Projects</span>
        </button>

        <button
          onClick={() => {
            setView('dashboard');
            setTimeout(() => {
              const el = document.getElementById('traffic-chart-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2] active:scale-[0.98] cursor-pointer"
        >
          <LineChart size={20} className="text-editorial-neutral" />
          <span className="text-sm font-medium">Analytics</span>
        </button>

        <button
          onClick={() => {
            alert('Settings option clicked! Here you can toggle Director Mode or customize workspace variables.');
          }}
          className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2] active:scale-[0.98] cursor-pointer"
        >
          <Settings size={20} className="text-editorial-neutral" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </nav>

      {/* Primary Action Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setView('add-project')}
          className="w-full bg-editorial-accent text-editorial-bg py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-editorial-accent-hover transition-all duration-200 active:scale-95 shadow-sm hover:shadow cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Project</span>
        </button>
      </div>

      {/* Secondary Navigation & User Profile */}
      <div className="mt-auto border-t border-editorial-border pt-4 flex flex-col gap-1">
        {/* Toggle Public Portfolio */}
        <button
          onClick={() => setView('public-portfolio')}
          className="mx-2 px-4 py-3 rounded-xl flex items-center gap-3 text-editorial-accent bg-editorial-accent/10 hover:bg-editorial-accent/20 border border-editorial-accent/20 font-semibold transition-colors cursor-pointer text-sm"
        >
          <Globe size={18} />
          <span>View Live Site</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="mx-2 px-4 py-3 rounded-xl flex items-center gap-3 text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2] transition-colors cursor-pointer text-sm text-left"
        >
          <HelpCircle size={18} />
          <span>Support</span>
        </button>

        <button
          onClick={onLogout}
          className="mx-2 px-4 py-3 rounded-xl flex items-center gap-3 text-editorial-neutral/80 hover:bg-[#252525] hover:text-[#F2F2F2] transition-colors cursor-pointer text-sm text-left"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        {/* Dynamic Admin Profile Footer Badge */}
        <div className="mx-2 px-4 py-4 flex items-center gap-3 mt-3 border-t border-editorial-border/60">
          <div className="w-10 h-10 rounded-full bg-editorial-bg overflow-hidden shrink-0 border border-editorial-accent/20 shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              alt={profile.name} 
              src={profile.avatar}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-editorial-ink truncate">{profile.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-editorial-accent font-black mt-0.5">
              PRO ACCOUNT
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
