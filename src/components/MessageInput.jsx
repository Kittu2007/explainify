import { useState } from 'react'
import { Send, Zap } from 'lucide-react'

export default function MessageInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="glass p-2 pl-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-4 focus-within:border-primary/30 transition-all bg-[#0a0a0a]/80 backdrop-blur-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Transmit query to neural network..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 font-medium text-sm py-4"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="gooey-button h-[52px] min-w-[120px] flex items-center justify-center gap-2 group/btn"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="font-black text-[11px] uppercase tracking-[0.2em] ml-1">Send</span>
              <Zap size={16} className="fill-white group-hover/btn:scale-110 transition-transform" />
            </>
          )}
        </button>
      </div>
      
      <div className="flex justify-between px-6 mt-3">
         <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">
           Neural Protocol v3.4 
         </p>
         <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">
           Enterprise Grade • End-to-End Encrypted
         </p>
      </div>
    </form>
  )
}
