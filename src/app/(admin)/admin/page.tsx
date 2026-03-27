import { Navbar } from '@/components/navigation/Navbar'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { LayoutDashboard, BookOpen, Users, Settings, Plus, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { getAdminStats, getStudentList, getTutorList, getRecentActivity } from '@/actions/admin'
import { AddUserForm } from '@/components/admin/AddTutorForm'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const [stats, students, tutors, activity] = await Promise.all([
    getAdminStats(),
    getStudentList(),
    getTutorList(),
    getRecentActivity()
  ])

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform, tutors, and students.</p>
          </div>
          <div className="flex items-center gap-4">
            <AddUserForm />
            <Link 
              href="/admin/courses/create" 
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Create Course
            </Link>
          </div>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid gap-8 lg:grid-cols-3 mt-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">

            <div className="rounded-3xl border bg-card p-8 shadow-sm">
               <h2 className="text-xl font-bold italic font-serif">&quot;Believe you can and you&apos;re halfway there.&quot;</h2>
               <div className="space-y-4">
                 {activity.length === 0 ? (
                   <p className="text-muted-foreground text-sm">No recent activity.</p>
                 ) : (
                   activity.map((item) => (
                     <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                       <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {item.studentAvatar ? (
                            <img src={item.studentAvatar} alt={item.studentName} className="h-full w-full object-cover" />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                       </div>
                       <div className="flex-1">
                          <p className="font-medium text-sm">New student <span className="font-bold">{item.studentName}</span> enrolled in "{item.courseTitle}"</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Tutors</h2>
                 </div>
                 <div className="space-y-4">
                   {tutors.length === 0 ? (
                     <p className="text-muted-foreground text-sm">No tutors yet.</p>
                   ) : (
                     tutors.map((tutor) => (
                       <div key={tutor.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-muted flex shrink-0 items-center justify-center overflow-hidden">
                                {tutor.avatar ? <img src={tutor.avatar} alt="Avatar" className="h-full w-full object-cover" /> : <GraduationCap className="h-4 w-4" />}
                             </div>
                             <div>
                               <p className="text-sm font-bold">{tutor.name || 'Unnamed Tutor'}</p>
                               <p className="text-xs text-muted-foreground">{tutor.coursesCount} courses</p>
                             </div>
                          </div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tutor.coursesCount > 0 ? 'Active' : 'New'}</span>
                       </div>
                     ))
                   )}
                 </div>
              </div>

              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">New Students</h2>
                 </div>
                 <div className="space-y-4">
                   {students.length === 0 ? (
                     <p className="text-muted-foreground text-sm">No students yet.</p>
                   ) : (
                     students.slice(0, 5).map((student) => (
                       <div key={student.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-muted flex shrink-0 items-center justify-center overflow-hidden">
                                {student.avatar ? <img src={student.avatar} alt="Avatar" className="h-full w-full object-cover" /> : <Users className="h-4 w-4" />}
                             </div>
                             <div>
                               <p className="text-sm font-bold">{student.name || 'Student'}</p>
                               <p className="text-xs text-muted-foreground">{student.enrollmentsCount} enrollments</p>
                             </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(student.joined).toLocaleDateString()}</span>
                       </div>
                     ))
                   )}
                 </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="rounded-3xl border bg-card p-8 shadow-sm">
               <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
               <div className="grid gap-4">
                 <Link href="/admin/courses" className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">Manage Courses</span>
                 </Link>
                 <Link href="/admin/students" className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Student List</span>
                 </Link>
                 <Link href="/admin/settings" className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Platform Settings</span>
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
