import { Navbar } from '@/components/navigation/Navbar'
import { getCourseList } from '@/actions/tutor'
import Link from 'next/link'
import { Plus, Edit, Eye, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DeleteCourseButton } from '@/components/tutor/DeleteCourseButton'

const SKILL_LABELS: Record<string, string> = {
  stitching: '🧵 Stitching',
  designing: '🎨 Designing',
  embroidery: '🌸 Embroidery',
  knitting: '🧶 Knitting',
  tailoring: '✂️ Tailoring',
  weaving: '🪡 Weaving',
  other: '📦 Other',
}

export default async function TutorCoursesPage() {
  const courses = await getCourseList()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Courses</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              View and edit your courses on the platform.{' '}
              <span className="font-medium text-foreground">{courses.length} total.</span>
            </p>
          </div>
          <Link
            href="/tutor/courses/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center rounded-2xl border border-dashed border-border bg-muted/10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">No courses yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first course to get started.</p>
            </div>
            <Link
              href="/tutor/courses/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/15 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Create Course
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => (
              <Card key={course.id} className="group border-border/60 overflow-hidden hover:shadow-md hover:border-border transition-all duration-200 p-0">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5">
                      <BookOpen className="h-10 w-10 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <Badge
                      variant={course.isPublished ? 'default' : 'secondary'}
                      className={`text-[10px] px-2 py-0.5 ${course.isPublished ? 'bg-emerald-500/90 text-white hover:bg-emerald-500/90' : ''}`}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    {course.isLive && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-red-500/90 text-white hover:bg-red-500/90">
                        Live
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm leading-snug truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">by {course.tutorName}</p>
                  </div>

                  {/* Category & Skill badges */}
                  {(course.categoryName || course.skill) && (
                    <div className="flex flex-wrap gap-1.5">
                      {course.categoryName && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold">
                          📂 {course.categoryName}
                        </span>
                      )}
                      {course.skill && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold">
                          {SKILL_LABELS[course.skill] || course.skill}
                        </span>
                      )}
                    </div>
                  )}

                  <Separator className="opacity-50" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Price</p>
                      <p className="font-bold text-sm mt-0.5">
                        {course.price ? `₹${course.price}` : 'Free'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/tutor/courses/${course.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/courses/${course.id}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
