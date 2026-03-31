import Link from 'next/link'
import { BookOpen, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const SKILL_LABELS: Record<string, string> = {
  stitching: '🧵 Stitching',
  designing: '🎨 Designing',
  embroidery: '🌸 Embroidery',
  knitting: '🧶 Knitting',
  tailoring: '✂️ Tailoring',
  weaving: '🪡 Weaving',
  other: '📦 Other',
}

export function CourseCard({ course }: { course: any }) {
  const tutorName = course.tutors?.users?.name || 'Expert Tutor'
  const initials = tutorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const categoryName = course.categories?.name || null
  const skill = course.skill ? (SKILL_LABELS[course.skill] || course.skill) : null

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <Card className="overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
              <BookOpen className="h-10 w-10 text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Skill badge on thumbnail */}
          {skill && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 text-[10px] font-semibold">
                {skill}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Category pill */}
          {categoryName && (
            <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold">
              📂 {categoryName}
            </span>
          )}

          <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={course.tutors?.users?.avatar} />
                <AvatarFallback className="text-[10px] bg-muted">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">{tutorName}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold">4.8</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
