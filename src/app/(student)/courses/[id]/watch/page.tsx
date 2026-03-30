import { getCourseById } from '@/services/course.service'
import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CoursePlayer } from '@/components/courses/CoursePlayer'

export default async function WatchCoursePage({ params }: { params: { id: string } }) {
  const { id } = await params
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = createAdminClient()
  const { data: dbUser } = (await supabase.from('users').select('id').eq('clerk_id', userId).single()) as any
  
  if (!dbUser) {
    redirect('/')
  }

  // Verify enrollment
  const { data: enrollment } = (await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', id)
    .eq('user_id', dbUser.id)
    .single()) as any

  if (!enrollment) {
    redirect(`/courses/${id}`)
  }

  const course = await getCourseById(id)
  if (!course) notFound()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Mini Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-neutral-950 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <Link 
            href={`/courses/${id}`} 
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors border border-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="font-black text-lg tracking-tight leading-none">{course.title}</h1>
            <p className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">Studying at AI-LMS Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-1">Your Mastery</span>
              <div className="flex items-center gap-3">
                 <div className="h-1 w-32 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary" style={{ width: `${enrollment.progress}%` }} />
                 </div>
                 <span className="text-sm font-black text-primary">{enrollment.progress}%</span>
              </div>
           </div>
           <Link href="/my-learning">
              <button className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-black uppercase transition-all tracking-widest active:scale-95">
                Dashboard
              </button>
           </Link>
        </div>
      </div>

      <CoursePlayer course={course} enrollment={enrollment} />
    </div>
  )
}
