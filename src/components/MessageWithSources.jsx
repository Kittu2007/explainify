import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { useState } from 'react'

/**
 * MessageWithSources - Chat message with source references
 * Displays AI responses with referenced document sections
 */
export default function MessageWithSources({ 
  message, 
  isUser = false, 
  sources = [] 
}) {
  const [showSources, setShowSources] = useState(false)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser
            ? 'bg-primary text-white rounded-lg rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-lg rounded-bl-none'
        }`}
      >
        {/* Message Content */}
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'} mt-2 block`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {/* Sources Section - Only for AI messages */}
        {!isUser && sources && sources.length > 0 && (
          <div className={`border-t ${isUser ? 'border-white/20' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowSources(!showSources)}
              className={`w-full px-4 py-2 flex items-center justify-between transition-colors ${
                isUser 
                  ? 'hover:bg-primary/80' 
                  : 'hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText size={14} />
                <span className="text-xs font-medium">
                  {sources.length} {sources.length === 1 ? 'Source' : 'Sources'}
                </span>
              </div>
              {showSources ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Expanded Sources */}
            {showSources && (
              <div className={`space-y-2 px-4 py-3 text-xs ${
                isUser ? 'bg-primary/90' : 'bg-gray-50'
              }`}>
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border ${
                      isUser
                        ? 'border-white/20 bg-white/10'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <p className={`font-medium mb-1 ${isUser ? 'text-white' : 'text-gray-900'}`}>
                      {source.title}
                    </p>
                    <p className={isUser ? 'text-white/80' : 'text-gray-600'}>
                      {source.excerpt}
                    </p>
                    {source.page && (
                      <p className={`mt-1 ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                        Page {source.page}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
