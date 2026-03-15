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
      router.push('/upload')
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

      const data = await response.json()

      const aiResponse = {
        id: Date.now() + 1,
        text: data.answer,
        isUser: false,
        sources: data.sources // Optional: if ChatBubble supports it
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: Date.now() + 2,
        text: `Sorry, I couldn't process your request: ${error.message || 'Unknown error'}. Please try again.`,
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!document) {
    return null
  }
  
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark">Explainify AI Chat</h1>
              <p className="text-sm text-gray-500 mt-1">
                Chatting about: <span className="font-semibold text-primary">{document.name}</span>
              </p>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span className="text-sm">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
