'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onInterimTranscript?: (text: string) => void
  disabled?: boolean
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function VoiceInput({ onTranscript, onInterimTranscript, disabled }: VoiceInputProps) {
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
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.continuous = true

    let currentTranscript = ''

    recognition.onstart = () => {
      currentTranscript = ''
    }

    recognition.onresult = (e: any) => {
      let interimTranscript = ''
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          currentTranscript += e.results[i][0].transcript + ' '
        } else {
          interimTranscript += e.results[i][0].transcript
        }
      }
      const fullText = currentTranscript + interimTranscript
      if (onInterimTranscript && fullText.trim()) {
        onInterimTranscript(fullText.trim())
      }
    }

    recognition.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error)
      setState('idle')
    }

    recognition.onend = () => {
      const finalTranscript = currentTranscript.trim()
      if (finalTranscript) {
        onTranscript(finalTranscript)
      }
      currentTranscript = ''
      setState('idle')
    }

    recognitionRef.current = recognition
  }, [onTranscript, onInterimTranscript])

  const toggle = () => {
    if (disabled) return
    if (state === 'listening') {
      try {
        recognitionRef.current?.stop()
      } catch (e) {
        console.error(e)
      }
      setState('idle')
    } else {
      try {
        recognitionRef.current?.start()
        setState('listening')
      } catch (e) {
        console.error(e)
        // If it fails to start, we ensure we don't stay in the listening state
        setState('idle')
      }
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
