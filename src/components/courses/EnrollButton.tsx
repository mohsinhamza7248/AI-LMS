'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { enrollCourse } from '@/actions/enrollment'
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react'

export function EnrollButton({ courseId, isEnrolled }: { courseId: string, isEnrolled: boolean }) {
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
      router.push(`/courses/${courseId}/watch`) // Or refresh
    } catch (error) {
      console.error(error)
      alert("Failed to enroll")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleEnroll}
      disabled={loading}
      className="group w-full flex items-center justify-center gap-2 rounded-full bg-primary py-5 text-xl font-bold text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100"
    >
      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
        <>
          Enroll Now
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  )
}
