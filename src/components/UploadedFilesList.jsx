import { FileText, X, Download } from 'lucide-react'

/**
 * UploadedFilesList - Display list of uploaded documents
 * Shows file metadata and allows file management
 */
export default function UploadedFilesList({ files, onRemove }) {
  if (!files || files.length === 0) {
    return null
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <h3 className="text-white font-semibold text-lg">Uploaded Documents</h3>
        <p className="text-white/80 text-sm">Manage your uploaded files</p>
      </div>
      
      <div className="divide-y">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="text-primary" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                title="Download file"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => onRemove(idx)}
                title="Remove file"
                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
