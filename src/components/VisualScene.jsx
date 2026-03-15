"use client";
import React from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  BarChart2, 
  Activity, 
  Clock, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

/**
 * VisualScene - Dynamically renders concept-driven graphical scenes.
 */
export default function VisualScene({ scene }) {
  if (!scene) return null;

  const { scene_type, title, visual_elements = [], animation } = scene;

  // Render different layouts based on scene_type
  const renderGraphic = () => {
    switch (scene_type) {
      case 'comparison':
        return (
          <div className="flex items-center justify-around w-full h-full p-8 animate-fade-in">
            {visual_elements.slice(0, 2).map((el, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-1/3 transform hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  {idx === 0 ? <Zap className="text-primary" /> : <Layers className="text-secondary" />}
                </div>
                <p className="text-white font-bold text-center">{String(el)}</p>
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <div className="bg-primary px-4 py-1 rounded-full text-[10px] uppercase font-black text-white shadow-xl">VS</div>
            </div>
          </div>
        );

      case 'flowchart':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
            {visual_elements.map((el, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl text-white text-sm font-medium animate-slide-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                  {String(el)}
                </div>
                {idx < visual_elements.length - 1 && <ArrowDown className="text-primary/50 animate-pulse" size={20} />}
              </React.Fragment>
            ))}
          </div>
        );

      case 'spectrum_chart':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-12">
            <div className="w-full h-8 bg-gradient-to-r from-red-500 via-green-500 to-violet-500 rounded-full relative shadow-inner overflow-hidden">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            </div>
            <div className="flex justify-between w-full mt-8">
               {visual_elements.map((el, idx) => (
                 <div key={idx} className="text-center animate-fade-in" style={{ animationDelay: `${idx * 0.3}s` }}>
                    <div className={`w-1 h-8 mx-auto mb-2 ${idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`} />
                    <p className="text-[10px] text-white/70 font-mono uppercase tracking-tighter">{String(el)}</p>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'bar_chart':
        return (
          <div className="flex items-end justify-center w-full h-full gap-6 p-12">
            {visual_elements.map((el, idx) => {
              const label = String(el).split(':')[0] || String(el);
              const value = parseInt(String(el).split(':')[1]) || (40 + idx * 15);
              return (
                <div key={idx} className="flex flex-col items-center group">
                  <div 
                    className="w-16 bg-gradient-to-t from-primary/80 to-secondary/80 rounded-t-xl transition-all duration-1000 ease-out animate-grow-height shadow-lg relative"
                    style={{ height: `${value}%`, animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white font-black text-lg opacity-0 group-hover:opacity-100 transition-opacity">{value}%</div>
                  </div>
                  <p className="text-white/60 text-[10px] mt-4 max-w-[80px] text-center leading-tight truncate">{label}</p>
                </div>
              );
            })}
          </div>
        );

      case 'process_diagram':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-64 h-64 border-2 border-dashed border-white/10 rounded-full animate-spin-slow" />
            <div className="grid grid-cols-2 gap-20 relative z-10 w-full px-20">
               {visual_elements.slice(0, 4).map((el, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-dark/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary font-black">{idx + 1}</div>
                    <p className="text-white text-xs font-semibold">{String(el)}</p>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-12">
            <div className="relative w-full h-0.5 bg-white/20 mb-12">
               <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-4">
                  {visual_elements.map((_, idx) => (
                    <div key={idx} className="w-4 h-4 bg-primary rounded-full border-4 border-dark shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-5 gap-4 w-full">
               {visual_elements.map((el, idx) => (
                 <div key={idx} className="text-center animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <p className="text-white/80 text-[10px] font-bold leading-tight">{String(el)}</p>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'icon_infographic':
      default:
        return (
          <div className="flex flex-wrap items-center justify-center w-full h-full gap-8 p-12">
            {visual_elements.map((el, idx) => (
              <div key={idx} className="flex flex-col items-center animate-scale-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl flex items-center justify-center mb-3 border border-white/10 shadow-xl group hover:rotate-6 transition-transform">
                   <Zap className="text-white group-hover:scale-110 transition-transform" size={32} />
                </div>
                <p className="text-white/80 text-[10px] font-medium max-w-[100px] text-center uppercase tracking-widest">{String(el)}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
       <div className="flex-1 relative overflow-hidden">
          {renderGraphic()}
          
          {/* Concept Title Overlay */}
          <div className="absolute top-6 left-8 animate-slide-right">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="text-white/50 text-xs font-black uppercase tracking-[0.2em]">{title || scene_type}</h3>
             </div>
          </div>

          {/* Animation Hint */}
          <div className="absolute bottom-4 right-8 text-[8px] text-white/20 font-mono uppercase tracking-widest">
            {animation || 'Dynamic motion active'}
          </div>
       </div>
    </div>
  );
}
