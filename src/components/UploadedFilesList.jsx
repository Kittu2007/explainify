import { FileText, X, Download, HardDrive, Calendar } from 'lucide-react'

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
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="glass p-5 flex items-center justify-between border border-white/5 hover:border-primary/20 hover:bg-white/[0.05] transition-all group/card rounded-[2rem] shadow-xl"
        >
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="bg-primary/10 p-4 rounded-2xl group-hover/card:scale-110 transition-transform">
              <FileText className="text-primary" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white truncate text-sm tracking-tight">{file.name}</p>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600 mt-2">
                <div className="flex items-center gap-1.5">
                   <HardDrive size={10} />
                   <span>{formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Calendar size={10} />
                   <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onRemove(idx)}
              className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all active:scale-90 border border-red-500/20"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
