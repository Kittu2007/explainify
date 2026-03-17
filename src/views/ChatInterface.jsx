"use client";
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, Cpu, Sparkles, Send, Zap } from 'lucide-react'
import { useDocument } from '../context/DocumentContext'
import ChatBubble from '../components/ChatBubble'
import MessageInput from '../components/MessageInput'

export default function ChatInterface() {
  const { document, documentId, messages: contextMessages, chatId, setChatId, addMessage, loadChat } = useDocument()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Initialize messages from context or default
  useEffect(() => {
    if (contextMessages && contextMessages.length > 0) {
      setMessages(contextMessages.map((m, i) => ({
        id: i,
        text: m.content || m.text,
        isUser: m.role === 'user' || m.isUser,
        sources: m.sources || []
      })))
    } else {
      setMessages([
        { id: 1, text: "System Online. Neural pathways established. How may I assist with your document analysis today?", isUser: false }
      ])
    }
  }, [contextMessages])

  useEffect(() => {
    if (!document && !chatId) {
      router.push('/dashboard/upload')
    }
  }, [document, chatId, router])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSendMessage = async (userInput) => {
    if (!userInput.trim()) return

    const userMessage = {
      id: Date.now(),
      text: userInput,
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
    addMessage('user', userInput)
    setIsLoading(true)

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
          question: userInput,
          chatId: chatId
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error (${response.status})`)
      }

      const reader = response.body.getReader()
      const textDecoder = new TextDecoder()
      
      let fullText = ""
      let sources = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = textDecoder.decode(value, { stream: true })
        if (chunk.includes('__METADATA__')) {
          const parts = chunk.split('\n')
          const metaLine = parts.find(p => p.startsWith('__METADATA__:'))
          if (metaLine) {
            const metaStr = metaLine.replace('__METADATA__:', '')
            try {
              const meta = JSON.parse(metaStr)
              sources = meta.sources || []
              if (meta.chatId && !chatId) {
                setChatId(meta.chatId)
              }
            } catch (e) { console.error("Failed to parse metadata", e) }
          }
          
          // Filter out the metadata line and keep the rest
          const content = parts.filter(p => !p.startsWith('__METADATA__:')).join('\n')
          fullText += content
        } else {
          fullText += chunk
        }

        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, text: fullText, sources: sources } : m
        ))
      }
      
      addMessage('assistant', fullText)

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorText = `Encryption Error: Unable to verify neural bridge. Details: ${error.message || 'Unknown'}.`
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, text: errorText } : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  if (!document && !chatId) return null
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] relative animate-fade-in group">
      {/* Background Subtle Glow */}
      <div className="absolute inset-x-20 top-0 bottom-0 bg-primary/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      {/* Floating Header */}
      <div className="glass mx-auto px-4 md:px-8 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 w-full mb-4 md:mb-6 flex items-center justify-between shadow-2xl z-20">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl md:rounded-2xl border border-primary/20 shrink-0">
            <Cpu className="text-primary w-[18px] h-[18px] md:w-5 md:h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
               <h1 className="text-sm md:text-lg font-black text-white leading-none truncate">Neural Link</h1>
               <div className="px-1 md:px-1.5 py-0.5 bg-green-500/10 rounded-md border border-green-500/20 text-[6px] md:text-[8px] font-black text-green-500 uppercase tracking-widest leading-none shrink-0">Encrypted</div>
            </div>
            <p className="text-[8px] md:text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest truncate">
              Context: <span className="text-primary/70">{document?.name || 'Neural Stream'}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/dashboard/upload')}
          className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl transition-all border border-white/5 text-[10px] md:text-xs font-black uppercase tracking-widest active:scale-95 shrink-0"
        >
          <Plus className="text-primary w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">New Thread</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto space-y-4 pb-24">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start animate-scale-in">
              <div className="glass px-6 py-4 rounded-3xl rounded-bl-none border-primary/20 shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Consulting Neural Core...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 md:p-6 pb-2 z-30">
        <div className="max-w-4xl mx-auto relative">
           <div className="absolute inset-0 bg-darker/60 blur-2xl -z-10 rounded-full" />
           <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
