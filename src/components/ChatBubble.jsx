import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * ChatBubble - Reusable message bubble component
 * Displays individual chat messages with different styling for user vs AI
 */
export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
        }`}
      >
        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
          {isUser ? (
            <p>{message || ""}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message || ""}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
