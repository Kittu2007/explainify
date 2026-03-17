import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
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
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
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
  
  if (uploadSuccess) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-indigo-900/5 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex justify-center mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <Check className="text-white" size={48} />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Document Uploaded Successfully!
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your document is ready. Choose what you'd like to do next.
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 my-16">
            {[
              {
                title: 'Chat with Document',
                desc: 'Ask questions about your document and get instant AI-powered answers.',
                icon: '💬',
                path: '/chat',
                color: 'from-blue-600 to-blue-400'
              },
              {
                title: 'View Results / Summary',
                desc: 'Get a comprehensive summary and key insights from your document.',
                icon: '📊',
                path: '/results',
                color: 'from-purple-600 to-purple-400'
              },
              {
                title: 'Generate Learning Video',
                desc: 'Create a personalized video explanation of your document content.',
                icon: '🎥',
                path: '/video',
                color: 'from-orange-600 to-orange-400'
              }
            ].map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.color} bg-opacity-10 border border-gray-700 p-8 text-center`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">{action.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{action.title}</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">{action.desc}</p>
                  <motion.button
                    onClick={() => navigate(action.path)}
                    className={`px-6 py-3 bg-gradient-to-r ${action.color} text-white font-semibold rounded-lg transition-all`}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(139, 92, 246, 0.5)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.title.split('/')[0].includes('Chat') ? 'Start Chat' : action.title.includes('Results') ? 'View Summary' : 'Generate Video'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => {
                setUploadSuccess(false)
                setFiles([])
              }}
              className="px-8 py-3 text-purple-400 font-semibold hover:text-purple-300 transition-colors flex items-center justify-center gap-2 mx-auto"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Upload Another Document
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-indigo-900/5 pointer-events-none" />
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Upload Your Document</h1>
          <p className="text-xl text-gray-300">
            Choose a file to analyze. Supported formats: PDF, Word, and Text documents.
          </p>
        </motion.div>
        
        {error && (
          <motion.div
            className="mb-8 bg-red-900/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 backdrop-blur"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-300">Upload Error</p>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </motion.div>
        )}
        
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          animate={dragActive ? { scale: 1.02 } : { scale: 1 }}
          className={`rounded-3xl border-2 border-dashed p-16 text-center transition-all backdrop-blur-sm ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <Upload className="mx-auto text-purple-400 drop-shadow-lg" size={56} />
              </motion.div>
              <h3 className="text-3xl font-bold mb-3 text-white">Drag and drop your document</h3>
              <p className="text-gray-400 mb-8 text-lg">or</p>
              <label htmlFor="fileInput" className="inline-block cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Browse Files
                </motion.button>
              </label>
              <p className="text-sm text-gray-400 mt-6">
                Supported formats: PDF, Word (.doc, .docx), and Text (.txt)
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center space-x-6 bg-gray-700/30 rounded-2xl p-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText className="text-purple-400" size={56} />
                </motion.div>
                <div className="text-left">
                  <p className="font-semibold text-lg text-white">{currentFile.name}</p>
                  <p className="text-gray-400">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setCurrentFile(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={uploading}
                >
                  Change File
                </motion.button>
                <ClickSparkButton
                  onClick={handleUpload}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center space-x-2 transition-all"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⏳</motion.span>
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
            </motion.div>
          )}
        </motion.div>
        
        {files.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UploadedFilesList files={files} onRemove={removeFile} />
          </motion.div>
        )}
        
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Fast Processing',
              desc: 'Your document is analyzed in seconds using advanced AI',
              icon: '⚡'
            },
            {
              title: 'Secure Upload',
              desc: 'All files are encrypted and stored securely',
              icon: '🔒'
            },
            {
              title: 'Easy Access',
              desc: 'Ask questions and get instant answers about your content',
              icon: '💡'
            }
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-all"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="font-bold mb-3 text-white text-lg">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
