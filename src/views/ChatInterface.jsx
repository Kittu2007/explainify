"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ChatBubble from '../components/ChatBubble'
import MessageInput from '../components/MessageInput'

export default function ChatInterface() {
  const { document, documentId } = useDocument()
  const router = useRouter()
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. Ask me anything about your uploaded document.", isUser: false }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Redirect to upload if no document
  useEffect(() => {
    if (!document) {
      router.push('/dashboard/upload')
    }
  }, [document, router])
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Handle send message
  const handleSendMessage = async (userInput) => {
    if (!userInput.trim() || !documentId) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: userInput,
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Placeholder for AI response
    const aiMessageId = Date.now() + 1;
    const initialAiMessage = {
      id: aiMessageId,
      text: "",
      isUser: false,
      sources: []
    }
    setMessages(prev => [...prev, initialAiMessage])

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: documentId,
          question: userInput
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error (${response.status})`)
      }

      // Handle String vs Stream (some errors might return JSON)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: data.answer, sources: data.sources } : m))
        return
      }

      // Read as Stream
      const reader = response.body.getReader()
      const textDecoder = new TextDecoder()
      
      let fullText = ""
      let sources = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = textDecoder.decode(value, { stream: true })
        
        // Check for metadata
        if (chunk.startsWith('__METADATA__:')) {
          const parts = chunk.split('\n')
          const metaStr = parts[0].replace('__METADATA__:', '')
          try {
            const meta = JSON.parse(metaStr)
            sources = meta.sources || []
          } catch (e) { console.error("Failed to parse metadata", e) }
          
          // Append the rest of the chunk if there's more after the newline
          if (parts.length > 1) {
            const extra = parts.slice(1).join('\n')
            fullText += extra
          }
        } else {
          fullText += chunk
        }

        // Update the message in state
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, text: fullText, sources: sources } : m
        ))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorText = `Sorry, I couldn't process your request: ${error.message || 'Unknown error'}. Please try again.`
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, text: errorText } : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  if (!document) {
    return null
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-md z-10 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-dark tracking-tight">AI Knowledge Assistant</h1>
              <p className="text-xs text-gray-500">
                Context: <span className="font-bold text-primary">{document.name}</span>
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary hover:bg-primary/10 rounded-xl transition-all border border-primary/10"
            >
              <Plus size={16} />
              <span className="text-xs font-black uppercase tracking-wider">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
