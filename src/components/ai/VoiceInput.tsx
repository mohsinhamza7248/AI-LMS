'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [state, setState] = useState<'idle' | 'listening' | 'unsupported'>('idle')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setState('unsupported')
      return
    }
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript
      onTranscript(transcript)
      setState('idle')
    }
    recognition.onerror = () => setState('idle')
    recognition.onend = () => setState('idle')
    recognitionRef.current = recognition
  }, [onTranscript])

  const toggle = () => {
    if (disabled) return
    if (state === 'listening') {
      recognitionRef.current?.stop()
      setState('idle')
    } else {
      recognitionRef.current?.start()
      setState('listening')
    }
  }

  if (state === 'unsupported') return null

  return (
    <button
      id="voice-input-btn"
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={state === 'listening' ? 'Stop recording' : 'Speak your question'}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        state === 'listening'
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          : 'hover:bg-muted text-muted-foreground'
      )}
    >
      {/* Animated ring when listening */}
      {state === 'listening' && (
        <>
          <span className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping" />
          <span className="absolute inset-[-4px] rounded-xl border border-red-500/40 animate-pulse" />
        </>
      )}
      {state === 'listening' ? (
        <Square className="h-3.5 w-3.5 fill-current" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  )
}
