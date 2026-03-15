"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ChatBubble from '../components/ChatBubble'
import MessageInput from '../components/MessageInput'

export default function ChatInterface() {
  const { document } = useDocument()
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
  }, [document, navigate])
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Handle send message
  const handleSendMessage = async (userInput) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: userInput,
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate AI response
      const aiResponses = [
        `That's a great question about your document! Based on the content, I can provide you with a comprehensive analysis. Let me break this down into key points that directly relate to your question.`,
        `Excellent inquiry! I found several relevant sections in your document that address this. The main insights suggest that this is a crucial aspect covered throughout the material with supporting evidence and detailed explanations.`,
        `Good question! After analyzing your document, I can see this topic appears in multiple sections. The document provides strong context and detailed explanations that will help you understand this concept better.`,
        `I appreciate you asking about this! Your document contains valuable information on this subject. Let me provide you with the most relevant insights and key takeaways from what I've analyzed.`
      ]

      const aiResponse = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
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
