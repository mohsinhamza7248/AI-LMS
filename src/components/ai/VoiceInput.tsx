'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
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

type MicState = 'idle' | 'listening' | 'unsupported' | 'permission-denied'

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [state, setState] = useState<MicState>('idle')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  // Keep a stable ref to the latest callback so we never need to recreate recognition
  const onTranscriptRef = useRef(onTranscript)
  useEffect(() => { onTranscriptRef.current = onTranscript }, [onTranscript])

  // Create (or recreate) the recognition instance only once on mount
  useEffect(() => {
    // Must be in a browser context
    if (typeof window === 'undefined') return

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
      const transcript = e.results[0]?.[0]?.transcript ?? ''
      if (transcript) {
        onTranscriptRef.current(transcript)
      }
      setState('idle')
    }

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setState('permission-denied')
      } else {
        setState('idle')
      }
    }

    recognition.onend = () => {
      setState(prev => (prev === 'listening' ? 'idle' : prev))
    }

    recognitionRef.current = recognition

    return () => {
      try { recognition.abort() } catch { /* ignore */ }
    }
  }, []) // ← intentionally empty — never recreate

  const toggle = useCallback(() => {
    if (disabled) return
    const recognition = recognitionRef.current
    if (!recognition) return

    if (state === 'listening') {
      recognition.stop()
      setState('idle')
    } else {
      try {
        recognition.start()
        setState('listening')
      } catch {
        // "already started" race — just mark idle so next click works
        setState('idle')
      }
    }
  }, [disabled, state])

  if (state === 'unsupported') return null

  const isPermissionDenied = state === 'permission-denied'
  const isListening = state === 'listening'

  return (
    <button
      id="voice-input-btn"
      type="button"
      onClick={isPermissionDenied ? undefined : toggle}
      disabled={disabled || isPermissionDenied}
      title={
        isPermissionDenied
          ? 'Microphone access denied — please allow it in your browser settings'
          : isListening
          ? 'Stop recording'
          : 'Speak your question'
      }
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        isListening
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          : isPermissionDenied
          ? 'text-muted-foreground/40 cursor-not-allowed'
          : 'hover:bg-muted text-muted-foreground'
      )}
    >
      {/* Animated ring when listening */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping" />
          <span className="absolute inset-[-4px] rounded-xl border border-red-500/40 animate-pulse" />
        </>
      )}
      {isListening ? (
        <Square className="h-3.5 w-3.5 fill-current" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  )
}
