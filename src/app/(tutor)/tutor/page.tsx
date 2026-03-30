import { Navbar } from '@/components/navigation/Navbar'
import { Video, BookOpen, Users, Plus, Star, BarChart3, Sparkles, Zap, Pencil } from 'lucide-react'
import Link from 'next/link'
import { getTutorDashboardData } from '@/actions/tutor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default async function TutorDashboard() {
  const { stats, courses } = await getTutorDashboardData()

  const statCards = [
    { title: 'Total Enrolled', value: stats.totalEnrolled.toString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Course Views', value: stats.courseViews.toString(), icon: BarChart3, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Avg. Rating', value: stats.avgRating.toString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tutor Studio</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create engaging content and track your students' growth.</p>
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
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-border/60 p-0">
              <CardContent className="p-5">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-4 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Your Courses</h2>
              <Badge variant="outline" className="text-xs">{courses.length} total</Badge>
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
              <div className="space-y-3">
                {courses.map((course) => (
                  <Card key={course.id} className="border-border/60 hover:shadow-md hover:border-border transition-all duration-200 p-0">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm leading-snug">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{course.students} enrolled</span>
                              <span className="text-muted-foreground/40">·</span>
                              <Badge
                                variant={course.status === 'Published' ? 'default' : 'secondary'}
                                className="text-[10px] px-2 py-0 h-4"
                              >
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors">
                            <BarChart3 className="h-3 w-3" /> Analytics
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
          <div className="space-y-4">
            {/* Live Session */}
            <Card className="border-border/60 p-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Live Sessions</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Next Class</p>
                  <p className="text-sm font-semibold mt-1">Advanced SSR Patterns</p>
                  <p className="text-xs text-primary mt-0.5">Today, 5:30 PM (in 2 hours)</p>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95">
                    <Video className="h-4 w-4" />
                    Start Session
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-full border border-border/60 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                    Modify Schedule
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Insight card */}
            <Card className="border-0 bg-linear-to-br from-primary/90 to-violet-700 text-white p-0 overflow-hidden">
              <CardContent className="p-5 relative">
                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    <Zap className="h-3 w-3" />
                    Tutor Insight
                  </div>
                  <h4 className="text-sm font-semibold">Optimize for AI</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Ensure your video transcripts are accurate to help your AI Tutor provide better answers to students.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
