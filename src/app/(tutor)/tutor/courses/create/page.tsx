'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse } from '@/actions/course'
import { Navbar } from '@/components/navigation/Navbar'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)

    try {
      const courseId = await createCourse({ title, description, price })
      router.push(`/dashboard/courses/${courseId}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12 max-w-3xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="bg-card border rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-extrabold mb-2">Create New Course</h1>
          <p className="text-muted-foreground mb-8 text-lg">Set up the basics of your new course.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold block">Course Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Advanced AI Integration"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold block">Course Description</label>
              <textarea 
                id="description" 
                name="description" 
                required 
                rows={4}
                className="w-full flex min-h-[120px] rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="What will students learn?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-bold block">Price (₹)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                min="0"
                step="0.01"
                required 
                className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="49.99"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-primary-foreground font-bold shadow-lg transition-all hover:bg-primary/90 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Course & Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
