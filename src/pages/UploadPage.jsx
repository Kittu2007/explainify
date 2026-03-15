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
  const [uploadSuccess, setUploadSuccess] = useState(false)
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
        setUploadSuccess(true)
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
  
  // If upload is successful, show Choose Action section
  if (uploadSuccess) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-light py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="text-green-600" size={40} />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Document Uploaded Successfully!</h1>
            <p className="text-xl text-gray-600">
              Your document is ready. Choose what you'd like to do next.
            </p>
          </div>
          
          {/* Choose Action Section */}
          <div className="grid md:grid-cols-3 gap-8 my-12">
            {[
              {
                title: 'Chat with Document',
                desc: 'Ask questions about your document and get instant AI-powered answers.',
                icon: '💬',
                path: '/chat',
                color: 'bg-blue-50 border-blue-200'
              },
              {
                title: 'View Results / Summary',
                desc: 'Get a comprehensive summary and key insights from your document.',
                icon: '📊',
                path: '/results',
                color: 'bg-purple-50 border-purple-200'
              },
              {
                title: 'Generate Learning Video',
                desc: 'Create a personalized video explanation of your document content.',
                icon: '🎥',
                path: '/video',
                color: 'bg-orange-50 border-orange-200'
              }
            ].map((action, idx) => (
              <div
                key={idx}
                className={`${action.color} border rounded-xl p-8 text-center hover:shadow-lg transition-all`}
              >
                <div className="text-5xl mb-4">{action.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{action.title}</h3>
                <p className="text-gray-700 mb-6">{action.desc}</p>
                <button
                  onClick={() => navigate(action.path)}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {action.title.split('/')[0].includes('Chat') ? 'Start Chat' : action.title.includes('Results') ? 'View Summary' : 'Generate Video'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setUploadSuccess(false)
                setFiles([])
              }}
              className="px-6 py-2 text-primary font-semibold hover:underline"
            >
              ← Upload Another Document
            </button>
          </div>
        </div>
      </div>
    )
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
