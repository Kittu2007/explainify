"use client";
import { createContext, useContext, useState } from 'react'

const DocumentContext = createContext()

export function DocumentProvider({ children }) {
  const [document, setDocument] = useState(null)
  const [messages, setMessages] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const uploadDocument = (file, content) => {
    setDocument({
      name: file.name,
      size: file.size,
      content: content,
      uploadedAt: new Date().toLocaleString()
    })
    setMessages([])
    setResults(null)
  }
  
  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }])
  }
  
  const setResultsData = (data) => {
    setResults(data)
  }
  
  const clearContext = () => {
    setDocument(null)
    setMessages([])
    setResults(null)
  }
  
  return (
    <DocumentContext.Provider value={{
      document,
      messages,
      results,
      loading,
      setLoading,
      uploadDocument,
      addMessage,
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
