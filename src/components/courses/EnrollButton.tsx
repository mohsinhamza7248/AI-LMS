'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { enrollCourse } from '@/actions/enrollment'
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react'

export function EnrollButton({ courseId, isEnrolled }: { courseId: string; isEnrolled: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const { userId } = useAuth()
  const [loading, setLoading] = useState(false)

  if (isEnrolled) {
    return (
      <button
        onClick={() => router.push(`/courses/${courseId}/watch`)}
        className="group w-full flex items-center justify-center gap-2 rounded-full bg-primary py-5 text-xl font-bold text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
      >
        Continue
        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
      </button>
    )
  }

  async function handleEnroll() {
    if (!userId) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`)
      return
    }

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
