import Link from 'next/link'
import { BookOpen, User, Star } from 'lucide-react'
import { Course } from '@/types/database.types'

export function CourseCard({ course }: { course: any }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card p-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-10 w-10 text-primary/40" />
            </div>
          )}
          {/* <div className="absolute top-3 right-3 rounded-lg bg-background/80 backdrop-blur-md px-2 py-1 text-xs font-bold shadow-sm">
            ₹{course.price}
          </div> */}
        </div>

        <div className="p-4 space-y-3">
          {/* 
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            {course.categories?.name || 'Uncategorized'}
          </div>
          */}
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>

          <div className="flex items-center justify-between pt-2 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium truncate max-w-[100px]">{course.tutors?.users?.name || 'Expert Tutor'}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-current" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
