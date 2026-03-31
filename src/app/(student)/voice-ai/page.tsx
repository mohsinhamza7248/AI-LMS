'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { Mic, MicOff, Volume2, Sparkles, User, Bot, Loader2, Play, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function VoiceAiPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      processVoiceInput()
    } else {
      setIsListening(true)
      setTranscript('Sensing your query...')
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
      
      <div className="container mx-auto px-4 pt-32 pb-24 flex flex-col items-center justify-center min-h-[85vh]">
         {/* WAVEFORM VISUALIZATION */}
         <div className="relative mb-20 h-72 w-72 flex items-center justify-center perspective-[1000px]">
            <div className={`absolute inset-0 rounded-full bg-primary/20 animate-ping duration-1000 ${isListening ? 'opacity-30' : 'opacity-0'}`} />
            <div className={`absolute inset-6 rounded-full bg-primary/30 animate-pulse duration-700 ${isListening ? 'opacity-40' : 'opacity-0'}`} />
            <div className={`absolute inset-12 rounded-full border-2 border-primary/20 ${isListening ? 'animate-spin group-hover:scale-110' : 'opacity-0'} transition-all`} />
            
            <Button 
              onClick={toggleListening}
              size="icon"
              variant={isListening ? "destructive" : "default"}
              className={`relative z-10 p-12 h-44 w-44 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-90 ${isListening ? 'shadow-destructive/40' : 'shadow-primary/40'}`}
            >
               {isListening ? <MicOff className="h-20 w-20" /> : <Mic className="h-20 w-20" />}
            </Button>

            {/* Subtle floating glow */}
            <div className={`absolute top-0 right-0 h-4 w-4 rounded-full bg-primary/80 blur-md ${isListening ? 'animate-bounce' : 'hidden'}`} />
         </div>

         <div className="max-w-3xl w-full space-y-12">
            <div className="space-y-4 text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Gemini Voice Core</span>
               </div>
               <h1 className="text-5xl font-black tracking-tight leading-tight">Elite Voice Assistant</h1>
               <p className="text-muted-foreground text-lg font-medium max-w-lg mx-auto">
                  Speak naturally to query your course content. Your personal mentor, powered by cutting-edge neural linguistics.
               </p>
            </div>

            <div className="grid gap-8">
               {/* TRANSCRIPT BOX */}
               <Card className={`overflow-hidden border-border/60 bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/5 transition-all duration-500 ${isListening ? 'ring-2 ring-primary border-transparent translate-y-[-4px] shadow-primary/10' : ''}`}>
                  <CardHeader className="pb-3 flex-row items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                           <User className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">User Transcription</CardTitle>
                     </div>
                     {isListening && <span className="flex items-center gap-1 text-[10px] text-primary font-black uppercase tracking-widest"><Loader2 className="h-3 w-3 animate-spin" /> Live Listening</span>}
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                     <p className="text-xl sm:text-2xl font-serif italic text-foreground leading-relaxed min-h-[2em]">
                       {transcript ? `“ ${transcript} ”` : 'Press the microphone and share your thoughts...'}
                     </p>
                  </CardContent>
               </Card>

               {/* RESPONSE BOX */}
               { (response || isProcessing) && (
                 <Card className="overflow-hidden border-primary/20 bg-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <CardHeader className="pb-3 flex-row items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                             <Bot className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">AI Neural Response</CardTitle>
                       </div>
                       {!isProcessing && (
                          <Button variant="ghost" size="sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 font-bold px-4">
                             <Volume2 className="h-4 w-4 mr-2" />
                             Play Synthesis
                          </Button>
                       )}
                    </CardHeader>
                    <Separator className="bg-primary/10" />
                    <CardContent className="pt-6 relative">
                       {isProcessing ? (
                         <div className="flex items-center gap-4 text-muted-foreground italic text-xl py-4">
                           <div className="flex gap-1.5">
                              {[0, 1, 2].map(i => (
                                <div key={i} className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                              ))}
                           </div>
                           Decoding semantic patterns...
                         </div>
                       ) : (
                         <div className="space-y-6">
                           <p className="text-xl sm:text-2xl leading-[1.6] font-medium text-foreground tracking-tight">
                             {response}
                           </p>
                           <Separator className="bg-primary/10" />
                           <div className="flex flex-wrap gap-3">
                              <Badge variant="outline" className="bg-background/50 border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors cursor-pointer px-3 py-1">
                                 <Sparkles className="h-3 w-3 mr-2 text-primary" />
                                 Insight Sourced: Module 4.2
                              </Badge>
                              <Badge variant="outline" className="bg-background/50 border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors cursor-pointer px-3 py-1">
                                 <Info className="h-3 w-3 mr-2 text-primary" />
                                 Confidence Level: 98%
                              </Badge>
                           </div>
                         </div>
                       )}
                    </CardContent>
                 </Card>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
