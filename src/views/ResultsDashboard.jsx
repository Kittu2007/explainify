"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { FileText, Download, BarChart2, PieChart, Activity, Loader2 } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ResultsDashboard() {
  const { document, documentId, results, setResultsData } = useDocument()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)
  
  useEffect(() => {
    if (!document) {
      router.push('/dashboard/upload')
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

  const handleExportPDF = async () => {
    if (!reportRef.current) return
    
    setExporting(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`Explainify_Analysis_${document.name.split('.')[0]}.pdf`)
    } catch (err) {
      console.error('PDF Export failed:', err)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }
  
  if (!document || loading || (!results && !error)) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-xl text-gray-600">Generating your comprehensive analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-20">
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark">Document Analysis Results</h1>
            <p className="text-gray-600">Detailed insights from: <span className="font-semibold text-primary">{document?.name || 'Unknown Document'}</span></p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-outline flex items-center gap-2 disabled:opacity-50"
            >
              {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={20} />}
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button 
              onClick={() => router.push('/dashboard/video')}
              className="btn-primary"
            >
              Generate Video Learning
            </button>
          </div>
        </div>
        
        <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Summary Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-primary" size={24} />
                <h2 className="text-xl font-bold">Comprehensive Summary</h2>
              </div>
              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary}
                </ReactMarkdown>
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
                      <div className="text-gray-600 text-sm prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item}
                        </ReactMarkdown>
                      </div>
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
                  <span className="font-medium">{(document?.size ? (document.size / 1024 / 1024).toFixed(2) : '0.00')} MB</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Upload Date</span>
                  <span className="font-medium text-xs">{document?.uploadedAt || 'N/A'}</span>
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
