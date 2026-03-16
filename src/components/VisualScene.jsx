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

  const { videoUrl, title, video_prompt } = scene;

  return (
    <div className="w-full h-full flex flex-col relative bg-black overflow-hidden group">
       <div className="flex-1 relative">
          {videoUrl ? (
            <div className="absolute inset-0 animate-fade-in">
              <video 
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                key={videoUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-12">
               <div className="p-4 bg-primary/10 rounded-2xl animate-pulse">
                  <Activity className="text-primary" size={48} />
               </div>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
                 {video_prompt ? 'Synthesizing Neural Visuals...' : 'Initializing Stream...'}
               </p>
               {video_prompt && (
                 <p className="text-white/20 text-[8px] max-w-xs text-center italic">{video_prompt}</p>
               )}
            </div>
          )}
          
          <div className="absolute top-8 left-10 z-20 animate-slide-right">
             <div className="flex items-center gap-4 bg-black/20 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/5 shadow-2xl">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(230,41,255,0.5)]" />
                <h3 className="text-white text-sm font-black uppercase tracking-[0.2em]">{title || 'Neural Segment'}</h3>
             </div>
          </div>
       </div>
    </div>
  );
}
