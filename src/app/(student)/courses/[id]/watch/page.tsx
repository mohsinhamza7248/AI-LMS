import { getCourseById } from '@/services/course.service'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { Play, FileText, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function WatchCoursePage({ params }: { params: { id: string } }) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) redirect('/sign-in')

  const supabase = await createClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('clerk_id', userId).single()

  if (!dbUser) redirect('/')

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', id)
    .eq('user_id', dbUser.id)
    .single()

  if (!enrollment) redirect(`/courses/${id}`)

  const course = await getCourseById(id)
  if (!course) notFound()

  const firstVideo = course.course_content?.find((c: any) => c.type === 'video')
  const videoUrl = firstVideo?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f0f17] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${id}`}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-white/70" />
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="font-semibold text-sm text-white/90 truncate max-w-[300px] lg:max-w-none">{course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-white/10 text-white/70 border-0 text-xs hover:bg-white/10">
            {enrollment.progress || 0}% complete
          </Badge>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Main Video */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
              <iframe
                src={videoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="px-8 pb-6 max-w-5xl mx-auto w-full">
            <h2 className="text-lg font-semibold">{firstVideo?.title || 'Introduction to the Course'}</h2>
            <p className="text-white/40 text-sm mt-1">Lesson 1 · Module 1</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 border-l border-white/10 bg-[#0f0f17] overflow-y-auto shrink-0">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-sm text-white/90">Course Content</h3>
            <p className="text-xs text-white/40 mt-0.5">{course.course_content?.length || 0} lessons</p>
          </div>

          <div className="divide-y divide-white/5">
            {course.course_content?.map((item: any, index: number) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                  index === 0
                    ? 'bg-primary/15 border-l-2 border-primary'
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  index === 0 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/30'
                }`}>
                  {index === 0 ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : item.type === 'video' ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${index === 0 ? 'text-white' : 'text-white/60'}`}>
                    {item.title}
                  </p>
                  {item.duration && (
                    <p className="text-xs text-white/30 mt-0.5">{item.duration} min</p>
                  )}
                </div>
                {index < 1 && (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                )}
              </div>
            ))}

            {(!course.course_content || course.course_content.length === 0) && (
              <p className="px-4 py-6 text-sm text-white/30 italic text-center">
                No content available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
