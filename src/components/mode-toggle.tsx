'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted/20 animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-background/50 backdrop-blur-sm transition-all hover:bg-accent active:scale-95 shadow-sm overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun className={`h-full w-full transition-all duration-500 absolute inset-0 ${
          theme === 'dark' ? 'translate-y-10 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        }`} />
        <Moon className={`h-full w-full transition-all duration-500 absolute inset-0 ${
          theme === 'dark' ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-10 rotate-90 opacity-0'
        }`} />
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        theme === 'dark' ? 'bg-amber-500/10' : 'bg-violet-500/10'
      }`} />
    </button>
  )
}
