"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { Play, Pause, RotateCcw, Video, Volume2, Settings, Share2, Loader2, Sparkles, BarChart2, Activity, ChevronRight, ChevronLeft, AlertCircle, Layers, Zap } from 'lucide-react'
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
  const audioRef = useRef(null)
  
  useEffect(() => {
    if (!document) {
      router.push('/dashboard/upload')
    } else if (documentId && scenes.length === 0) {
      generateVideoContent()
    }
  }, [document, documentId, router])

  const generateVideoContent = async () => {
    setLoading(true)
    setError(null)
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

  useEffect(() => {
    if (isPlaying && scenes[currentSceneIndex]?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = scenes[currentSceneIndex].audioUrl;
        audioRef.current.play().catch(e => console.warn("Audio play blocked:", e));
      }
    } else {
      audioRef.current?.pause();
    }
  }, [currentSceneIndex, isPlaying, scenes]);

  useEffect(() => {
    let interval;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 0.2; 
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          
          if (scenes.length > 0) {
            const sceneIndex = Math.floor((next / 100) * scenes.length);
            if (sceneIndex !== currentSceneIndex && sceneIndex < scenes.length) {
              setCurrentSceneIndex(sceneIndex);
            }
          }
          
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, scenes.length, currentSceneIndex]);

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
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
          <div className="relative w-24 h-24 border-2 border-primary/20 rounded-full flex items-center justify-center">
             <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
             <Video className="absolute text-primary" size={24} />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tighter">Conceptualizing Space</h2>
          <p className="text-gray-500 font-medium">Synthesizing visual representations from document semantics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bento-card max-w-md text-center border-red-500/20">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">Render Failed</h2>
          <p className="text-gray-500 mb-8 text-sm">{error}</p>
          <button onClick={generateVideoContent} className="gooey-button w-full">Re-Initialize Session</button>
        </div>
      </div>
    )
  }

  const currentScene = scenes[currentSceneIndex] || { narration: "Initializing visual learning...", scene_type: 'icon_infographic' };

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <audio ref={audioRef} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit border border-primary/20">
             <Sparkles size={12} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">Visual Synthesis Mode</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter truncate max-w-2xl">
            {document?.name || 'Simulation Unit'}
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
            }}
            className="px-6 py-3 rounded-full border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Share2 size={18} />
            <span>Secure Link</span>
          </button>
          <button 
            onClick={() => generateVideoContent()}
            className="gooey-button flex items-center gap-2"
          >
            <RotateCcw size={18} />
            <span>Re-Synthesize</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stage Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 bg-[#050505]">
             {/* Visual Scene Content */}
             <div className="absolute inset-0 z-0">
                <VisualScene scene={currentScene} />
             </div>

             {/* Subtitles Overlay */}
             <div className="absolute bottom-10 left-10 right-10 z-20 pointer-events-none">
                <div className="px-8 py-5 rounded-[2rem] bg-black/4 backdrop-blur-3xl border border-white/5 text-white text-lg font-bold text-center animate-fade-in shadow-2xl">
                   <div className="text-primary/50 text-[10px] uppercase font-black tracking-widest mb-1">Narration Process: {currentSceneIndex + 1}</div>
                   <p className="leading-tight opacity-90 drop-shadow-md">"{currentScene.narration || ''}"</p>
                </div>
             </div>

             {/* Play/Pause Overlay */}
             <div 
               className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center bg-black/20 backdrop-blur-[1px] cursor-pointer"
               onClick={() => setIsPlaying(!isPlaying)}
             >
               <div className="w-24 h-24 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-2xl transform hover:scale-110 active:scale-95 transition-all">
                 {isPlaying ? <Pause className="text-white" size={40} fill="white" /> : <Play className="text-white ml-2" size={40} fill="white" />}
               </div>
             </div>
          </div>

          {/* Controller Hub */}
          <div className="bento-card p-10 border-white/5 space-y-8">
             <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Live Process</div>
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                         {((progress / 100) * (scenes.length * 15)).toFixed(1)}s / {(scenes.length * 15)}s
                      </span>
                   </div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{progress.toFixed(0)}%</span>
                </div>
                
                <div className="relative h-2 flex items-center">
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

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                   <button onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))} className="p-3 text-gray-500 hover:text-white transition-colors">
                      <ChevronLeft size={28} strokeWidth={3} />
                   </button>
                   <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                   </button>
                   <button onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))} className="p-3 text-gray-500 hover:text-white transition-colors">
                      <ChevronRight size={28} strokeWidth={3} />
                   </button>
                </div>

                <div className="flex items-center gap-6">
                   <div className="px-6 py-3 glass rounded-2xl border-white/10 flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentScene.scene_type} engine active</span>
                   </div>
                   <button onClick={handleRestart} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all">
                      <RotateCcw size={20} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Scene Navigator */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bento-card p-8 border-white/5 h-[650px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                       <Layers className="text-primary" size={20} />
                    </div>
                    <h3 className="font-black text-xl text-white tracking-tight">Timeline</h3>
                 </div>
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{scenes.length} Nodes</span>
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
                       <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${currentSceneIndex === idx ? 'bg-primary text-white' : 'bg-white/5 text-gray-600'}`}>0{idx + 1}</span>
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

           <div className="bento-card p-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent border-primary/20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                 <div className="absolute inset-0 bg-primary blur-3xl opacity-20" />
                 <Sparkles className="relative text-primary" size={48} />
              </div>
              <h4 className="text-xl font-black text-white mb-2">Immersive Learning</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">
                 AI-driven visuals significantly increase comprehension and recall of complex document structures.
              </p>
              <button className="w-full py-4 glass rounded-3xl text-[10px] font-black uppercase tracking-widest text-white border-white/10 hover:bg-white/5 transition-all">
                 Generate Briefing PDF
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
