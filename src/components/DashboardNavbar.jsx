"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sparkles, ChevronRight, LayoutDashboard, Globe, Wand2 } from 'lucide-react';

export default function DashboardNavbar() {
  const pathname = usePathname();
  
  const segments = pathname.split('/').filter(Boolean);
  const currentTool = segments[segments.length - 1] || 'Dashboard';
  
  const toolDisplayNames = {
    'results': 'Summary',
    'chat': 'AI Assistant',
    'video': 'Visuals',
    'upload': 'Upload',
    'dashboard': 'Home'
  };

  const displayName = toolDisplayNames[currentTool] || currentTool;

  return (
    <header className="h-16 flex items-center justify-center sticky top-0 z-40">
      <div className="glass px-6 py-2 rounded-full flex items-center gap-8 shadow-2xl border border-white/10 max-w-4xl w-full justify-between mx-auto">
        {/* Left: Branding/Location */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/20 rounded-full">
            <Wand2 size={16} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">Explainify</span>
            <span className="text-xs font-bold text-white tracking-tight">{displayName}</span>
          </div>
        </div>

        {/* Middle: Search (Pill within Pill) */}
        <div className="flex-1 max-w-md relative group hidden md:block">
           <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
           <input 
              type="text" 
              placeholder="Query specialized knowledge..." 
              className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-[11px] font-medium text-white focus:outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-gray-600"
           />
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-4">
           <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-green-500">System Live</span>
           </div>

           <button className="p-2 transition-all text-gray-400 hover:text-white relative">
              <Bell size={18} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
           </button>
        </div>
      </div>
    </header>
  );
}
