"use client";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { FileText, Download, BarChart2, PieChart, Activity, Loader2 } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'

export default function ResultsDashboard() {
  const { document, documentId, results, setResultsData } = useDocument()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!document) {
      router.push('/upload')
    } else if (!results && documentId) {
      generateSummary()
    }
  }, [document, documentId, results, router])
  
  const generateSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate summary')
      }
      
      const data = await response.json()
      setResultsData(data)
    } catch (error) {
      console.error('Summary generation failed:', error)
      setError(error.message || 'Failed to generate summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  if (!document || loading || (!results && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-xl text-gray-600">Generating your comprehensive analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <FileText className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={generateSummary} className="btn-primary w-full">Retry</button>
        </div>
      </div>
    )
  }

  // Safe defaults for all data
  const summary = results?.summary || 'No summary available.'
  const keyTakeaways = results?.keyTakeaways || []
  const themes = results?.themes || []
  const sentimentScore = results?.sentimentScore || 50
  const metrics = results?.metrics || { processingTime: 'N/A', wordCount: 'N/A' }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark">Document Analysis Results</h1>
            <p className="text-gray-600">Detailed insights from: <span className="font-semibold text-primary">{document.name}</span></p>
          </div>
          <div className="flex gap-4">
            <button className="btn-outline flex items-center gap-2">
              <Download size={20} />
              Export PDF
            </button>
            <button 
              onClick={() => router.push('/video')}
              className="btn-primary"
            >
              Generate Video Learning
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Summary Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-primary" size={24} />
                <h2 className="text-xl font-bold">Comprehensive Summary</h2>
              </div>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {summary.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="text-accent" size={20} />
                  Key Takeaways
                </h3>
                <ul className="space-y-3">
                  {keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PieChart className="text-secondary" size={20} />
                  Main Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Stats/Metrics */}
          <div className="space-y-8">
            <div className="card bg-dark text-white">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="text-primary" size={20} />
                Document Metadata
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">File Size</span>
                  <span className="font-medium">{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Upload Date</span>
                  <span className="font-medium text-xs">{document.uploadedAt}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Processing Time</span>
                  <span className="font-medium">{metrics.processingTime}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Word Count</span>
                  <span className="font-medium">{metrics.wordCount}</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-bold mb-4">Content Sentiment</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                      Analytical
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {sentimentScore}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${sentimentScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">The AI detected a highly {sentimentScore > 70 ? 'informative and formal' : 'conversational'} tone in this document.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
