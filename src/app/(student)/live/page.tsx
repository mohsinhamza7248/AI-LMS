import { Navbar } from '@/components/navigation/Navbar'
import { Video, Users, Calendar, ArrowRight, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LiveClassesPage() {
  const sessions = [
    { id: 1, title: 'Advanced React Architecture', tutor: 'Sarah Chen', start: 'Today, 4:00 PM', students: 45 },
    { id: 2, title: 'UI Design Masterclass', tutor: 'Alex Rivera', start: 'Tomorrow, 10:00 AM', students: 32 },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary">
                 <Video className="h-4 w-4" />
                 <span>Live Now</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight">Interactive Live Classes</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                 Join world-class tutors in real-time. Engage in dynamic discussions, ask questions, and collaborate with peers through our integrated Jitsi Meet experience.
              </p>
           </div>

           <div className="grid gap-8">
              {sessions.map((session) => (
                <div key={session.id} className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                         <Calendar className="h-6 w-6" />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <h3 className="text-2xl font-bold tracking-tight">{session.title}</h3>
                         <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                               <Users className="h-4 w-4" />
                               <span>{session.students} students waiting</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <Shield className="h-4 w-4" />
                               <span>Tutor: {session.tutor}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <p className="text-lg font-bold text-primary">{session.start}</p>
                         <button className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            Join Session
                            <ArrowRight className="h-5 w-5" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="rounded-3xl bg-neutral-900 p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 space-y-8">
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Powered by Jitsi Meet</h2>
                    <p className="text-neutral-400 max-w-lg leading-relaxed">
                       Our live sessions utilize high-performance WebRTC technology, ensuring crystal-clear audio and low-latency video for the best learning experience.
                    </p>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
                       <Zap className="h-4 w-4 text-primary" />
                       <span>Low Latency</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
                       <Shield className="h-4 w-4 text-primary" />
                       <span>End-to-End Secure</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
