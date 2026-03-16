/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Plus, MessageSquare, History, Zap, Settings, LogOut, X, ChevronRight } from 'lucide-react';

export const StaggeredMenu = ({
  position = 'left',
  colors = ['#2E073F', '#7A1CAC'],
  items = [],
  onNewChat,
  onSignOut,
  user
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      if (!panel) return;
      
      const offscreen = position === 'left' ? -100 : 100;
      gsap.set(panel, { xPercent: offscreen });
      gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
    });
    return () => ctx.revert();
  }, [position]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.6, ease: 'power4.out' });
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.4 });
    } else {
      const offscreen = position === 'left' ? -100 : 100;
      gsap.to(panelRef.current, { xPercent: offscreen, duration: 0.5, ease: 'power3.inOut' });
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
    }
  }, [position]);

  return (
    <div className="sm-scope fixed inset-0 z-50 pointer-events-none">
      {/* Background Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity pointer-events-none"
        onClick={toggleMenu}
      />

      {/* Floating Toggle Button */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <button
          ref={triggerRef}
          onClick={toggleMenu}
          className="flex items-center gap-3 glass px-5 py-3 rounded-full border border-white/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95 group shadow-2xl"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {open ? (
              <X size={20} className="text-primary animate-in spin-in-90 duration-300" />
            ) : (
              <History size={20} className="text-primary animate-in zoom-in duration-300" />
            )}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#EBD3F8] group-hover:text-white transition-colors">
            {open ? 'Close' : 'History'}
          </span>
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside 
        ref={panelRef} 
        className="staggered-menu-panel absolute top-0 left-0 h-full bg-[#1e0529] border-r border-white/10 flex flex-col w-[380px] pointer-events-auto shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Panel Header */}
        <div className="p-10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(122,28,172,0.4)]">
                 <Zap size={22} className="text-white fill-white" />
              </div>
              <div>
                 <h2 className="font-black text-xl text-white tracking-tighter leading-none">Explainify</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Neural Node 01</p>
              </div>
           </div>
           <button onClick={toggleMenu} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Action Button */}
        <div className="px-10 mb-8">
          <button
            onClick={() => { onNewChat?.(); setOpen(false); openRef.current = false; toggleMenu(); }}
            className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.15em] text-xs shadow-[0_10px_30px_rgba(122,28,172,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={20} />
            <span>New Neural Thread</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="px-4 mb-4 flex items-center gap-2">
             <div className="w-1 h-1 bg-primary rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">History Records</span>
          </div>

          <div className="space-y-2">
            {items.length > 0 ? items.map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-4 p-5 rounded-3xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group group-hover:translate-x-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                   <MessageSquare size={18} className="text-gray-500 group-hover:text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                   <p className="text-sm font-bold text-white truncate mb-1 group-hover:text-primary transition-colors">{item.label}</p>
                   <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{item.date}</p>
                </div>
                <ChevronRight size={14} className="text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                 <History size={48} className="mb-4" />
                 <p className="text-xs font-black uppercase tracking-widest text-white">No local history clusters found</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 mb-6">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center border border-white/10 shadow-lg">
                <span className="font-extrabold text-white">{user?.email?.[0].toUpperCase() || '?'}</span>
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{user?.email?.split('@')[0] || 'Neural Pilot'}</p>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified Pro</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 text-[10px] font-black uppercase tracking-widest">
                <Settings size={16} />
                <span>Settings</span>
             </button>
             <button 
               onClick={onSignOut}
               className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-all border border-red-500/10 text-[10px] font-black uppercase tracking-widest"
             >
                <LogOut size={16} />
                <span>Terminate</span>
             </button>
          </div>
        </div>
      </aside>

      <style>{`
        .sm-scope .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(122, 28, 172, 0.2); border-radius: 10px; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(122, 28, 172, 0.4); }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
