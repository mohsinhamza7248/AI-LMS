import { Navbar } from '@/components/navigation/Navbar'
import { getCourseById } from '@/services/course.service'
import { Play, FileText, CheckCircle, ArrowRight, ShieldCheck, Globe } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EnrollButton } from '@/components/courses/EnrollButton'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = (await getCourseById(id)) as any

  if (!course) notFound()

  const { userId } = await auth()
  let isEnrolled = false
  if (userId) {
    const supabase = await createClient()
    const { data: dbUser } = await supabase.from('users').select('id').eq('clerk_id', userId).single() as any
    if (dbUser) {
      const { data: enrollment } = await supabase.from('enrollments').select('id').eq('course_id', id).eq('user_id', dbUser.id).single() as any
      if (enrollment) isEnrolled = true
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="space-y-4">
              {/* 
               <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest">
                  {course.categories?.name}
               </div>
               */}
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{course.title}</h1>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>by {course.tutors?.users?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            {/* Video Player */}
            {(() => {
              const firstVideo = course.course_content?.find((item: any) => item.type === 'video') || course.course_content?.[0]
              if (firstVideo?.url) {
                const getYouTubeId = (url: string) => {
                  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
                  return match ? match[1] : null
                }
                const ytId = getYouTubeId(firstVideo.url)

                return (
                  <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl border-4 border-card">
                    {ytId ? (
                      <iframe
                        className="h-full w-full border-0"
                        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        controls
                        className="h-full w-full object-contain"
                        src={firstVideo.url}
                        poster={course.thumbnail_url || undefined}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )
              }
              return (
                <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl group border-4 border-card">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt="Thumbnail" className="h-full w-full object-cover opacity-60" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 cursor-pointer">
                        <Play className="h-10 w-10 text-primary fill-current" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 text-white text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                    Preview Sample Lesson
                  </div>
                </div>
              )
            })()}

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold">About this course</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Course Content</h2>
              <div className="divide-y rounded-3xl border bg-card overflow-hidden">
                {course.course_content?.length > 0 ? (
                  course.course_content.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {item.type === 'video' ? <Play className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <span className="font-bold">{item.title}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Preview Available</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No content uploaded yet for this course.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enrollment Sidebar */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700 delay-300">
            <div className="sticky top-24 rounded-3xl border bg-card p-8 shadow-xl">
              <div className="mb-8">
                {/* <div className="text-sm font-medium text-muted-foreground mb-2">One-time payment</div> */}
                <div className="text-5xl font-extrabold tracking-tight">Free</div>
              </div>

              <div className="space-y-4">
                <EnrollButton courseId={id} isEnrolled={isEnrolled} />
                {/* <p className="text-center text-sm text-muted-foreground">30-day money-back guarantee</p> */}
              </div>

              <div className="mt-8 space-y-6 pt-8 border-t">
                <h3 className="font-bold">This course includes:</h3>
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, text: 'Full lifetime access' },
                    { icon: Globe, text: 'Access on mobile and TV' },
                    { icon: CheckCircle, text: 'Certificate of completion' }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function User(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )
}
