'use client'

import { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { chatWithTutor } from '@/app/actions/ai-actions'
import { Send, Bot, User, Paperclip, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function AiTutorPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Tutor. How can I help you with your studies today?', sources: [] as any[] }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

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

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-36">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome header (shown on first load) */}
          {messages.length === 1 && (
            <div className="text-center py-8 animate-in fade-in duration-500">
              <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-bold mb-1">AI Tutor</h1>
              <p className="text-sm text-muted-foreground">Powered by Gemini · Ask anything about your studies</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                <AvatarFallback className={cn(
                  'text-xs font-bold',
                  m.role === 'assistant'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={cn(
                'max-w-[80%] space-y-1',
                m.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <p className={cn(
                  'text-[10px] font-semibold uppercase tracking-widest',
                  m.role === 'assistant' ? 'text-primary' : 'text-right text-muted-foreground'
                )}>
                  {m.role === 'assistant' ? 'AI Tutor' : 'You'}
                </p>
                <div className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                  m.role === 'assistant'
                    ? 'bg-card border border-border/60 text-foreground rounded-tl-sm'
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                )}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 w-full bg-linear-to-t from-background via-background/95 to-transparent pb-6 pt-10 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4 pointer-events-auto">
          <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask your AI tutor anything..."
              rows={1}
              className="w-full pl-5 pr-24 py-4 bg-transparent border-none focus:outline-none resize-none text-sm min-h-[54px] placeholder:text-muted-foreground/50"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">
            Gemini Powered · Expert AI Tutor
          </p>
        </div>
      </div>
    </div>
  )
}
