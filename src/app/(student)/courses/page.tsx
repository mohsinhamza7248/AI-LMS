import { Navbar } from '@/components/navigation/Navbar'
import { CourseCard } from '@/components/courses/CourseCard'
import { getCoursesByTenant } from '@/services/course.service'
import { getActiveTenant } from '@/lib/tenant'
import { Search, Filter, BookOpen } from 'lucide-react'

export default async function CoursesPage() {
  const tenant = await getActiveTenant()
  const courses = tenant ? await getCoursesByTenant(tenant.id) : []

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground text-lg mt-2">Find the perfect course to advance your career.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="pl-12 pr-6 py-3 rounded-full border bg-muted/20 w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
             </div>
             <button className="p-3 rounded-full border bg-muted/20 hover:bg-muted/40 transition-colors">
                <Filter className="h-6 w-6" />
             </button>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border border-dashed border-muted bg-muted/5">
             <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-8 w-8" />
             </div>
             <div>
                <h3 className="text-xl font-bold">No courses yet</h3>
                <p className="text-muted-foreground">Check back later for new learning opportunities.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
