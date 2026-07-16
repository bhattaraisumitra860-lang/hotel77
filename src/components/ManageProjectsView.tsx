/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff,
  SlidersHorizontal
} from 'lucide-react';
import { Project } from '../types';

interface ManageProjectsViewProps {
  projects: Project[];
  setView: (view: 'dashboard' | 'projects-list' | 'add-project' | 'public-portfolio') => void;
  setEditingProject: (project: Project | null) => void;
  onDeleteProject: (id: string) => void;
  onShowToast: (message: string) => void;
}

export default function ManageProjectsView({ 
  projects, 
  setView, 
  setEditingProject, 
  onDeleteProject,
  onShowToast
}: ManageProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Items per page
  const itemsPerPage = 4;

  // Collect all unique categories for the filters dropdown
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filtering logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalItems = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Slice current page items
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setView('add-project');
  };

  const handleAddNewClick = () => {
    setEditingProject(null);
    setView('add-project');
  };

  const handleDeleteClick = (project: Project) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${project.title}"?\nThis action cannot be undone.`);
    if (confirmDelete) {
      onDeleteProject(project.id);
      onShowToast(`"${project.title}" has been deleted successfully.`);
      
      // Adjust current page if we deleted the last item on the page
      const updatedTotalItems = totalItems - 1;
      const updatedTotalPages = Math.ceil(updatedTotalItems / itemsPerPage);
      if (currentPage > updatedTotalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-editorial-ink">
      
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
        <div>
          <h2 className="font-serif text-5xl font-normal text-editorial-ink tracking-tight mb-1">
            Manage Projects
          </h2>
          <p className="font-sans text-base text-editorial-neutral">
            Curate, organize, and publish your professional creative showcase.
          </p>
        </div>
        <button 
          onClick={handleAddNewClick}
          className="bg-editorial-accent text-editorial-bg px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-editorial-accent-hover transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add New Project</span>
        </button>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-editorial-surface border border-editorial-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4 shadow-sm relative">
        {/* Search input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-neutral">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search projects by title, category, tags, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on filter
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-editorial-bg border border-editorial-border rounded-xl font-sans text-sm text-editorial-ink placeholder-editorial-neutral/50 focus:ring-2 focus:ring-editorial-accent outline-none transition-all"
          />
        </div>

        {/* Filters button and dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className={`px-5 py-2.5 border rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer w-full md:w-auto ${
              selectedCategory !== 'All' 
                ? 'border-editorial-accent bg-editorial-accent/15 text-editorial-accent' 
                : 'border-editorial-border hover:bg-white/5 text-editorial-ink'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>{selectedCategory === 'All' ? 'Filters' : `Category: ${selectedCategory}`}</span>
          </button>

          {/* Dynamic Filter Dropdown */}
          {showFiltersDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-editorial-surface border border-editorial-border rounded-xl shadow-2xl z-50 p-2 space-y-1 text-editorial-ink">
              <p className="text-[10px] font-bold text-editorial-accent font-mono uppercase tracking-widest px-3 py-1.5 border-b border-editorial-border/60">
                Filter Category
              </p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                    setShowFiltersDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-editorial-accent/15 text-editorial-accent font-bold' 
                      : 'hover:bg-white/5 text-editorial-neutral hover:text-editorial-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-editorial-surface border border-editorial-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151515] border-b border-editorial-border/60">
                <th className="px-6 py-4 font-mono text-xs font-bold text-editorial-accent uppercase tracking-widest">
                  Project Title
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold text-editorial-accent uppercase tracking-widest">
                  Date Created
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold text-editorial-accent uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold text-editorial-accent uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 font-mono text-xs font-bold text-editorial-accent uppercase tracking-widest text-right pr-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-border/40">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 font-sans text-sm text-editorial-neutral">
                    No projects match your search filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((project) => (
                  <tr key={project.id} className="hover:bg-editorial-bg transition-colors group">
                    
                    {/* Project Title and details */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-11 rounded-lg bg-editorial-bg border border-editorial-border overflow-hidden shrink-0">
                          <img 
                            className="w-full h-full object-cover" 
                            alt={project.title} 
                            src={project.image}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-bold text-editorial-ink truncate">
                            {project.title}
                          </p>
                          <p className="font-sans text-xs text-editorial-neutral mt-0.5 truncate">
                            {project.client} • {project.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date Created */}
                    <td className="px-6 py-4.5 font-sans text-xs font-semibold text-editorial-neutral">
                      {project.createdAtDate}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4.5">
                      <span className="px-3 py-1 bg-editorial-bg text-editorial-accent border border-editorial-border/60 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {project.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          project.status === 'Published' ? 'bg-editorial-accent' : 'bg-editorial-neutral/40'
                        }`}></div>
                        <span className={`font-sans text-xs font-bold ${
                          project.status === 'Published' ? 'text-editorial-accent' : 'text-editorial-neutral/50'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions buttons */}
                    <td className="px-6 py-4.5 text-right pr-6">
                      <div className="flex justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => handleEditClick(project)}
                          className="p-2 hover:bg-editorial-accent/15 hover:text-editorial-accent text-editorial-neutral rounded-lg transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(project)}
                          className="p-2 hover:bg-rose-500/20 hover:text-rose-400 text-editorial-neutral rounded-lg transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginated Footer */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-editorial-bg border-t border-editorial-border/60 gap-4">
          <span className="font-sans text-xs font-semibold text-editorial-neutral">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} projects
          </span>

          {/* Navigation Controls */}
          <div className="flex gap-1.5 items-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-editorial-border bg-editorial-surface hover:bg-white/5 disabled:opacity-30 text-editorial-ink transition-colors cursor-pointer flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button 
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-9 h-9 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer ${
                  currentPage === num 
                    ? 'bg-editorial-accent text-editorial-bg shadow-sm font-bold' 
                    : 'bg-editorial-surface border border-editorial-border text-editorial-ink hover:bg-white/5'
                }`}
              >
                {num}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-editorial-border bg-editorial-surface hover:bg-white/5 disabled:opacity-30 text-editorial-ink transition-colors cursor-pointer flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
