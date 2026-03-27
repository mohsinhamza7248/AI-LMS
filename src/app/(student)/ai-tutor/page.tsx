'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { chatWithTutor } from '@/app/actions/ai-actions'
import { Send, Bot, User, ArrowUp, Paperclip } from 'lucide-react'

export default function AiTutorPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Tutor. How can I help you with your studies today?', sources: [] as any[] }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = { role: 'user', content: input, sources: [] }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatWithTutor(input)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer,
        sources: response.sources
      }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I am sorry, something went wrong. Please try again.',
        sources: []
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto pt-24 pb-32 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-bottom duration-500`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {m.role === 'assistant' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
              </div>
              <div className="space-y-2 pt-1">
                 <p className="font-bold text-sm uppercase tracking-widest opacity-50">
                   {m.role === 'assistant' ? 'AI Tutor' : 'You'}
                 </p>
                 <div className="text-lg leading-relaxed whitespace-pre-wrap">
                   {m.content}
                 </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
               <div className="h-10 w-10 rounded-full bg-primary/10 shrink-0" />
               <div className="space-y-2 flex-1 pt-4">
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pb-8 pt-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative group shadow-2xl rounded-3xl overflow-hidden border bg-card/80 backdrop-blur-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
             <textarea 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
               placeholder="Ask your AI tutor anything..." 
               rows={1}
               className="w-full pl-6 pr-24 py-6 bg-transparent border-none focus:outline-none resize-none text-lg min-h-[60px]"
             />
             <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                   <Paperclip className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                   <ArrowUp className="h-6 w-6 font-bold" />
                </button>
             </div>
          </div>
          <div className="mt-3 flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-50">
             <span>Gemini Powered</span>
             <span>Expert AI Tutor</span>
          </div>
        </div>
      </div>
    </div>
  )
}
