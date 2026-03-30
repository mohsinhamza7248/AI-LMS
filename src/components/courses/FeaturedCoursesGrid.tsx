'use client'

import { useState } from 'react'
import { ArrowRight, Star, X, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function FeaturedCoursesGrid({ courses }: { courses: any[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any, i: number) => (
          <Card
            key={i}
            onClick={() => { if (course.youtube_url) setSelectedVideo(course.youtube_url) }}
            className="group border-border/60 bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 p-0"
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-xl shadow-black/20 transition-transform duration-200 group-hover:scale-110">
                  <Play className="h-5 w-5 text-primary fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {course.rating}
                </span>
                <span className="text-xs text-white/80 font-medium">{course.students} enrolled</span>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                      {course.instructor?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate max-w-[110px]">{course.instructor}</span>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </CardContent>
          </Card>
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
              src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo)}?autoplay=1`}
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
