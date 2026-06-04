"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

export function ProductSupportChat({ productName }: { productName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: `Hi! I'm here to help with questions about "${productName}".` }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    // Add User Message
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput("")

    // Simulate Bot Response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "Thanks for your question! An agent will join this chat shortly to assist you." }])
    }, 1000)
  }

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors mt-3"
      >
        <MessageCircle className="w-4 h-4 text-indigo-500" />
        Chat with Specialist
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-bold text-sm">Support: {productName.slice(0, 15)}...</span>
                </div>
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Messages Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'bot' && <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-indigo-600" /></div>}
                        <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                            m.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 flex gap-2">
                <input 
                    className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Send className="w-4 h-4" /></button>
            </div>
        </div>
      )}
    </>
  )
}