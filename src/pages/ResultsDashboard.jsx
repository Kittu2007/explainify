import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Download, Share2, Play, Lightbulb } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'

export default function ResultsDashboard() {
  const { document, messages, setResultsData } = useDocument()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loadingResults, setLoadingResults] = useState(true)
  
  useEffect(() => {
    if (!document || messages.length === 0) {
      navigate('/upload')
      return
    }
    
    // Simulate generating results
    const timer = setTimeout(() => {
      const generatedResults = {
        summary: 'This document provides a comprehensive overview of the subject matter. The key sections cover fundamental concepts, implementation details, and practical applications. The content demonstrates thorough research and clear explanation of complex topics.',
        keyTakeaways: [
          'Understanding the core concepts is essential for practical application',
          'The document progressively builds from basics to advanced topics',
          'Real-world examples are provided throughout for clarity',
          'Multiple perspectives are considered for a holistic view'
        ],
        concepts: [
          { name: 'Concept 1', frequency: 15, importance: 'High' },
          { name: 'Concept 2', frequency: 12, importance: 'High' },
          { name: 'Concept 3', frequency: 10, importance: 'Medium' },
          { name: 'Concept 4', frequency: 8, importance: 'Medium' },
          { name: 'Concept 5', frequency: 6, importance: 'Low' }
        ],
        readingTime: '8 minutes',
        complexity: 'Intermediate',
        engagement: 85
      }
      setResults(generatedResults)
      setResultsData(generatedResults)
      setLoadingResults(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [document, messages, navigate, setResultsData])
  
  if (!document || loadingResults || !results) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BarChart className="mx-auto text-primary" size={48} />
          </div>
          <p className="text-lg font-semibold">Generating your results...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-[80vh] bg-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Learning Results Dashboard</h1>
          <p className="text-xl text-gray-600">AI-generated insights from your document</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Reading Time', value: results.readingTime, icon: '⏱️' },
            { label: 'Complexity', value: results.complexity, icon: '📊' },
            { label: 'Engagement', value: `${results.engagement}%`, icon: '⚡' },
            { label: 'Questions Asked', value: messages.length, icon: '❓' }
          ].map((stat, idx) => (
            <div key={idx} className="card text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
        
        {/* Summary Card */}
        <div className="card mb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
            <Lightbulb size={24} className="text-primary" />
            <span>Document Summary</span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{results.summary}</p>
        </div>
        
        {/* Key Takeaways */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Takeaways</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {results.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="card flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-none">
                  {idx + 1}
                </div>
                <p className="text-gray-700">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Concepts Identified</h2>
          <div className="card">
            <div className="space-y-4">
              {results.concepts.map((concept, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{concept.name}</p>
                      <p className="text-sm text-gray-600">Mentioned {concept.frequency} times</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      concept.importance === 'High' ? 'bg-red-100 text-red-700' :
                      concept.importance === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {concept.importance}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(concept.frequency / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button className="card hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all">
            <Download className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2">Download Report</h3>
            <p className="text-gray-600 text-sm">Export your results as PDF</p>
          </button>
          <button className="card hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all">
            <Share2 className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2">Share Results</h3>
            <p className="text-gray-600 text-sm">Share insights with others</p>
          </button>
          <button
            onClick={() => navigate('/video')}
            className="card hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary"
          >
            <Play className="text-primary mb-4" size={32} />
            <h3 className="font-bold mb-2 text-primary">Video Learning</h3>
            <p className="text-gray-600 text-sm">Watch AI-generated videos</p>
          </button>
        </div>
        
        {/* Additional Resources */}
        <div className="card bg-white border-l-4 border-primary">
          <h3 className="text-lg font-bold mb-3">Next Steps</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Review your key takeaways above</li>
            <li>✓ Watch video explanations for deeper learning</li>
            <li>✓ Download the full report for reference</li>
            <li>✓ Share insights with your learning group</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
