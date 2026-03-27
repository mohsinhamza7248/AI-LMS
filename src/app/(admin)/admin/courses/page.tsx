import { Navbar } from '@/components/navigation/Navbar'
import { getCourseList } from '@/actions/admin'
import Link from 'next/link'
import { Plus, Edit, Eye, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminCoursesPage() {
  const courses = await getCourseList()

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
            <p className="text-muted-foreground">View and edit all courses on the platform.</p>
          </div>
          <Link 
            href="/admin/courses/create" 
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create New Course
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-card rounded-3xl border border-dashed">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No courses found. Create your first one!</p>
            </div>
          ) : (
            courses.map((course: any) => (
              <div key={course.id} className="group relative bg-card rounded-3xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                   {course.thumbnailUrl ? (
                     <img 
                       src={course.thumbnailUrl} 
                       alt={course.title} 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <BookOpen className="h-12 w-12 text-muted-foreground/20" />
                   )}
                   <div className="absolute top-4 right-4 flex gap-2">
                     {course.isPublished ? (
                       <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-green-500/20">Published</span>
                     ) : (
                       <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-amber-500/20">Draft</span>
                     )}
                     {course.isLive && (
                       <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-red-500/20">Live</span>
                     )}
                   </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1 truncate">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">By {course.tutorName}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price</p>
                      <p className="font-bold text-lg">₹{course.price || 'Free'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/courses/${course.id}`}
                        className="p-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <Link 
                         href={`/courses/${course.id}`}
                         target="_blank"
                         className="p-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                         title="View Public Page"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
