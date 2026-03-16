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

  const { videoUrl, video_prompt } = scene;
  const isImage = videoUrl?.startsWith('data:image/') || videoUrl?.match(/\.(jpeg|jpg|gif|png|svg)$/);
  const isSvg = videoUrl?.includes('image/svg+xml');

  return (
    <div className="w-full h-full flex flex-col relative bg-[#020202] overflow-hidden group">
      {videoUrl ? (
        <div className="absolute inset-0 animate-fade-in group">
          {isImage ? (
            <div className={`w-full h-full flex items-center justify-center p-4 ${isSvg ? 'bg-[#050505]' : ''}`}>
              <img 
                src={videoUrl}
                className={`${isSvg ? 'w-full h-full object-contain' : 'w-full h-full object-cover'} opacity-80 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-[1.02]`}
                alt={video_prompt}
              />
              {isSvg && (
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]" />
              )}
            </div>
          ) : (
            <video 
              src={videoUrl}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
              autoPlay
              loop
              muted
              playsInline
              key={videoUrl}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-12 bg-gradient-to-b from-[#050505] to-black">
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
              <div className="relative p-6 bg-white/[0.02] rounded-3xl border border-white/5 animate-bounce-slow">
                 <Activity className="text-primary" size={64} />
              </div>
           </div>
           <div className="text-center space-y-2">
              <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em] animate-pulse">
                {video_prompt ? 'Synthesizing Visuals' : 'Queueing Stream'}
              </p>
              {video_prompt && (
                <p className="text-white/10 text-[8px] max-w-xs mx-auto text-center italic tracking-wider leading-relaxed">
                  {video_prompt}
                </p>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
