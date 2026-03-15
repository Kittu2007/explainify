"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  MessageSquare, 
  Video, 
  Upload, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  const navItems = [
    { label: 'Summary', path: '/dashboard/results', icon: FileText },
    { label: 'AI Chat', path: '/dashboard/chat', icon: MessageSquare },
    { label: 'Visual Learning', path: '/dashboard/video', icon: Video },
    { label: 'New Upload', path: '/dashboard/upload', icon: Upload },
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path) => pathname === path;

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-dark text-white border-r border-gray-800 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-slow">
          <span className="font-black text-xl">E</span>
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in whitespace-nowrap">
            <h2 className="font-bold text-lg leading-tight">Explainify</h2>
            <span className="text-[10px] uppercase font-black tracking-widest text-primary/60">Dashboard</span>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-2">Main Tools</p>
        )}
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group overflow-hidden ${
              isActive(item.path)
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
            {!isCollapsed && <span className="font-medium animate-slide-right">{item.label}</span>}
            {isActive(item.path) && !isCollapsed && (
              <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
          </Link>
        ))}

        <div className="pt-8 space-y-2">
           {!isCollapsed && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-2">Workspace</p>
          )}
          {secondaryItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group overflow-hidden ${
                isActive(item.path)
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0 group-hover:rotate-12 transition-transform" />
              {!isCollapsed && <span className="font-medium animate-slide-right">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 bg-gray-900/50">
        {!isCollapsed && user && (
          <div className="mb-4 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold truncate text-white">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button 
            onClick={signOut}
            className={`flex items-center gap-4 p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full group overflow-hidden`}
          >
            <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
          
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
