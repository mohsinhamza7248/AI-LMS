import { Navbar } from '@/components/navigation/Navbar'
import { getCourseById } from '@/services/course.service'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { Play, FileText, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function WatchCoursePage({ params }: { params: { id: string } }) {
  const { id } = await params
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = await createClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  
  if (!dbUser) {
    redirect('/')
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', id)
    .eq('user_id', dbUser.id)
    .single()

  if (!enrollment) {
    redirect(`/courses/${id}`) // Redirect back to course detail if not enrolled
  }

  const course = await getCourseById(id)
  if (!course) notFound()

  // Simple player for demo. First video or fallback
  const firstVideo = course.course_content?.find((c: any) => c.type === 'video')
  const videoUrl = firstVideo?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Default fallback

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mini Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${id}`} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-lg">{course.title}</h1>
        </div>
        <div className="text-sm font-medium text-neutral-400 bg-neutral-900 px-4 py-1.5 rounded-full">
          {enrollment.progress}% Completed
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black relative">
           <div className="w-full max-w-5xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative group">
              {/* Replace with actual video player in production */}
              <iframe 
                 src={videoUrl} 
                 className="w-full h-full border-0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
              ></iframe>
           </div>
           
           <div className="w-full max-w-5xl mt-6">
              <h2 className="text-2xl font-bold">{firstVideo?.title || 'Introduction to the Course'}</h2>
              <p className="text-neutral-400 mt-2">Lesson 1 module</p>
           </div>
        </div>

        {/* Sidebar Chapters */}
        <div className="w-full lg:w-96 bg-neutral-950 border-l border-neutral-800 overflow-y-auto">
           <div className="p-6">
             <h3 className="font-bold text-xl mb-6">Course Content</h3>
             <div className="space-y-4">
                {course.course_content?.map((item: any, index: number) => (
                   <div 
                      key={item.id} 
                      className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors ${index === 0 ? 'bg-primary/20 border border-primary/30' : 'hover:bg-neutral-900 border border-transparent'}`}
                   >
                     <div className="mt-1 relative">
                       {index === 0 ? (
                         <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                       ) : null}
                       {item.type === 'video' ? <Play className={`h-5 w-5 ${index === 0 ? 'text-primary' : 'text-neutral-500'}`} /> : <FileText className={`h-5 w-5 ${index === 0 ? 'text-primary' : 'text-neutral-500'}`} />}
                     </div>
                     <div>
                       <div className={`font-bold text-sm ${index === 0 ? 'text-primary' : 'text-white'}`}>{item.title}</div>
                       <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                         {item.type === 'video' && <span>{item.duration || '5'} min</span>}
                       </div>
                     </div>
                   </div>
                ))}
                
                {(!course.course_content || course.course_content.length === 0) && (
                   <div className="text-neutral-500 text-sm italic">
                     No content available for this course yet.
                   </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
