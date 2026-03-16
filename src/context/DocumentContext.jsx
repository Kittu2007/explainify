"use client";
import { createContext, useContext, useState } from 'react'

const DocumentContext = createContext()

export function DocumentProvider({ children }) {
  const [document, setDocument] = useState(null)
  const [documentId, setDocumentId] = useState(null)
  const [chatId, setChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const uploadDocument = (file, id, chatIdArg) => {
    setDocument({
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString()
    })
    setDocumentId(id)
    setChatId(chatIdArg || null) 
    setMessages([])
    setResults(null)
  }
  
  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }])
  }

  const loadChat = (chatData) => {
    setChatId(chatData.id)
    setMessages(chatData.messages || [])
    // Optionally load document status if linked
    if (chatData.document_id) {
       setDocumentId(chatData.document_id)
       // We might need to fetch file metadata if it's not present
    }
  }
  
  const setResultsData = (data) => {
    setResults(data)
  }
  
  const clearContext = () => {
    setDocument(null)
    setDocumentId(null)
    setChatId(null)
    setMessages([])
    setResults(null)
  }
  
  return (
    <DocumentContext.Provider value={{
      document,
      documentId,
      chatId,
      setChatId,
      messages,
      results,
      loading,
      setLoading,
      uploadDocument,
      addMessage,
      loadChat,
      setResultsData,
      clearContext
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocument must be used within DocumentProvider')
  }
  return context
}
