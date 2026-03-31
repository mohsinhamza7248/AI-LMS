import { Navbar } from '@/components/navigation/Navbar'
import { CourseCard } from '@/components/courses/CourseCard'
import { getCoursesByTenant, getCategoriesByTenant, getAvailableSkills } from '@/services/course.service'
import { getActiveTenant } from '@/lib/tenant'
import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ParticlesBg } from '@/components/ui/ParticlesBg'
import { CourseFilters } from '@/components/courses/CourseFilters'
import { Suspense } from 'react'

export default async function CoursesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const categoryId = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const skill = typeof searchParams.skill === 'string' ? searchParams.skill : undefined
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const tenant = await getActiveTenant()
  const courses = tenant ? await getCoursesByTenant(tenant.id, { categoryId, skill, search }) : []
  const categories = tenant ? await getCategoriesByTenant(tenant.id) : []
  const availableSkills = tenant ? await getAvailableSkills(tenant.id) : []

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />
      <ParticlesBg />

      <div className="container mx-auto px-4 lg:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 rounded-full border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold px-4 py-1">
            Library
          </Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Find the perfect course to advance your career.{' '}
              <span className="font-medium text-foreground">{courses.length} courses available.</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted/10 rounded-2xl mb-8"></div>}>
          <CourseFilters categories={categories} availableSkills={availableSkills} />
        </Suspense>

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
