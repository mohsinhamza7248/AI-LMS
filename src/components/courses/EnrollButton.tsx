'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { enrollCourse } from '@/actions/enrollment'
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react'

export function EnrollButton({ courseId, isEnrolled }: { courseId: string; isEnrolled: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (isEnrolled) {
    return (
      <button
        onClick={() => router.push(`/courses/${courseId}/watch`)}
        className="group w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:shadow-xl active:scale-95"
      >
        <PlayCircle className="h-5 w-5" />
        Watch Course
      </button>
    )
  }

  async function handleEnroll() {
    try {
      setLoading(true)
      await enrollCourse(courseId)
      router.push(`/courses/${courseId}/watch`)
    } catch (error) {
      console.error(error)
      alert('Failed to enroll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="group w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          Enroll for Free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  )
}
