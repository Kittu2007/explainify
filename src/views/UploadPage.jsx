"use client";
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { Upload, FileText, Check, AlertCircle, Shield, Zap, Search, ArrowRight } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ClickSparkButton from '../components/ClickSparkButton'
import UploadedFilesList from '../components/UploadedFilesList'

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { uploadDocument } = useDocument()
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      droppedFiles.forEach(file => handleFile(file))
    }
  }
  
  const handleChange = (e) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      selectedFiles.forEach(file => handleFile(file))
    }
  }
  
  const handleFile = (selectedFile) => {
    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    const validExtensions = ['.pdf', '.txt', '.doc', '.docx']
    
    const hasValidType = validTypes.includes(selectedFile.type) || 
                         validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext))
    
    if (!hasValidType) {
      setError('Please upload a PDF, TXT, or Word document.')
      return
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) { 
      setError('File size must be less than 50MB.')
      return
    }
    
    if (files.some(f => f.name === selectedFile.name)) {
      setError(`File "${selectedFile.name}" is already uploaded.`)
      return
    }
    
    setCurrentFile(selectedFile)
  }
  
  const handleUpload = async () => {
    if (!currentFile) return
    
    setUploading(true)
    setError(null)
    
    try {
      const { supabase } = await import('../lib/supabase')
      const fileExt = currentFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: storageError } = await supabase.storage
        .from('explainify')
        .upload(filePath, currentFile)

      if (storageError) {
        throw new Error(`Storage upload failed: ${storageError.message}`)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filePath: filePath,
          filename: currentFile.name,
          fileSize: currentFile.size
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Backend processing failed')
      }

      const data = await response.json()
      
      const fileData = {
        name: currentFile.name,
        size: currentFile.size,
        uploadedAt: new Date().toISOString(),
        type: currentFile.type,
        documentId: data.documentId
      }
      
      setFiles(prev => [...prev, fileData])
      uploadDocument(currentFile, data.documentId, data.chatId)
      setCurrentFile(null)
      setUploading(false)
      
      setTimeout(() => {
        router.push('/dashboard/chat')
      }, 500)
    } catch (err) {
      console.error('Final upload error:', err)
      setError(err.message || 'Failed to upload file. Please try again.')
      setUploading(false)
    }
  }
  
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-white tracking-tighter">Import Knowledge</h1>
        <p className="text-gray-500 font-medium">Feed the neural network with specialized documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Area - Large Bento Piece */}
        <div className="lg:col-span-2 bento-card flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
           
           <input
            type="file"
            id="fileInput"
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
            multiple
          />

          {!currentFile ? (
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Drop your neural data here</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                PDF, Word, or Text files up to 50MB. Click to browse your local storage.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-scale-in flex flex-col items-center">
              <div className="flex items-center gap-6 p-6 glass rounded-2xl w-full max-w-md">
                <div className="p-4 bg-primary/20 rounded-xl">
                  <FileText className="text-primary" size={32} />
                </div>
                <div className="flex-1 truncate text-left">
                  <p className="font-black text-white truncate">{currentFile.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mt-1">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB • Ready to Process
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentFile(null)}
                  className="px-6 py-3 rounded-full border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                  disabled={uploading}
                >
                  Discard
                </button>
                <button
                  onClick={handleUpload}
                  className="gooey-button h-[48px] min-w-[180px] flex items-center justify-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="fill-white" />
                      <span>Inject Knowledge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border-red-500/30 flex items-center gap-3 animate-slide-up">
               <AlertCircle className="text-red-500" size={18} />
               <p className="text-xs font-bold text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Info Bento Pieces */}
        <div className="flex flex-col gap-6">
          <div className="bento-card p-6 flex flex-col justify-between h-[180px] group overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#050505]">
             <div className="p-3 bg-blue-500/10 rounded-xl w-fit">
               <Shield className="text-blue-500" size={20} />
             </div>
             <div>
               <h4 className="font-black text-lg text-white">Neural Security</h4>
               <p className="text-[11px] text-gray-500 font-medium">Bank-grade encryption for all processed documents.</p>
             </div>
             <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
          </div>

          <div className="bento-card p-6 flex flex-col justify-between h-[180px] group overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#050505]">
             <div className="p-3 bg-emerald-500/10 rounded-xl w-fit">
               <Zap className="text-emerald-500" size={20} />
             </div>
             <div>
               <h4 className="font-black text-lg text-white">Rapid Indexing</h4>
               <p className="text-[11px] text-gray-500 font-medium">Sub-second retrieval for large knowledge bases.</p>
             </div>
             <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Uploaded History - Bento Piece */}
      {files.length > 0 && (
        <div className="bento-card min-h-[200px] border-white/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">Active Repositories</h3>
              <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest tracking-widest border border-white/5">
                 {files.length} indexed
              </div>
           </div>
           <UploadedFilesList files={files} onRemove={removeFile} />
        </div>
      )}
    </div>
  )
}
