'use client'

import { Bot, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SourcesPanel } from './SourcesPanel'
import { FollowUpChips } from './FollowUpChips'
import type { AiMessage } from '@/types/ai.types'

// Render inline [N] citation markers as superscript badges
function renderWithCitations(text: string) {
  return text.replace(/\[(\d+)\]/g, '<sup class="citation-badge">$1</sup>')
}

interface MessageBubbleProps {
  message: AiMessage
  onFollowUp?: (text: string) => void
  isLoading?: boolean
  isLast?: boolean
}

export function MessageBubble({ message: m, onFollowUp, isLoading, isLast }: MessageBubbleProps) {
  const isAI = m.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAI ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            'text-xs font-bold',
            isAI
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Bubble content */}
      <div className={cn('max-w-[82%] space-y-1', isAI ? 'items-start' : 'items-end')}>
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              'text-[10px] font-semibold uppercase tracking-widest',
              isAI ? 'text-primary' : 'text-right text-muted-foreground'
            )}
          >
            {isAI ? 'AI Tutor' : 'You'}
          </p>
          {m.isVoice && (
            <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground/60 border border-border/40 rounded px-1 py-0.5">
              🎤 Voice
            </span>
          )}
        </div>

        {/* 1. Images Grid (AI Top Section) */}
        {isAI && m.images && m.images.length > 0 && (
          <div className="w-full mb-1">
            <div className="flex gap-2.5 overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {m.images.map((img, i) => (
                <div key={i} className="snap-start shrink-0 relative rounded-xl overflow-hidden group border border-border/50 bg-card w-[220px] h-[140px]">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 px-3">
                    <p className="text-[11px] font-medium text-white line-clamp-1">{img.title}</p>
                    <p className="text-[9px] text-white/70">{img.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* 3. Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm transition-all w-full max-w-none',
            isAI
              ? 'bg-card border border-border/80 text-foreground rounded-tl-sm hover:shadow-md'
              : 'bg-primary text-primary-foreground rounded-tr-sm shadow-primary/10 hover:shadow-primary/20'
          )}
        >
          {isAI ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 mt-1 text-foreground">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mb-1.5 mt-3 text-foreground/90 flex items-center gap-1.5">
                    <span className="h-[3px] w-3 rounded-full bg-primary inline-block" />
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mb-1 mt-2 text-foreground/80">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 leading-relaxed text-foreground/90">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-none pl-0 mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="flex gap-2 leading-relaxed text-foreground/90">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
                code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
                  inline ? (
                    <code className="bg-muted text-primary font-mono text-xs px-1.5 py-0.5 rounded">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-muted font-mono text-xs p-3 rounded-lg overflow-x-auto my-2 whitespace-pre">
                      {children}
                    </code>
                  ),
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-2">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="text-xs border-collapse w-full">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-2 py-1 bg-muted font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-2 py-1">{children}</td>
                ),
                hr: () => <hr className="border-border my-3" />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:opacity-80"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {m.content}
            </ReactMarkdown>
          ) : (
            <span>{m.content}</span>
          )}
        </div>

        {/* 2. Sources Panel (AI Top Section) */}
        {isAI && m.sources && m.sources.length > 0 && (
          <SourcesPanel sources={m.sources} />
        )}
        {/* Follow-up chips (only on last AI message) */}
        {isAI && isLast && m.followUps && m.followUps.length > 0 && onFollowUp && (
          <FollowUpChips suggestions={m.followUps} onSelect={onFollowUp} />
        )}
      </div>
    </div>
  )
}
