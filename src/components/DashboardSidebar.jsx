"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  MessageSquare, 
  Video, 
  Upload, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  const navItems = [
    { label: 'Upload', path: '/dashboard/upload', icon: Upload, color: 'text-blue-400' },
    { label: 'Summary', path: '/dashboard/results', icon: FileText, color: 'text-emerald-400' },
    { label: 'AI Chat', path: '/dashboard/chat', icon: MessageSquare, color: 'text-primary' },
    { label: 'Visuals', path: '/dashboard/video', icon: Video, color: 'text-amber-400' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <aside 
      className={`fixed left-4 top-6 bottom-6 glass rounded-[2.5rem] transition-all duration-500 z-50 flex flex-col shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
          <Zap size={20} className="text-white fill-white" />
        </div>
        {!isCollapsed && (
          <div className="whitespace-nowrap overflow-hidden">
            <h2 className="font-black text-xl tracking-tighter text-white">Explainify</h2>
            <div className="flex items-center gap-1">
               <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
               <span className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-500">Pro Neural</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-4 space-y-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group ${
              isActive(item.path)
                ? 'bg-white/10 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                : 'hover:bg-white/5 border border-transparent hover:border-white/5'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${isActive(item.path) ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
              <item.icon size={18} />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className={`text-sm font-bold tracking-tight ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">
                   {isActive(item.path) ? 'Active Now' : 'Open Tool'}
                </span>
              </div>
            )}

            {isActive(item.path) && (
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full blur-sm" />
            )}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 mt-auto">
        {!isCollapsed && user && (
          <div className="mb-4 p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary/40 to-secondary/40 flex items-center justify-center border border-white/10 shadow-inner">
               <span className="font-black text-xs text-white">{user?.email?.[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-black text-white truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 font-bold truncate">Premium Plan</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={signOut}
            className="flex items-center gap-4 p-4 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}
          </button>
          
          <button 
            onClick={onToggle}
            className="flex items-center justify-center p-3 hover:bg-white/5 rounded-2xl text-gray-600 hover:text-white transition-all border border-transparent hover:border-white/10 mb-2"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ChevronLeft size={16} /> Collapse</div>}
          </button>
        </div>
      </div>
    </aside>
  );
}
