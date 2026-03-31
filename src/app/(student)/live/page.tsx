import { Navbar } from '@/components/navigation/Navbar'
import { Video, Users, Calendar, ArrowRight, Shield, Zap, Info } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function LiveClassesPage() {
  const sessions = [
    { id: 1, title: 'Advanced React Architecture', tutor: 'Sarah Chen', start: 'Today, 4:00 PM', students: 45, level: 'Advanced' },
    { id: 2, title: 'UI Design Masterclass', tutor: 'Alex Rivera', start: 'Tomorrow, 10:00 AM', students: 32, level: 'Intermediate' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-5xl mx-auto space-y-16">
           {/* HERO SECTION */}
           <div className="space-y-6 text-center lg:text-left flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                 <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
                    <Video className="h-3 w-3 mr-2 animate-pulse" />
                    Interactive Classes
                 </Badge>
                 <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
                    Experience Real-time <br />
                    <span className="text-primary italic">Expert Mentorship</span>
                 </h1>
                 <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Engage in dynamic discussions, ask questions, and collaborate with peers through our integrated Jitsi Meet experience.
                 </p>
              </div>
              <div className="hidden lg:block w-72 h-72 bg-linear-to-br from-primary/20 via-violet-500/10 to-transparent rounded-full blur-[80px] -z-10 absolute right-0" />
           </div>

           {/* SESSIONS GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sessions.map((session) => (
                <Card key={session.id} className="group overflow-hidden rounded-3xl border-border/60 bg-card/50 backdrop-blur-md shadow-2xl shadow-primary/5 transition-all hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-2">
                   <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                         <Badge variant="outline" className="rounded-full border-border/60 text-[10px] font-bold uppercase tracking-widest">{session.level}</Badge>
                         <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                            <Calendar className="h-5 w-5" />
                         </div>
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{session.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm font-medium">
                         <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                         Lead by Specialist {session.tutor}
                      </CardDescription>
                   </CardHeader>
                   <Separator />
                   <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                         <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                            <Users className="h-3.5 w-3.5" />
                            <span>{session.students} Joined</span>
                         </div>
                         <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Secure Channel</span>
                         </div>
                      </div>
                   </CardContent>
                   <CardFooter className="p-6 pt-0 flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scheduled For</p>
                         <p className="text-sm font-black text-primary">{session.start}</p>
                      </div>
                      <Button className="rounded-full gap-2 px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
                         Reserve Seat
                         <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                   </CardFooter>
                </Card>
              ))}
           </div>

           {/* FEATURES SECTION */}
           <div className="rounded-[2.5rem] bg-neutral-900 p-10 sm:p-16 text-white overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                 <div className="space-y-6 flex-1">
                    <Badge className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 border-white/10">
                       <Zap className="h-3 w-3 mr-2 text-primary" />
                       Performance Engine
                    </Badge>
                    <h2 className="text-4xl font-black tracking-tight">Powered by Jitsi Meet</h2>
                    <p className="text-neutral-400 max-w-xl text-lg leading-relaxed font-medium">
                       Our sessions utilize high-performance WebRTC technology, ensuring crystal-clear audio and zero-latency video for the best learning experience.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-colors hover:border-primary/50">
                          <Zap className="h-4 w-4 text-primary" />
                          <span>0.5ms Latency</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-colors hover:border-primary/50">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>E2E Encryption</span>
                       </div>
                    </div>
                 </div>
                 <div className="lg:w-1/3 flex justify-center">
                    <div className="relative h-48 w-48 animate-pulse">
                       <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl" />
                       <div className="relative h-full w-full rounded-full border-8 border-white/5 flex items-center justify-center">
                          <Video className="h-16 w-16 text-white" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
