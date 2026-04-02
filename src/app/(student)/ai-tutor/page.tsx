'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { chatWithTutor } from '@/app/actions/ai-actions'
import { Send, Bot, Sparkles, Zap, BookOpen, Brain, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageBubble } from '@/components/ai/MessageBubble'
import { VoiceInput } from '@/components/ai/VoiceInput'
import type { AiMessage } from '@/types/ai.types'

const SUGGESTED_PROMPTS = [
  { icon: '🧬', label: 'Explain DNA replication', query: 'Explain DNA replication' },
  { icon: '⚡', label: 'How does electricity work?', query: 'How does electricity work?' },
  { icon: '🌍', label: 'Causes of climate change', query: 'What are the main causes of climate change?' },
  { icon: '📐', label: 'Explain Pythagorean theorem', query: 'Explain the Pythagorean theorem with examples' },
  { icon: '🧠', label: 'How does memory work?', query: 'How does human memory work?' },
  { icon: '🌊', label: 'Water cycle explained', query: 'Explain the water cycle in detail' },
]

const FEATURE_PILLS = [
  { icon: <Zap className="h-3 w-3" />, label: 'Instant answers' },
  { icon: <BookOpen className="h-3 w-3" />, label: 'Cited sources' },
  { icon: <Brain className="h-3 w-3" />, label: 'Smart diagrams' },
  { icon: <Globe className="h-3 w-3" />, label: 'Voice input' },
]

export default function AiTutorPage() {
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const handleSend = useCallback(async (overrideQuery?: string) => {
    const query = (overrideQuery ?? input).trim()
    if (!query || isLoading) return

    const userMessage: AiMessage = {
      role: 'user',
      content: query,
      sources: [],
      isVoice: !!overrideQuery && overrideQuery !== input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatWithTutor(query)
      const aiMessage: AiMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        imageUrl: response.imageUrl,
        followUps: response.followUps,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I\'m sorry, something went wrong. Please try again.',
          sources: [],
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setInput(transcript)
    // Mark as voice message and send
    const userMessage: AiMessage = {
      role: 'user',
      content: transcript,
      sources: [],
      isVoice: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    chatWithTutor(transcript).then(response => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          sources: response.sources,
          imageUrl: response.imageUrl,
          followUps: response.followUps,
          timestamp: new Date(),
        },
      ])
    }).catch(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I\'m sorry, something went wrong. Please try again.',
          sources: [],
        },
      ])
    }).finally(() => {
      setIsLoading(false)
      setInput('')
    })
  }, [])

  const handleFollowUp = useCallback((text: string) => {
    setInput(text)
    textareaRef.current?.focus()
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto pt-20 pb-44">
        <div className="max-w-3xl mx-auto px-4 py-8">

          {/* ── Welcome / Hero (shown when no messages) ── */}
          {!hasMessages && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              {/* Hero */}
              <div className="text-center py-10">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl animate-pulse" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-2xl shadow-primary/25 ring-4 ring-primary/20">
                    <Sparkles className="h-12 w-12" />
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  AI Tutor
                </h1>
                <p className="text-base text-muted-foreground max-w-sm mx-auto font-medium mb-6">
                  Ask any study question and get structured, cited answers — just like Perplexity, but for learning.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                  {FEATURE_PILLS.map((pill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {pill.icon}
                      {pill.label}
                    </span>
                  ))}
                </div>

                {/* Suggested prompts grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      id={`suggested-prompt-${i}`}
                      type="button"
                      onClick={() => handleSend(p.query)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5',
                        'text-left text-xs font-medium text-foreground/80',
                        'hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
                        'transition-all duration-200 active:scale-95 shadow-sm'
                      )}
                    >
                      <span className="text-base shrink-0">{p.icon}</span>
                      <span className="line-clamp-2 leading-snug">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Message list ── */}
          <div className="space-y-8">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                onFollowUp={handleFollowUp}
                isLast={i === messages.length - 1}
              />
            ))}
          </div>

          {/* ── Typing / loading indicator ── */}
          {isLoading && (
            <div className="flex gap-3 mt-8 animate-in fade-in duration-300">
              <div className="h-8 w-8 shrink-0 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1.5 items-center mb-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/60 font-medium">
                  Researching your question…
                </p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Fixed Input Bar ── */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none">
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/98 to-transparent" />

        <div className="relative pointer-events-auto pb-6 pt-4">
          <div className="max-w-3xl mx-auto px-4">
            {/* Input container */}
            <div
              className={cn(
                'relative rounded-2xl border bg-card shadow-xl shadow-black/8',
                'transition-all duration-200',
                'border-border/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15'
              )}
            >
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                id="ai-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask anything — biology, physics, history, math…"
                rows={1}
                disabled={isLoading}
                className="w-full pl-5 pr-28 py-4 bg-transparent border-none focus:outline-none resize-none text-sm min-h-[56px] max-h-[160px] placeholder:text-muted-foreground/50 disabled:opacity-50"
              />

              {/* Action buttons */}
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                {/* Voice button */}
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

                {/* Divider */}
                <div className="h-4 w-px bg-border/60" />

                {/* Send button */}
                <button
                  id="send-btn"
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                    'bg-primary text-primary-foreground shadow',
                    'hover:bg-primary/90 active:scale-95',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100'
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom hint */}
            <p className="mt-2 text-center text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">
              Gemini Powered · Structured Answers · Cited Sources · 🎤 Voice Ready
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
