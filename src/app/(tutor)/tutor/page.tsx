import { Navbar } from '@/components/navigation/Navbar'
import { Video, BookOpen, Users, Plus, Star, BarChart3, TrendingUp, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { getTutorDashboardData } from '@/actions/tutor'

export default async function TutorDashboard() {
  const { stats, courses } = await getTutorDashboardData()

  return (
    <div className="min-h-screen bg-sky-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Tutor Studio</h1>
            <p className="text-muted-foreground text-lg mt-2">Create engaging content and track your students' growth.</p>
          </div>
          
          <Link href="/tutor/courses/create" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-primary-foreground font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
             <Plus className="h-5 w-5" />
             Create New Course
          </Link>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
           {[
             { title: 'Total Enrolled', value: stats.totalEnrolled.toString(), icon: Users, color: 'text-indigo-500', trend: 'Active' },
             { title: 'Course Views', value: stats.courseViews.toString(), icon: BarChart3, color: 'text-pink-500', trend: 'Estimated' },
             { title: 'Avg. Rating', value: stats.avgRating.toString(), icon: Star, color: 'text-amber-500', trend: 'Global' }
           ].map((stat, i) => (
             <div key={i} className="rounded-3xl border bg-card p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                   <stat.icon className="h-24 w-24" />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                   <div className="flex items-center justify-between w-full mb-6">
                      <div className={`p-4 rounded-2xl bg-muted/50 ${stat.color}`}>
                         <stat.icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.title}</p>
                      <h3 className="text-4xl font-black">{stat.value}</h3>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mt-12">
           {/* Courses Management */}
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold px-2">Your Courses</h2>
              <div className="grid gap-6">
                 {courses.map((course) => (
                   <div key={course.id} className="group relative rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                               <BookOpen className="h-8 w-8" />
                            </div>
                            <div>
                               <h3 className="text-xl font-black pr-2">{course.title}</h3>
                               <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mt-1">
                                  <span>{course.students} enrolled</span>
                                  <span>•</span>
                                  <span className={`font-bold ${course.status === 'Published' ? 'text-green-600' : 'text-amber-600'}`}>{course.status}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <button className="p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors font-bold text-sm px-6">Edit Course</button>
                            <button className="p-4 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-bold text-sm px-6">View Analytics</button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Live Sessions Management */}
           <div className="space-y-8">
              <h2 className="text-2xl font-bold px-2">Live Sessions</h2>
              <div className="rounded-3xl border bg-card p-8 shadow-sm space-y-6">
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground opacity-50 uppercase tracking-widest">Next Live Class</p>
                    <h3 className="text-2xl font-black">Advanced SSR patterns</h3>
                    <p className="text-primary font-bold">Today, 5:30 PM (in 2 hours)</p>
                 </div>
                 
                 <div className="grid gap-3">
                    <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95">
                       <Video className="h-5 w-5" />
                       Start Session
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-muted py-4 font-bold text-muted-foreground hover:bg-muted/80 transition-colors">
                       Modify Schedule
                    </button>
                 </div>
              </div>

              {/* Tips / Insights */}
              <div className="rounded-3xl bg-neutral-900 p-8 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                    <Sparkles className="h-16 w-16 text-primary" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                       <Zap className="h-3 w-3" />
                       <span>Tutor Insight</span>
                    </div>
                    <h4 className="text-lg font-bold">Optimize for AI</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">Ensure your video transcripts are accurate to help your AI Tutor provide better answers to students.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
