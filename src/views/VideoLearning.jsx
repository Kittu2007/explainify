"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { Play, Pause, RotateCcw, Video, Volume2, Settings, Share2, Loader2, Sparkles, BarChart2, Activity, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react'
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
      router.push('/upload')
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
      // API returns { script: { scenes: [...] } }
      const scriptScenes = data.script?.scenes || data.scenes || []
      setScenes(scriptScenes)
    } catch (err) {
      console.error('Video generation failed:', err)
      setError(err.message || 'Failed to generate AI visual explanation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Audio Sync & Scene Auto-play
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

  // Linear progression simulation
  useEffect(() => {
    let interval;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 0.2; // Slower, precision progress
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          
          // Update scene index based on progress
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
             <Loader2 className="relative mx-auto h-16 w-16 text-primary animate-spin" />
          </div>
          <p className="mt-6 text-xl font-bold text-dark">Building Your Visual Learning Plan...</p>
          <p className="text-gray-500 text-sm mt-2">Extracting concepts and rendering graphical scenes</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="card max-w-md text-center border-t-4 border-red-500">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Generation Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={generateVideoContent} className="btn-primary w-full shadow-lg shadow-primary/20">Retry Generation</button>
          </div>
        </div>
      )
  }

  const currentScene = scenes[currentSceneIndex] || { narration: "Initializing visual learning...", scene_type: 'icon_infographic' };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <audio ref={audioRef} onEnded={() => {
        // Optional: advance scene slightly faster if audio ends? 
        // For now, let the progress interval handle it.
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-primary/10 p-2 rounded-lg">
                  <Sparkles className="text-primary" size={20} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-primary/60">AI Concept Visualizer</span>
            </div>
            <h1 className="text-4xl font-black text-dark tracking-tight">
              Visual Learning Engine
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Deep analysis of: <span className="font-bold text-dark">{document.name}</span>
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Lesson link copied to clipboard!');
                }}
                className="btn-outline border-primary/20 bg-white shadow-sm flex items-center gap-2 px-6 py-2.5"
             >
                <Share2 size={18} />
                <span>Share Lesson</span>
             </button>
             <button 
                onClick={() => generateVideoContent()}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-xl shadow-primary/20"
             >
                <RotateCcw size={18} />
                <span>Regenerate</span>
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Stage */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div 
              className="relative aspect-video bg-[#0f172a] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group border-[12px] border-white ring-1 ring-gray-200"
            >
              {/* Visual Scene Content */}
              <div className="absolute inset-0">
                 <VisualScene scene={currentScene} />
              </div>

              {/* Narrator Subtitles Overlay */}
              <div className="absolute bottom-12 left-12 right-12 z-20 pointer-events-none">
                 <div className="bg-dark/60 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] text-white text-xl font-medium text-center shadow-2xl animate-fade-in ring-1 ring-white/20">
                    <span className="opacity-80 leading-relaxed italic">
                      "{currentScene.narration || ''}"
                    </span>
                 </div>
              </div>

              {/* Interaction Layer */}
              <div 
                className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center bg-dark/20 backdrop-blur-[2px]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <button 
                  className="p-10 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-3xl transform hover:scale-110 active:scale-95 transition-all border border-white/30 shadow-2xl"
                >
                  {isPlaying ? <Pause className="text-white" size={64} fill="white" /> : <Play className="text-white ml-2" size={64} fill="white" />}
                </button>
              </div>
            </div>

            {/* Premium Controls */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6">
               {/* Scrubber */}
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                     <span>{(progress * (scenes.length * 15) / 100).toFixed(0)}s</span>
                     <span>{(scenes.length * 15)}s</span>
                  </div>
                  <div className="relative group h-6 flex items-center">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary group-hover:h-2 transition-all"
                    />
                    <div 
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full pointer-events-none transition-all group-hover:h-2"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <ChevronLeft size={24} className="text-gray-400" />
                     </button>
                     <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
                        {isPlaying ? <Pause className="text-white" size={24} fill="white" /> : <Play className="text-white ml-1" size={24} fill="white" />}
                     </button>
                     <button onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <ChevronRight size={24} className="text-gray-400" />
                     </button>
                  </div>

                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <Activity size={16} className="text-secondary" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{currentScene.scene_type}</span>
                     </div>
                     <button className="p-3 hover:bg-gray-50 rounded-xl border border-gray-200">
                        <Settings size={20} className="text-gray-400" />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-[600px]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Layers size={20} className="text-primary" />
                    Scene Map
                  </h3>
                  <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full border border-primary/10 tracking-widest">{scenes.length} SCENES</span>
               </div>

               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                 {scenes.map((scene, idx) => (
                   <button 
                     key={idx}
                     onClick={() => {
                        setCurrentSceneIndex(idx);
                        setProgress((idx / scenes.length) * 100);
                        setIsPlaying(true);
                     }}
                     className={`group p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                       currentSceneIndex === idx 
                         ? 'border-primary bg-primary/5 shadow-inner' 
                         : 'border-transparent bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-xl'
                     }`}
                   >
                     {currentSceneIndex === idx && (
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary rounded-full animate-grow-height" />
                     )}
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black tracking-widest uppercase ${currentSceneIndex === idx ? 'text-primary' : 'text-gray-400'}`}>SCENE {idx + 1}</span>
                        <div className={`p-1 rounded-md ${currentSceneIndex === idx ? 'bg-primary/20' : 'bg-gray-200'}`}>
                           <Activity size={10} className={currentSceneIndex === idx ? 'text-primary' : 'text-gray-400'} />
                        </div>
                     </div>
                     <h4 className={`text-sm font-bold mb-1 leading-tight ${currentSceneIndex === idx ? 'text-dark' : 'text-gray-600'}`}>{scene.title || `Concept ${idx + 1}`}</h4>
                     <p className={`text-[10px] leading-relaxed line-clamp-2 ${currentSceneIndex === idx ? 'text-primary/70' : 'text-gray-400 font-medium'}`}>{scene.narration}</p>
                     
                     <div className={`mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${currentSceneIndex === idx ? 'opacity-100' : ''}`}>
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                           <div className={`h-full bg-primary transition-all duration-300 ${currentSceneIndex === idx ? 'w-full' : 'w-0'}`} />
                        </div>
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-dark rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Sparkles size={80} />
               </div>
               <h4 className="text-xl font-bold mb-4 relative z-10">Graphical Learning</h4>
               <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10 opacity-80">
                  Visual concepts are 3x more likely to be retained than text slides. Focus on the diagrams and narration.
               </p>
               <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md">
                  Download Script PDF
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
