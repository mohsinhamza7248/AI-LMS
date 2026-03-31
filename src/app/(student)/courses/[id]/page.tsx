import { Navbar } from '@/components/navigation/Navbar'
import { getCourseById } from '@/services/course.service'
import { Play, CheckCircle, ShieldCheck, Globe, Tag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EnrollButton } from '@/components/courses/EnrollButton'
import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = (await getCourseById(id)) as any

  if (!course) notFound()

  const { userId } = await auth()
  let isEnrolled = false
  if (userId) {
    const supabase = createAdminClient()
    const { data: dbUser } = await supabase.from('users').select('id').eq('clerk_id', userId).single() as any
    if (dbUser) {
      const { data: enrollment } = await supabase.from('enrollments').select('id').eq('course_id', id).eq('user_id', dbUser.id).single() as any
      if (enrollment) isEnrolled = true
    }
  }

  const tutorName = course.tutors?.users?.name || 'Expert Tutor'
  const categoryName = course.categories?.name || null
  const skillLabel = course.skill ? (SKILL_LABELS[course.skill] || course.skill) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-20">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom duration-500">

            {/* Title block */}
            <div className="space-y-4">
              {/* Category + Skill chips */}
              {(categoryName || skillLabel) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {categoryName && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1 text-xs font-semibold">
                      <Tag className="h-3 w-3" />
                      {categoryName}
                    </span>
                  )}
                  {skillLabel && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-3 py-1 text-xs font-semibold">
                      <Sparkles className="h-3 w-3" />
                      {skillLabel}
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{course.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={course.tutors?.users?.avatar} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {tutorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>by <span className="font-semibold text-foreground">{tutorName}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Certificate included</span>
                </div>
                <Badge variant="secondary" className="rounded-full text-xs">Free</Badge>
              </div>
            </div>

            {/* Video Player */}
            {(() => {
              const firstVideo = course.course_content?.[0]
              if (firstVideo?.url) {
                const getYouTubeId = (url: string) => {
                  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
                  return match ? match[1] : null
                }
                const getVimeoId = (url: string) => {
                  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
                  return match ? match[1] : null
                }
                const ytId = getYouTubeId(firstVideo.url)
                const vimeoId = getVimeoId(firstVideo.url)

                return (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-border/30">
                    {ytId ? (
                      <iframe
                        className="h-full w-full border-0"
                        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : vimeoId ? (
                      <iframe
                        className="h-full w-full border-0"
                        src={`https://player.vimeo.com/video/${vimeoId}`}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video controls className="h-full w-full object-contain" src={firstVideo.url} poster={course.thumbnail_url || undefined}>
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )
              }
              return (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 shadow-xl ring-1 ring-border/30 group cursor-pointer">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt="Thumbnail" className="h-full w-full object-cover opacity-70" />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 text-white fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                    Preview Sample Lesson
                  </div>
                </div>
              )
            })()}

            {/* About */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold">About this course</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            <Separator />

            {/* Course Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Course Content</h2>
              <Card className="border-border/60 p-0 overflow-hidden">
                {course.course_content?.length > 0 ? (
                  course.course_content.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Play className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium flex-1 min-w-0 truncate">{item.title}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">Preview</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No content uploaded yet for this course.
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* ── Enrollment Sidebar ── */}
          <div className="animate-in fade-in slide-in-from-right duration-500 delay-150">
            <div className="sticky top-24">
              <Card className="border-border/60 shadow-lg p-0">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Course Price</p>
                    <div className="text-4xl font-bold tracking-tight">
                      {course.price ? `₹${course.price}` : 'Free'}
                    </div>
                  </div>

                  <EnrollButton courseId={id} isEnrolled={isEnrolled} />

                  <Separator />

                  {/* Category & Skill in sidebar */}
                  {(categoryName || skillLabel) && (
                    <>
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Course Tags</p>
                        <div className="flex flex-col gap-2">
                          {categoryName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Tag className="h-4 w-4 text-blue-500 shrink-0" />
                              <span>
                                Category:{' '}
                                <span className="font-semibold text-foreground">{categoryName}</span>
                              </span>
                            </div>
                          )}
                          {skillLabel && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
                              <span>
                                Skill:{' '}
                                <span className="font-semibold text-foreground">{skillLabel}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm font-semibold">This course includes:</p>
                    {[
                      { icon: ShieldCheck, text: 'Full lifetime access' },
                      { icon: Globe, text: 'Access on mobile and TV' },
                      { icon: CheckCircle, text: 'Certificate of completion' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <feature.icon className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
