'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse } from '@/actions/course'
import { Navbar } from '@/components/navigation/Navbar'
import { ArrowLeft, Loader2, BookOpen, FileText, DollarSign, Tag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SKILL_OPTIONS = [
  { value: '', label: '— Select a skill —' },
  { value: 'stitching', label: '🧵 Stitching' },
  { value: 'designing', label: '🎨 Designing' },
  { value: 'embroidery', label: '🌸 Embroidery' },
  { value: 'knitting', label: '🧶 Knitting' },
  { value: 'tailoring', label: '✂️ Tailoring' },
  { value: 'weaving', label: '🪡 Weaving' },
  { value: 'other', label: '📦 Other' },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')

  // Fetch categories for dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCategories(d) })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)

    try {
      const courseId = await createCourse({
        title,
        description,
        price,
        category_id: selectedCategory || null,
        skill: selectedSkill || null,
      })
      router.push(`/tutor/courses/${courseId}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-10 rounded-lg border border-border/60 bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all'
  const selectClass =
    'w-full h-10 rounded-lg border border-border/60 bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer'
  const textareaClass =
    'w-full min-h-[110px] rounded-lg border border-border/60 bg-background px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16 max-w-2xl">
        {/* Back link */}
        <Link
          href="/tutor/courses"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <Card className="border-border/60 shadow-sm p-0">
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Create New Course</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Set up the basics of your new course.</p>
              </div>
            </div>
          </CardHeader>

          <Separator className="mt-5" />

          <CardContent className="px-6 py-6">
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm font-medium mb-5 border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <FileText className="h-3.5 w-3.5" /> Course Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className={inputClass}
                  placeholder="e.g. Advanced Stitching Masterclass"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <FileText className="h-3.5 w-3.5" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className={textareaClass}
                  placeholder="What will students learn? Describe the course content, goals, and prerequisites..."
                />
              </div>

              {/* Category & Skill row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic">No categories found. You can add them later.</p>
                  )}
                </div>

                {/* Skill */}
                <div className="space-y-1.5">
                  <label htmlFor="skill" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <Sparkles className="h-3.5 w-3.5" /> Skill
                  </label>
                  <select
                    id="skill"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className={selectClass}
                  >
                    {SKILL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label htmlFor="price" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                  <DollarSign className="h-3.5 w-3.5" /> Price (₹) <span className="text-muted-foreground font-normal">· enter 0 for free</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <Separator className="opacity-50" />

              <div className="flex items-center justify-end gap-3 pt-1">
                <Link
                  href="/tutor/courses"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create & Continue →
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
