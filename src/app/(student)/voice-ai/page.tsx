'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { Mic, MicOff, Volume2, Sparkles, User, Bot, Loader2 } from 'lucide-react'

export default function VoiceAiPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      // Process final transcript
      processVoiceInput()
    } else {
      setIsListening(true)
      setTranscript('Listening to your voice...')
    }
  }

  const processVoiceInput = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setTranscript("Explain the core concept of hooks in React.")
      setResponse("Hooks in React are functions that allow you to 'hook into' React state and lifecycle features from function components. They were introduced in React 16.8 to solve issues with class components and logic reuse.")
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
         {/* Waveform Visualization Placeholder */}
         <div className="relative mb-16 h-64 w-64 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-primary/10 animate-ping ${isListening ? 'opacity-20' : 'opacity-0'}`} />
            <div className={`absolute inset-4 rounded-full bg-primary/20 animate-pulse ${isListening ? 'opacity-30' : 'opacity-0'}`} />
            <button 
              onClick={toggleListening}
              className={`relative z-10 p-12 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 ${isListening ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-primary text-primary-foreground shadow-primary/50'}`}
            >
               {isListening ? <MicOff className="h-20 w-20" /> : <Mic className="h-20 w-20" />}
            </button>
         </div>

         <div className="max-w-2xl w-full space-y-12">
            <div className="space-y-4 text-center">
               <h1 className="text-4xl font-extrabold tracking-tight">Voice Assistant</h1>
               <p className="text-muted-foreground text-lg">Speak naturally to query your course content.</p>
            </div>

            <div className="grid gap-6">
               {/* Transcript Box */}
               <div className={`rounded-3xl border p-8 bg-card shadow-sm transition-all ${isListening ? 'ring-2 ring-primary border-transparent' : ''}`}>
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                     <User className="h-4 w-4" />
                     <span>Your Transcript</span>
                  </div>
                  <p className="text-xl font-medium italic min-h-[1.5em]">
                    {transcript || 'Press the mic and start talking...'}
                  </p>
               </div>

               {/* Response Box */}
               { (response || isProcessing) && (
                 <div className="rounded-3xl border p-8 bg-primary/5 shadow-sm animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                          <Bot className="h-4 w-4" />
                          <span>AI Answer</span>
                       </div>
                       {!isProcessing && (
                         <button className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                            <Volume2 className="h-4 w-4" />
                            Read Aloud
                         </button>
                       )}
                    </div>
                    {isProcessing ? (
                      <div className="flex items-center gap-3 text-muted-foreground italic text-lg">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Analyzing and sourcing answer...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xl leading-relaxed font-medium">
                          {response}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-4">
                           <div className="px-3 py-1 rounded-full border bg-background text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-muted transition-colors cursor-pointer">
                              <Sparkles className="h-3 w-3 text-primary" />
                              <span>Reference: Lesson 2.4</span>
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
