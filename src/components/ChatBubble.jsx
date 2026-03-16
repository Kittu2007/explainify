import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, User } from 'lucide-react'

export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 items-end gap-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mb-1">
          <Sparkles size={14} className="text-primary" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] md:max-w-[75%] px-6 py-4 rounded-[2rem] shadow-2xl transition-all duration-300 ${
          isUser
            ? 'bg-primary text-white rounded-br-none font-bold'
            : 'glass text-gray-300 rounded-bl-none border border-white/10'
        }`}
      >
        <div className={`text-[14px] leading-relaxed prose prose-invert max-w-none ${isUser ? 'text-white' : 'text-gray-300 font-medium'}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message || ""}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message || ""}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mb-1">
          <User size={14} className="text-gray-400" />
        </div>
      )}
    </div>
  )
}
