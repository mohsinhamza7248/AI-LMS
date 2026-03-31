'use client'

import { useState } from 'react'
import { ArrowRight, Star, Zap, X, Play } from 'lucide-react'
import { getYouTubeId } from '@/lib/video-utils'
import Link from 'next/link'

export function FeaturedCoursesGrid({ courses }: { courses: any[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any, i: number) => (
          <div key={i} className="group relative">
            <Link
              href={`/courses/${course.id}`}
              className="relative rounded-3xl border bg-card/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 block cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Play Button Overlay - Now specifically for video */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    onClick={(e) => {
                      if (course.youtube_url) {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVideo(course.youtube_url);
                      }
                    }}
                    className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-lg transform hover:scale-125 transition-transform duration-300 z-10"
                  >
                    <Play className="h-6 w-6 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="flex items-center gap-1 text-sm font-bold bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {course.rating}
                  </span>
                  <span className="text-sm font-medium opacity-90">{course.students} enrolled</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Zap className="h-3 w-3 text-slate-500" />
                  </div>
                  <span>{course.instructor}</span>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                  <span className="font-black text-lg">Latest</span>
                  <div className="flex items-center justify-center h-10 w-10 border rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo)}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
