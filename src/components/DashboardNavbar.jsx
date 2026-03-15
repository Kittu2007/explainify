"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sparkles, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function DashboardNavbar() {
  const pathname = usePathname();
  
  // Basic breadcrumb logic
  const segments = pathname.split('/').filter(Boolean);
  const currentTool = segments[segments.length - 1] || 'Dashboard';
  
  const toolDisplayNames = {
    'results': 'Analysis Summary',
    'chat': 'AI Knowledge Assistant',
    'video': 'Visual Learning engine',
    'upload': 'Import Document',
    'dashboard': 'Control Center'
  };

  const displayName = toolDisplayNames[currentTool] || currentTool.charAt(0).toUpperCase() + currentTool.slice(1);

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-primary">{currentTool}</span>
        </div>
        <div className="h-6 w-[1px] bg-gray-200 mx-2" />
        <h1 className="text-xl font-black text-dark tracking-tight capitalize">
          {displayName}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search in knowledge..." 
              className="bg-gray-100 border-none rounded-2xl py-2 pl-10 pr-4 text-xs font-medium w-64 focus:ring-2 focus:ring-primary/20 transition-all"
           />
        </div>

        <div className="flex items-center gap-3">
           <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary/20 transition-all relative">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
           <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-2 text-primary font-bold text-xs px-4">
              <Sparkles size={16} />
              <span>AI Active</span>
           </div>
        </div>
      </div>
    </header>
  );
}
