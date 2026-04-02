'use client'

import { cn } from '@/lib/utils'

interface FollowUpChipsProps {
  suggestions: string[]
  onSelect: (text: string) => void
  disabled?: boolean
}

export function FollowUpChips({ suggestions, onSelect, disabled }: FollowUpChipsProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button
          key={i}
          id={`followup-chip-${i}`}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(s.replace(/^[^\s]+\s/, ''))} // strip emoji prefix
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40',
            'px-3 py-1.5 text-xs font-medium text-muted-foreground',
            'hover:border-primary/40 hover:bg-primary/8 hover:text-primary',
            'transition-all duration-200 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
