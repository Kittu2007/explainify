"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { Play, Pause, RotateCcw, Video, Volume2, Settings, Share2, Loader2, Sparkles, BarChart2, Activity, ChevronRight, ChevronLeft, AlertCircle, Layers, Zap, Clock } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import VisualScene from '../components/VisualScene'

export default function VideoLearning() {
  const { document, documentId } = useDocument()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [scenes, setScenes] = useState([])
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [error, setError] = useState(null)
  const [synthesizedCount, setSynthesizedCount] = useState(0)
  const [audioSynthesizedCount, setAudioSynthesizedCount] = useState(0)
  const audioRef = useRef(null)
  
  useEffect(() => {
    if (!document) {
      router.push('/dashboard/upload')
    } else if (documentId && scenes.length === 0) {
      generateVideoContent()
    }
  }, [document, documentId, router])

  const isSynthesizingVideoRef = useRef(false);
  const isSynthesizingAudioRef = useRef(false);

  // EFFECT: Lazy-load video clips for each scene
  useEffect(() => {
    if (scenes.length > 0 && !isSynthesizingVideoRef.current) {
      const synthesizeVideos = async () => {
        isSynthesizingVideoRef.current = true;
        try {
          for (let i = 0; i < scenes.length; i++) {
            if (!scenes[i].videoUrl && !scenes[i].error) {
              let attempt = 0;
              let success = false;
              
              while (attempt < 2 && !success) {
                try {
                  const res = await fetch('/api/video-synthesize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: scenes[i].video_prompt })
                  });
                  
                  if (res.ok) {
                    const { videoUrl } = await res.json();
                    setScenes(prev => {
                      const updated = [...prev];
                      updated[i] = { ...updated[i], videoUrl, error: false };
                      return updated;
                    });
                    setSynthesizedCount(prev => prev + 1);
                    success = true;
                  } else {
                    throw new Error("Video synth failed");
                  }
                } catch (err) {
                  console.error(`Video failed for scene ${i}`, err);
                }
                if (!success) attempt++;
              }
            }
          }
        } finally {
          isSynthesizingVideoRef.current = false;
        }
      };
      synthesizeVideos();
    }
  }, [scenes.length]);

  // EFFECT: Lazy-load audio narration for each scene
  useEffect(() => {
    if (scenes.length > 0 && !isSynthesizingAudioRef.current) {
      const synthesizeAudio = async () => {
        isSynthesizingAudioRef.current = true;
        try {
          for (let i = 0; i < scenes.length; i++) {
            if (!scenes[i].audioUrl && !scenes[i].error) {
              try {
                const res = await fetch('/api/audio-synthesize', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: scenes[i].narration })
                });
                
                if (res.ok) {
                  const { audioUrl } = await res.json();
                  setScenes(prev => {
                    const updated = [...prev];
                    updated[i] = { ...updated[i], audioUrl };
                    return updated;
                  });
                  setAudioSynthesizedCount(prev => prev + 1);
                }
              } catch (err) {
                console.error(`Audio failed for scene ${i}`, err);
              }
            }
          }
        } finally {
          isSynthesizingAudioRef.current = false;
        }
      };
      synthesizeAudio();
    }
  }, [scenes.length]);

  const generateVideoContent = async () => {
    setLoading(true)
    setError(null)
    setSynthesizedCount(0)
    try {
      const response = await fetch('/api/video-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId,
          topic: document?.name || 'Explain this document'
        })
      })
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate visual script')
      }
      
      const data = await response.json()
      const scriptScenes = data.script?.scenes || data.scenes || []
      setScenes(scriptScenes)
    } catch (err) {
      console.error('Video generation failed:', err)
      setError(err.message || 'Failed to generate AI visual explanation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // EFFECT: Master Playback Controller (Virtual Heartbeat)
  useEffect(() => {
    let interval;
    if (isPlaying && scenes.length > 0) {
      interval = setInterval(() => {
        const audio = audioRef.current;
        const isAudioPlaying = audio && !audio.paused && !audio.ended && audio.currentTime > 0;
        
        if (isAudioPlaying && audio.duration) {
          // 1. Sync progress exactly with active audio
          const baseProgress = (currentSceneIndex / scenes.length) * 100;
          const segmentProgress = (audio.currentTime / audio.duration) * (100 / scenes.length);
          setProgress(Math.min(baseProgress + segmentProgress, 99.9)); // Cap just below 100 until logic finishes
        } else {
          // 2. Fallback: Advance virtual time slowly (assume 15s per scene if no audio)
          const fallbackStep = (100 / (scenes.length * 15)) * 0.2; // 0.2s steps
          setProgress(prev => {
            const next = prev + fallbackStep;
            if (next >= 100) return 100;
            
            // Auto-advance scene if we hit a boundary in virtual time
            const nextSceneIndex = Math.floor((next / 100) * scenes.length);
            if (nextSceneIndex !== currentSceneIndex && nextSceneIndex < scenes.length) {
              setCurrentSceneIndex(nextSceneIndex);
            }
            return next;
          });
        }
      }, 200); // 200ms heartbeat is plenty for UI
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length, currentSceneIndex]);

  useEffect(() => {
    if (isPlaying && scenes[currentSceneIndex]?.audioUrl) {
      if (audioRef.current) {
        // More robust src check
        const targetSrc = scenes[currentSceneIndex].audioUrl;
        if (audioRef.current.getAttribute('data-src') !== targetSrc) {
          audioRef.current.src = targetSrc;
          audioRef.current.setAttribute('data-src', targetSrc);
          audioRef.current.load();
        }
        
        audioRef.current.play().catch(e => {
          console.warn("Autoplay blocked or audio error:", e);
        });
      }
    } else if (!isPlaying) {
      audioRef.current?.pause();
    }
  }, [currentSceneIndex, isPlaying, scenes[currentSceneIndex]?.audioUrl]);

  const handleRestart = () => {
    setProgress(0)
    setIsPlaying(false)
    setCurrentSceneIndex(0)
    if (audioRef.current) audioRef.current.currentTime = 0;
  }

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    const sceneIndex = Math.floor((val / 100) * scenes.length);
    if (sceneIndex < scenes.length) setCurrentSceneIndex(sceneIndex);
  };

  if (!document || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <div className="relative w-32 h-32 border-2 border-primary/20 rounded-full flex items-center justify-center">
             <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
             </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase italic">Neural Synthesis</h2>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">
             Generating script & narration via OpenAI...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bento-card max-w-md text-center border-red-500/20 bg-black/40 backdrop-blur-3xl">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500/50 mb-8" />
          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Synthesis Interrupted</h2>
          <p className="text-white/40 mb-10 text-xs font-medium uppercase tracking-widest">{error}</p>
          <button onClick={generateVideoContent} className="gooey-button w-full py-4 tracking-widest">Retry Synthesis</button>
        </div>
      </div>
    )
  }

  const currentScene = scenes[currentSceneIndex] || { narration: "Initializing neural stream...", title: "System Ready" };

  return (
    <div className="space-y-12 animate-fade-in p-4 max-w-7xl mx-auto">
      <audio 
        ref={audioRef} 
        onEnded={() => {
          if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
            setProgress(100);
          }
        }}
      />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-2 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit border border-primary/20">
             <Sparkles size={12} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">Visual Synthesis Mode</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter truncate max-w-full">
            {document?.name || 'Simulation Unit'}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 shrink-0">
          <button 
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert("Share link copied to clipboard!");
            }}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-primary/40 bg-primary/5 text-primary-foreground font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(230,41,255,0.2)]"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button 
            onClick={() => generateVideoContent()}
            className="flex-1 md:flex-none gooey-button flex items-center justify-center gap-2 px-4 md:px-8 py-2 md:py-3"
          >
            <RotateCcw className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            <span className="text-[10px] md:text-sm">Re-Synthesize</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stage Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 bg-black">
             {/* Visual Scene Content */}
             <div className="absolute inset-0 z-0">
                <VisualScene scene={currentScene} />
             </div>
 
             {/* Play/Pause Overlay */}
             <div 
               className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
               onClick={() => setIsPlaying(!isPlaying)}
             >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-2xl transform hover:scale-110 active:scale-95 transition-all">
                  {isPlaying ? (
                    <Pause className="text-white w-8 h-8 md:w-10 md:h-10" fill="white" />
                  ) : (
                    <Play className="text-white ml-1 w-8 h-8 md:w-10 md:h-10" fill="white" />
                  )}
                </div>
             </div>
          </div>

          {/* New Narration Section */}
          <div className="magic-bento p-6 md:p-10 bg-[#050505]/60 backdrop-blur-3xl border-white/5 animate-fade-in min-h-[100px] md:min-h-[140px] flex flex-col justify-center rounded-[1.5rem] md:rounded-[3rem]">
             <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Layers className="text-primary w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em]">Segment {currentSceneIndex + 1} Synthesis</span>
             </div>
             <p className="text-lg md:text-2xl font-bold text-white leading-tight opacity-90 italic">
                "{currentScene.narration || ''}"
             </p>
          </div>

          {/* Controller Hub */}
          <div className="magic-bento p-6 md:p-10 border-white/5 space-y-6 md:space-y-8 rounded-[1.5rem] md:rounded-[3rem]">
             <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <div className="flex items-center gap-2 md:gap-3">
                      <div className="px-2 md:px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Seg. {currentSceneIndex + 1}</div>
                      <span className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                         Narration Active
                      </span>
                   </div>
                   <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">{progress.toFixed(0)}%</span>
                </div>
                
                <div className="relative h-1.5 md:h-2 flex items-center">
                   <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-full bg-white/5 rounded-full appearance-none cursor-pointer accent-primary z-10"
                  />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-full pointer-events-none shadow-[0_0_20px_rgba(230,41,255,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
             </div>
 
             <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4 md:gap-8">
                    <button onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))} className="p-2 md:p-3 text-gray-500 hover:text-white transition-colors">
                       <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 md:w-16 md:h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                       {isPlaying ? <Pause className="w-6 h-6 md:w-7 md:h-7" fill="black" /> : <Play className="w-6 h-6 md:w-7 md:h-7 ml-1" fill="black" />}
                    </button>
                    <button onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))} className="p-2 md:p-3 text-gray-500 hover:text-white transition-colors">
                       <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
                    </button>
                 </div>
 
                   <div className="flex items-center gap-3 md:gap-6">
                      <div className="px-3 md:px-6 py-2 md:py-3 glass rounded-xl md:rounded-2xl border-white/10 flex items-center gap-2 md:gap-3">
                         <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${scenes[currentSceneIndex]?.audioUrl ? 'bg-primary' : 'bg-gray-600'}`} />
                         <Volume2 className={scenes[currentSceneIndex]?.audioUrl ? "text-primary transition-all scale-125 animate-pulse" : "text-gray-600"} size={16} />
                         <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">{currentScene.scene_type || 'neural'} mode</span>
                      </div>
                      <button onClick={handleRestart} className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all">
                         <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                   </div>
             </div>
          </div>
        </div>

        {/* Sidebar Scene Navigator & Progress Center */}
        <div className="lg:col-span-4 space-y-6">
           {/* Synthesis Hub */}
           <div className="magic-bento p-6 md:p-10 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-[1.5rem] md:rounded-[3rem]">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 md:p-3 bg-primary/20 rounded-xl md:rounded-2xl border border-primary/30">
                    <Activity className="text-primary w-5 h-5 md:w-6 md:h-6" />
                 </div>
                  <div>
                    <h3 className="font-black text-sm md:text-lg text-white leading-tight mb-0.5">Neural Synthesis Center</h3>
                    <div className="flex items-center gap-1.5 font-black text-[9px] uppercase tracking-[0.2em]">
                       <span className="text-secondary animate-pulse">●</span>
                       <span className="text-primary opacity-90">NVIDIA NIM SD3 ACTIVE</span>
                    </div>
                  </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Figure Buffering</span>
                    <span className="text-[9px] font-black text-primary ml-auto">{synthesizedCount} / {scenes.length} Figures</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(230,41,255,0.5)]"
                      style={{ width: `${(synthesizedCount / scenes.length) * 100}%` }}
                    />
                 </div>
              </div>

              <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                 <div className="flex gap-4 items-start">
                    <AlertCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                    <p className="text-[10px] font-medium text-white/50 leading-relaxed italic">
                       <span className="text-primary font-black uppercase not-italic">Note:</span> Neural Figures take significant computation. Figure segments will appear sequentially as they are synthesized. You can start listening to the narration now.
                    </p>
                 </div>
              </div>

              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-white/40">Visual Processor Units</p>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic">Textbook Engine</h2>
              
              <div className="flex items-center justify-around mb-8 p-4 bg-white/[0.03] rounded-3xl border border-white/5 backdrop-blur-3xl">
                 <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full border-2 ${audioSynthesizedCount === scenes.length ? 'border-primary bg-primary/20' : 'border-white/10 animate-pulse'} flex items-center justify-center`}>
                      <Activity className={audioSynthesizedCount === scenes.length ? "text-primary" : "text-gray-600"} size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500">Audio {audioSynthesizedCount}/{scenes.length}</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full border-2 ${synthesizedCount === scenes.length ? 'border-primary bg-primary/20' : 'border-white/10 animate-pulse'} flex items-center justify-center`}>
                      <Layers className={synthesizedCount === scenes.length ? "text-primary" : "text-gray-600"} size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500">Visuals {synthesizedCount}/{scenes.length}</span>
                 </div>
              </div>

              {scenes.some(s => s.errorType === 'CREDITS') && (
                <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-start gap-4 text-left max-w-md mx-auto animate-bounce-subtle">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">API Credit Shortfall</p>
                    <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase">
                      Your OpenRouter or ByteZ balance is depleted. Please refuel your API accounts to resume high-precision figure synthesis.
                    </p>
                  </div>
                </div>
              )}

              {scenes.some(s => s.errorType === 'RATE_LIMIT') && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-start gap-4 text-left max-w-md mx-auto animate-pulse">
                  <Clock size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">Rate Limit Active</p>
                    <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase">
                      The AI Engine is currently busy. The system will automatically resume synthesis in 60 seconds once the quota resets.
                    </p>
                  </div>
                </div>
              )}
           </div>

           <div className="magic-bento p-6 md:p-8 border-white/5 h-[350px] md:h-[450px] flex flex-col rounded-[1.5rem] md:rounded-[3.5rem]">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                 <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-2.5 bg-white/5 rounded-xl border border-white/10">
                       <Layers className="text-primary w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h3 className="font-black text-lg md:text-xl text-white tracking-tight">Timeline</h3>
                 </div>
                 <span className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">{scenes.length} Nodes</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {scenes.map((scene, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                       setCurrentSceneIndex(idx);
                       setProgress((idx / scenes.length) * 100);
                       setIsPlaying(true);
                    }}
                    className={`w-full p-5 rounded-3xl border-2 text-left transition-all relative group/item overflow-hidden ${
                      currentSceneIndex === idx 
                        ? 'border-primary bg-primary/5 shadow-[inset_0_0_20px_rgba(230,41,255,0.1)]' 
                        : 'border-transparent bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                       <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${currentSceneIndex === idx ? 'bg-primary text-white' : 'bg-white/5 text-gray-600'}`}>0{idx + 1}</span>
                          {!scene.videoUrl && (
                             <div className="flex items-center gap-2">
                                {scene.error ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${
                                      scene.errorType === 'CREDITS' ? 'bg-orange-500/20 text-orange-500' : 
                                      scene.errorType === 'RATE_LIMIT' ? 'bg-blue-500/20 text-blue-500' :
                                      'bg-red-500/20 text-red-500'
                                    }`}>
                                      {scene.errorType === 'CREDITS' ? 'Refuel Required' : 
                                       scene.errorType === 'RATE_LIMIT' ? 'Rate Limited' :
                                       'Synthesis Halted'}
                                    </span>
                                    {scene.errorMsg && (
                                      <span className="text-[7px] text-gray-500 uppercase font-bold px-1 opacity-60">
                                        {scene.errorMsg.substring(0, 30)}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${idx === currentSceneIndex ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                                    {idx === currentSceneIndex ? 'Active' : scene.videoUrl ? 'Ready' : 'Pending'}
                                  </span>
                                )}
                                <Zap size={10} className={idx === currentSceneIndex ? "text-primary fill-primary" : "text-gray-500"} />
                              </div>
                          )}
                       </div>
                       {currentSceneIndex === idx && <Zap size={12} className="text-primary fill-primary animate-pulse" />}
                    </div>
                    <h4 className={`text-sm font-black mb-1 tracking-tight ${currentSceneIndex === idx ? 'text-white' : 'text-gray-400'}`}>{scene.title || `Segment 0${idx + 1}`}</h4>
                    <p className={`text-[10px] font-medium leading-relaxed line-clamp-2 ${currentSceneIndex === idx ? 'text-primary/70' : 'text-gray-600'}`}>{scene.narration}</p>
                    
                    {currentSceneIndex === idx && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
