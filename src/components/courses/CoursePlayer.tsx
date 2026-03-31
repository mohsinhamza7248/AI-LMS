'use client'

import { useState } from 'react'
import { Play, FileText, CheckCircle, ChevronRight, Lock } from 'lucide-react'

interface CoursePlayerProps {
  course: any
  enrollment: any
}

export function CoursePlayer({ course, enrollment }: CoursePlayerProps) {
  const [activeLecture, setActiveLecture] = useState(course.course_content?.[0] || null)

  const getYouTubeId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : null
  }
  const getVimeoId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
    return match ? match[1] : null
  }

  const ytId = activeLecture?.url ? getYouTubeId(activeLecture.url) : null
  const vimeoId = activeLecture?.url ? getVimeoId(activeLecture.url) : null

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 bg-black relative overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="aspect-video w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative group border border-white/5">
            {!activeLecture?.url ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <Play className="h-16 w-16 opacity-20 mb-4 animate-pulse" />
                <p className="text-lg font-medium">No video content for this lesson.</p>
              </div>
            ) : ytId ? (
              <iframe 
                src={`https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1`} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : vimeoId ? (
              <iframe 
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`} 
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={activeLecture.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight">{activeLecture?.title || 'Course Content'}</h2>
              <button className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-bold border border-white/10">
                <CheckCircle className="h-4 w-4" />
                Mark as Complete
              </button>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl">
              Watching: {activeLecture?.title}. Join our community to discuss this lesson with other students.
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar - Course Curriculum */}
      <div className="w-full lg:w-[400px] bg-neutral-950 border-l border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 space-y-4">
          <h3 className="font-black text-xl">Curriculum</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
              <span>Your Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {course.course_content?.map((item: any, index: number) => {
              const isActive = activeLecture?.id === item.id;
              return (
                <div 
                  key={item.id} 
                  onClick={() => setActiveLecture(item)}
                  className={`group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                    ? 'bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5' 
                    : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-neutral-900 text-neutral-500 group-hover:bg-neutral-800'
                  }`}>
                    {isActive ? <Play className="h-4 w-4 fill-current" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm leading-tight truncate ${isActive ? 'text-primary' : 'text-neutral-200'}`}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration || '5:00'}
                      </span>
                      {isActive && <span className="text-primary font-black animate-pulse">Playing Now</span>}
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 mt-2 transition-transform ${isActive ? 'text-primary translate-x-1' : 'text-neutral-700 group-hover:text-neutral-500'}`} />
                </div>
              );
            })}
            
            {(!course.course_content || course.course_content.length === 0) && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
                <Lock className="h-12 w-12 opacity-10 mb-4" />
                <p className="text-sm italic font-medium">No lectures uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )
}
