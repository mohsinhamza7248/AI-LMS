import { Navbar } from '@/components/navigation/Navbar'
import { Video, BookOpen, Users, Plus, Star, BarChart3, Sparkles, Zap, Pencil, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getTutorDashboardData } from '@/actions/tutor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@clerk/nextjs/server'

export default async function TutorDashboard() {
  const { stats, courses } = await getTutorDashboardData()
  const user = await currentUser()
  const firstName = user?.firstName || 'Tutor'

  const statCards = [
    { title: 'Total Enrolled', value: stats.totalEnrolled.toString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { title: 'Course Views', value: stats.courseViews.toString(), icon: BarChart3, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { title: 'Avg. Rating', value: stats.avgRating.toString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Create engaging content, host live sessions, and track student growth.</p>
          </div>
          <Link
            href="/tutor/courses/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:shadow-lg active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create New Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {statCards.map((stat) => (
            <Card key={stat.title} className={`border p-0 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${stat.border} bg-background`}>
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500 ${stat.bg}`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{stat.title}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Recent Courses</h2>
                <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5 rounded-full">{courses.length}</Badge>
              </div>
              <Link href="/tutor/courses" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {courses.length === 0 ? (
              <Card className="border-dashed border-border/60">
                <CardContent className="py-12 flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">No courses yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Create your first course to get started.</p>
                  </div>
                  <Link href="/tutor/courses/create" className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold hover:bg-primary/15 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Create Course
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 4).map((course) => (
                  <Card key={course.id} className="group border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-0 overflow-hidden bg-gradient-to-r hover:from-primary/[0.02] hover:to-transparent">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Users className="h-3 w-3" /> {course.students} Enrolled
                              </span>
                              <Badge
                                variant={course.status === 'Published' ? 'default' : 'secondary'}
                                className={`text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}`}
                              >
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link href={`/tutor/courses/${course.id}`} className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-4 py-2 text-sm font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all active:scale-95 shadow-sm">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          <button className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95">
                            <BarChart3 className="h-3.5 w-3.5" /> Stats
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Session */}
            <Card className="border-border/40 p-0 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  Live Sessions
                </CardTitle>
              </CardHeader>
              <Separator className="opacity-50" />
              <CardContent className="pt-4 space-y-5">
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Next Class</p>
                  <p className="text-sm font-bold mt-1 text-foreground">Advanced React Patterns</p>
                  <p className="text-xs font-semibold text-rose-500 mt-1">Today, 5:30 PM (in 2 hours)</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95">
                    <Video className="h-4 w-4" />
                    Start
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-accent hover:text-accent-foreground transition-colors">
                    Reschedule
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Insight card */}
            <Card className="border-0 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-0 shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
              <CardContent className="p-6 relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg text-white backdrop-blur-md">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                    Tutor Insight
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold leading-tight mb-1">Optimize for AI</h4>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    Ensure your video transcripts are accurate to help your AI Tutor provide magical answers to students querying your course.
                  </p>
                </div>
                <button className="w-full mt-2 bg-white text-indigo-700 font-bold py-2 rounded-xl text-sm hover:bg-white/90 transition-colors shadow-sm active:scale-95">
                  Learn How
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Background Decorators */}
      <div className="fixed top-0 right-0 w-full max-w-2xl h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
    </div>
  )
}
