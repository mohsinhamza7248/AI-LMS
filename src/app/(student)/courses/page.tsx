import { Navbar } from '@/components/navigation/Navbar'
import { CourseCard } from '@/components/courses/CourseCard'
import { getCoursesByTenant } from '@/services/course.service'
import { getActiveTenant } from '@/lib/tenant'
import { Search, Filter, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ParticlesBg } from '@/components/ui/ParticlesBg'

export default async function CoursesPage() {
  const tenant = await getActiveTenant()
  const courses = tenant ? await getCoursesByTenant(tenant.id) : []

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />
      <ParticlesBg />

      <div className="container mx-auto px-4 lg:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 rounded-full border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold px-4 py-1">
            Library
          </Badge>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Find the perfect course to advance your career.{' '}
                <span className="font-medium text-foreground">{courses.length} courses available.</span>
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2.5 rounded-full border border-border/60 bg-background text-sm w-full md:w-[260px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <button className="flex items-center justify-center h-10 w-10 rounded-full border border-border/60 bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No courses yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new learning opportunities.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
