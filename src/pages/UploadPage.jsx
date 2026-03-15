import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Check, AlertCircle } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ClickSparkButton from '../components/ClickSparkButton'
import UploadedFilesList from '../components/UploadedFilesList'

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
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
    // Validate file type
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
    
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB.')
      return
    }
    
    // Check if file already exists
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
      // Simulate file reading
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const fileData = {
          name: currentFile.name,
          size: currentFile.size,
          content: e.target.result,
          uploadedAt: new Date().toISOString(),
          type: currentFile.type
        }
        
        setFiles(prev => [...prev, fileData])
        uploadDocument(currentFile, e.target.result)
        setCurrentFile(null)
        setUploading(false)
        
        // Show success and redirect to chat
        setTimeout(() => {
          navigate('/chat')
        }, 500)
      }
      
      fileReader.onerror = () => {
        setError('Failed to read file. Please try again.')
        setUploading(false)
      }
      
      fileReader.readAsText(currentFile)
    } catch (error) {
      console.error('Upload failed:', error)
      setError('Failed to upload file. Please try again.')
      setUploading(false)
    }
  }
  
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Upload Your Document</h1>
          <p className="text-xl text-gray-600">
            Choose a file to analyze. Supported formats: PDF, Word, and Text documents.
          </p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Upload Error</p>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            dragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-gray-300 bg-white'
          }`}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
            multiple
          />
          
          {!currentFile ? (
            <>
              <Upload className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-2xl font-bold mb-2">Drag and drop your document</h3>
              <p className="text-gray-600 mb-6">or</p>
              <label htmlFor="fileInput" className="btn-primary inline-block cursor-pointer">
                Browse Files
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, Word (.doc, .docx), and Text (.txt)
              </p>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <FileText className="text-primary" size={48} />
                <div className="text-left">
                  <p className="font-semibold text-lg">{currentFile.name}</p>
                  <p className="text-gray-600">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentFile(null)}
                  className="btn-outline"
                  disabled={uploading}
                >
                  Change File
                </button>
                <ClickSparkButton
                  onClick={handleUpload}
                  className="btn-primary flex items-center justify-center space-x-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      <span>Process Document</span>
                    </>
                  )}
                </ClickSparkButton>
              </div>
            </div>
          )}
        </div>
        
        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-12">
            <UploadedFilesList files={files} onRemove={removeFile} />
          </div>
        )}
        
        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Fast Processing',
              desc: 'Your document is analyzed in seconds using advanced AI'
            },
            {
              title: 'Secure Upload',
              desc: 'All files are encrypted and stored securely'
            },
            {
              title: 'Easy Access',
              desc: 'Ask questions and get instant answers about your content'
            }
          ].map((benefit, idx) => (
            <div key={idx} className="card text-center">
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
