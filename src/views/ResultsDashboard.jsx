"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { FileText, Download, BarChart2, PieChart, Activity, Loader2, Sparkles, Wand2, ArrowRight } from 'lucide-react'
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
        backgroundColor: '#050505'
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
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
          <Loader2 className="relative h-16 w-16 text-primary animate-spin" strokeWidth={3} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tighter">Deconstructing Reality</h2>
          <p className="text-gray-500 font-medium">Neural engine is processing your document structures...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bento-card max-w-md text-center border-red-500/20">
          <Activity className="mx-auto h-12 w-12 text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">Analysis Interrupted</h2>
          <p className="text-gray-500 mb-8 text-sm">{error}</p>
          <button onClick={generateSummary} className="gooey-button w-full">Re-Initialize Process</button>
        </div>
      </div>
    )
  }

  const summary = results?.summary || 'No summary available.'
  const keyTakeaways = results?.keyTakeaways || []
  const themes = results?.themes || []
  const sentimentScore = results?.sentimentScore || 50
  const metrics = results?.metrics || { processingTime: 'N/A', wordCount: 'N/A' }

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-2 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit border border-primary/20">
             <Sparkles size={12} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Report</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter truncate max-w-full">
            {document?.name || 'Knowledge Entity'}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 shrink-0">
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 text-gray-400 font-bold text-[10px] md:text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={18} />}
            <span>{exporting ? 'Exporting' : 'Download Brief'}</span>
          </button>
          <button 
            onClick={() => router.push('/dashboard/video')}
            className="flex-1 md:flex-none gooey-button flex items-center justify-center gap-2 px-4 md:px-8 py-2 md:py-3"
          >
            <span className="text-[10px] md:text-sm">Visualize Insights</span>
            <ArrowRight className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </button>
        </div>
      </div>
      
      <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Brief Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="magic-bento min-h-[300px] md:min-h-[500px] border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem]">
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <div className="p-2.5 md:p-4 bg-primary/10 rounded-xl md:rounded-3xl">
                <FileText className="text-primary w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">Executive Summary</h2>
            </div>
            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed font-medium">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
              </ReactMarkdown>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-card border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/20 rounded-xl">
                  <Activity className="text-accent" size={20} />
                </div>
                <h3 className="font-black text-lg text-white tracking-tight">Key Inferences</h3>
              </div>
              <ul className="space-y-4">
                {keyTakeaways.map((item, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                    <span className="text-accent font-black text-xs opacity-50">{String(i+1).padStart(2, '0')}</span>
                    <div className="text-gray-400 text-sm font-bold leading-snug">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {item}
                      </ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bento-card border-white/5 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-secondary/20 rounded-xl">
                  <PieChart className="text-secondary" size={20} />
                </div>
                <h3 className="font-black text-lg text-white tracking-tight">Core Ontology</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {themes.map((theme, i) => (
                  <span key={i} className="px-5 py-2.5 bg-secondary/5 text-secondary border border-secondary/20 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary/10 transition-colors cursor-default">
                    {theme}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-8 border-t border-white/5">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">Content Sentiment</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-black text-white">Analytical Index</span>
                       <span className="text-xl font-black text-primary">{sentimentScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                         style={{ width: `${sentimentScore}%` }}
                       />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium italic">
                       Highly {sentimentScore > 70 ? 'structured and formal' : 'dynamic and contextual'} dataset.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Metadata Sidebar */}
        <div className="space-y-6">
          <div className="bento-card border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-white/5 rounded-xl">
                 <BarChart2 className="text-primary" size={20} />
              </div>
              <h3 className="font-black text-lg text-white tracking-tight">Artifact Data</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'File Size', value: `${(document?.size ? (document.size / 1024 / 1024).toFixed(2) : '0.00')} MB` },
                { label: 'Entity Type', value: document?.type?.split('/')[1]?.toUpperCase() || 'DATA' },
                { label: 'Latency', value: metrics.processingTime || '0.8s' },
                { label: 'Node Count', value: metrics.wordCount || '1,240' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">{stat.label}</span>
                  <span className="text-white font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card border-white/5 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Wand2 className="text-primary" size={28} />
             </div>
             <h4 className="text-sm font-black text-white mb-2">Need a Visualization?</h4>
             <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">Let AI transform this analysis into an interactive graphical scene.</p>
             <button 
               onClick={() => router.push('/dashboard/video')}
               className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
             >
               Start Learning
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
