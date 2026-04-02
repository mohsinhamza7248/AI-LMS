'use client'

import { BookOpen } from 'lucide-react'
import type { AiSource } from '@/types/ai.types'

interface SourcesPanelProps {
  sources: AiSource[]
}

function getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="w-full mb-3">
      <div className="flex items-center gap-2 mb-2 px-1">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground/80">Sources</h3>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {sources.map((src, i) => (
          <a
            key={i}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between shrink-0 snap-start w-[180px] h-[95px] rounded-xl border border-border/60 bg-card p-3 hover:bg-muted/60 transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                  <img src={getFaviconUrl(src.domain)} alt="" className="w-3.5 h-3.5 rounded-sm shrink-0 bg-white" />
                  <span className="text-[10px] font-medium text-muted-foreground truncate">{src.domain}</span>
                </div>
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                  {i + 1}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground/90 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {src.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

