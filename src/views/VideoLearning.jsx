"use client";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Play, Pause, Volume2, Maximize, ChevronDown } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'

export default function VideoLearning() {
  const { document } = useDocument()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(0)
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (!document) {
      router.push('/upload')
      return
    }
    
    // Simulate generating videos
    const generatedVideos = [
      {
        id: 1,
        title: 'Introduction to Core Concepts',
        duration: '5:23',
        description: 'Learn the fundamental concepts and foundational knowledge needed to understand the document.',
        thumbnail: '🎓',
        topics: ['Concept 1', 'Concept 2', 'Concept 3']
      },
      {
        id: 2,
        title: 'Understanding Key Principles',
        duration: '7:45',
        description: 'Deep dive into the key principles that form the basis of the document content.',
        thumbnail: '💡',
        topics: ['Principles', 'Application', 'Benefits']
      },
      {
        id: 3,
        title: 'Practical Implementation Guide',
        duration: '6:30',
        description: 'Step-by-step guide on how to apply the concepts in real-world scenarios.',
        thumbnail: '🛠️',
        topics: ['Step 1', 'Step 2', 'Step 3']
      },
      {
        id: 4,
        title: 'Advanced Topics & Analysis',
        duration: '8:15',
        description: 'Explore advanced topics and detailed analysis for deeper understanding.',
        thumbnail: '🚀',
        topics: ['Advanced Concept', 'Analysis', 'Best Practices']
      },
      {
        id: 5,
        title: 'Summary & Key Takeaways',
        duration: '4:32',
        description: 'Quick summary of all important points and key takeaways from the document.',
        thumbnail: '✨',
        topics: ['Summary', 'Checklist', 'Resources']
      }
    ]
    
    setVideos(generatedVideos)
  }, [document, navigate])
  
  if (!document || videos.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Play className="mx-auto text-primary" size={48} />
          </div>
          <p className="text-lg font-semibold">Generating your learning videos...</p>
        </div>
      </div>
    )
  }
  
  const currentVideo = videos[selectedVideo]
  
  return (
    <div className="min-h-[80vh] bg-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Video Learning Paths</h1>
          <p className="text-xl text-gray-600">
            AI-generated video explanations of your document
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden shadow-2xl">
              {/* Video Preview */}
              <div className="relative bg-dark aspect-video flex items-center justify-center group cursor-pointer">
                <div className="text-9xl opacity-20">{currentVideo.thumbnail}</div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform group-hover:bg-secondary"
                >
                  {isPlaying ? (
                    <Pause size={40} className="text-white" />
                  ) : (
                    <Play size={40} className="text-white ml-1" />
                  )}
                </button>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                <p className="text-gray-600 mb-4">{currentVideo.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.floor((progress / 100) * parseInt(currentVideo.duration))} / {currentVideo.duration}
                  </p>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-white rounded-lg transition">
                      <Volume2 size={20} className="text-primary" />
                    </button>
                    <span className="text-sm font-semibold">{currentVideo.duration}</span>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition">
                    <Maximize size={20} className="text-primary" />
                  </button>
                </div>
                
                {/* Topics Covered */}
                <div className="mt-6">
                  <h4 className="font-bold mb-3">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentVideo.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive Progress Slider */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="font-semibold text-sm mb-2 block">Simulate Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Learning Playlist</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {videos.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(idx)
                      setProgress(0)
                      setIsPlaying(false)
                    }}
                    className={`w-full p-4 rounded-lg transition-all text-left group ${
                      selectedVideo === idx
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`text-2xl flex-shrink-0 ${selectedVideo === idx ? '' : 'opacity-70'}`}>
                        {video.thumbnail}
                      </span>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm truncate first-letter:uppercase">
                          {video.title}
                        </p>
                        <p className={`text-xs mt-1 ${selectedVideo === idx ? 'opacity-90' : 'text-gray-600'}`}>
                          {video.duration}
                        </p>
                      </div>
                      {selectedVideo === idx && (
                        <Play size={16} className="flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Completion Status */}
            <div className="card mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h4 className="font-bold mb-3 text-green-900">Your Progress</h4>
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ {selectedVideo + 1} of {videos.length} videos</p>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${((selectedVideo + 1) / videos.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs pt-2">
                  {Math.round(((selectedVideo + 1) / videos.length) * 100)}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mt-12 card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-xl font-bold mb-4">📚 Learning Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Watch videos in sequence for best understanding</li>
            <li>• Take notes while watching for better retention</li>
            <li>• Pause and replay complex sections</li>
            <li>• Review the key takeaways after each video</li>
            <li>• Use these videos as a supplement to reading the document</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
