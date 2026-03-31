import { Navbar } from '@/components/navigation/Navbar'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { BookOpen, Users, Settings, Plus, GraduationCap, Activity } from 'lucide-react'
import Link from 'next/link'
import { getAdminStats, getStudentList, getTutorList, getRecentActivity } from '@/actions/admin'
import { AddUserForm } from '@/components/admin/AddTutorForm'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default async function AdminDashboard() {
  const [stats, students, tutors, activity] = await Promise.all([
    getAdminStats(),
    getStudentList(),
    getTutorList(),
    getRecentActivity()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your platform, tutors, and students.</p>
          </div>
          <div className="flex items-center gap-3">
            <AddUserForm />
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Activity */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground italic font-serif">
                  "Believe you can and you're halfway there."
                </p>
              </CardHeader>
              <Separator className="mb-1" />
              <CardContent className="pt-3">
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent activity yet.</p>
                ) : (
                  <div className="space-y-1">
                    {activity.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/40 transition-colors">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={item.studentAvatar} alt={item.studentName} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {item.studentName?.slice(0, 2).toUpperCase() || 'ST'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{item.studentName}</span> enrolled in{' '}
                            <span className="font-medium">"{item.courseTitle}"</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">New</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tutors + Students Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tutors */}
              <Card className="border-border/60">
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-base font-semibold">Tutors</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">{tutors.length} total</Badge>
                </CardHeader>
                <Separator className="mb-1" />
                <CardContent className="pt-3">
                  {tutors.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No tutors yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {tutors.map((tutor) => (
                        <div key={tutor.id} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={tutor.avatar} />
                              <AvatarFallback className="text-[10px] bg-amber-500/10 text-amber-600">
                                {tutor.name?.slice(0, 2).toUpperCase() || 'TU'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold leading-none">{tutor.name || 'Unnamed Tutor'}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{tutor.coursesCount} courses</p>
                            </div>
                          </div>
                          <Badge variant={tutor.coursesCount > 0 ? "default" : "secondary"} className="text-[10px] px-2">
                            {tutor.coursesCount > 0 ? 'Active' : 'New'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Students */}
              <Card className="border-border/60">
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base font-semibold">New Students</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">{students.length} total</Badge>
                </CardHeader>
                <Separator className="mb-1" />
                <CardContent className="pt-3">
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No students yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {students.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback className="text-[10px] bg-blue-500/10 text-blue-600">
                                {student.name?.slice(0, 2).toUpperCase() || 'ST'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold leading-none">{student.name || 'Student'}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{student.enrollmentsCount} enrollments</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(student.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <Separator className="mb-3" />
              <CardContent className="pt-0 grid gap-2">
                {[
                  { href: '/admin/courses', icon: BookOpen, label: 'Manage Courses', color: 'text-violet-500', bg: 'bg-violet-500/10' },
                  { href: '/admin/students', icon: Users, label: 'Student List', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { href: '/admin/categories', icon: require('lucide-react').Tag, label: 'Categories', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { href: '/admin/settings', icon: Settings, label: 'Platform Settings', color: 'text-muted-foreground', bg: 'bg-muted/60' },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent group border border-transparent hover:border-border/40"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.bg} ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-foreground transition-colors">{action.label}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
