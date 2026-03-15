"use client";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Play, Pause, RotateCcw, Video, Volume2, Settings, Share2, Loader2, Sparkles } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'

export default function VideoLearning() {
  const { document, documentId } = useDocument()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [scenes, setScenes] = useState([])
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [error, setError] = useState(null)
  
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
        throw new Error(errData.error || 'Failed to generate video script')
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

  // Linear progression simulation
  useEffect(() => {
    let interval;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 0.5;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          
          // Update scene index based on progress
          if (scenes.length > 0) {
            const calculatedScene = Math.floor((next / 100) * scenes.length);
            if (calculatedScene < scenes.length) {
                setCurrentSceneIndex(calculatedScene);
            }
          }
          
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, scenes.length]);

  const handleRestart = () => {
    setProgress(0)
    setIsPlaying(false)
    setCurrentSceneIndex(0)
  }

  if (!document || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-xl text-gray-600">Creating your visual learning experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md text-center">
            <Video className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Generation Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={generateVideoContent} className="btn-primary w-full">Retry</button>
          </div>
        </div>
      )
  }

  const currentScene = scenes[currentSceneIndex] || { narration: "Initializing visual learning...", visual: "Abstract background" };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Visual Teacher
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Visualizing: <span className="font-semibold">{document.name}</span>
            </p>
          </div>
          <button 
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert('Lesson link copied to clipboard!');
            }}
            className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 size={18} />
            <span className="text-sm font-medium">Share Lesson</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-3">
            <div 
              className="relative aspect-video bg-dark rounded-3xl overflow-hidden shadow-2xl group border-4 border-white cursor-pointer"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {/* This would be the actual canvas/video component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12">
                   {/* Animated Background Placeholder */}
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" />
                   
                   <div className="relative z-10 transition-all duration-700 transform">
                      <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                        {currentScene.visual || currentScene.visualPrompt || 'Visual Learning'}
                      </h2>
                      <div className="w-32 h-1 bg-primary mx-auto rounded-full" />
                   </div>
                </div>
              </div>

              {/* Narrator Overlay */}
              <div className="absolute bottom-20 left-10 right-10 z-20">
                 <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white text-lg font-medium text-center shadow-xl">
                     "{currentScene.narration || currentScene.script || ''}"
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
                <div 
                  className="h-full bg-primary transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Hover Controls */}
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={handleRestart}
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                >
                  <RotateCcw className="text-white" size={28} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-6 bg-primary hover:bg-secondary rounded-full transform hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? <Pause className="text-white" size={40} /> : <Play className="text-white ml-2" size={40} />}
                </button>
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                  <Volume2 className="text-white" size={28} />
                </div>
              </div>
            </div>

            {/* Video Meta */}
            <div className="mt-8 flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Video className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-dark">Visual Explanation Lesson</h3>
                  <p className="text-xs text-gray-500">Duration: 45 seconds • 1080p AI Generated</p>
                </div>
              </div>
               <div className="flex gap-2">
                <button 
                  onClick={() => alert('Visual settings coming soon!')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Lesson Plan */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Video size={18} className="text-primary" />
                Lesson Scenes
              </h3>
              <div className="space-y-3">
                {scenes.map((scene, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                      currentSceneIndex === idx 
                        ? 'border-primary bg-primary/5 font-semibold text-primary' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                        setCurrentSceneIndex(idx);
                        setProgress((idx / scenes.length) * 100);
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span>Scene {idx + 1}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">0:0{idx * 4}</span>
                    </div>
                    <p className={`line-clamp-2 ${currentSceneIndex === idx ? 'text-primary' : 'text-gray-500'}`}>
                      {scene.visual || scene.visualPrompt || `Scene ${idx + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

             <div className="card bg-gradient-to-br from-primary to-secondary text-white border-none">
              <h3 className="font-bold mb-2">Want a custom lesson?</h3>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">Adjust the teaching tone or focus on specific chapters of your document.</p>
              <button 
                onClick={() => alert('Customization feature coming soon!')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-all"
              >
                Customize AI Output
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
