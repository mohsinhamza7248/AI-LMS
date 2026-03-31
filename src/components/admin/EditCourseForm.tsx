'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  updateCourse,
  addLecture,
  deleteLecture,
  reorderLectures,
} from '@/actions/admin'
import {
  Loader2,
  Save,
  ArrowLeft,
  ImagePlus,
  VideoIcon,
  Trash2,
  GripVertical,
  Play,
  CheckCircle2,
  UploadCloud,
  Settings,
  Tag,
  Sparkles,
  Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Lecture = {
  id: string
  title: string
  url: string
  order_index: number
  created_at: string
}

type Course = {
  id: string
  title: string
  description: string
  price: number
  is_published: boolean
  is_live: boolean
  thumbnail_url?: string | null
  skill?: string | null
  category_id?: string | null
  categories?: { id: string; name: string } | null
}

// ─────────────────────────────────────────────────────────
// Cloudinary direct-upload helper
// ─────────────────────────────────────────────────────────

async function uploadToCloudinary(
  file: File,
  type: 'image' | 'video',
  onProgress: (pct: number) => void
): Promise<string> {
  const res = await fetch(`/api/upload?type=${type}`)
  const { signature, timestamp, cloudName, apiKey, folder } = await res.json()

  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', apiKey)
  fd.append('timestamp', String(timestamp))
  fd.append('signature', signature)
  fd.append('folder', folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.secure_url as string)
      } else {
        reject(new Error('Upload failed: ' + xhr.responseText))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(fd)
  })
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

export default function EditCourseForm({
  course,
  initialContent,
}: {
  course: Course
  initialContent: Lecture[]
}) {
  const router = useRouter()

  // ── Panel A: Details
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description || '')
  const [price, setPrice] = useState(course.price || 0)
  const [isPublished, setIsPublished] = useState(course.is_published)
  const [isLive, setIsLive] = useState(course.is_live)
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsMsg, setDetailsMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // ── Category & Skill
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState(course.category_id || '')
  const isPredefinedSkill = SKILL_OPTIONS.some(opt => opt.value === course.skill && opt.value !== '' && opt.value !== 'other')
  const [selectedSkill, setSelectedSkill] = useState(isPredefinedSkill ? (course.skill || '') : (course.skill ? 'other' : ''))
  const [customSkill, setCustomSkill] = useState(isPredefinedSkill ? '' : (course.skill || ''))

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCategories(d) })
      .catch(() => {})
  }, [])

  // ── Panel B: Thumbnail
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(course.thumbnail_url ?? null)
  const [thumbProgress, setThumbProgress] = useState(0)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [thumbError, setThumbError] = useState('')

  // ── Panel C: Lectures
  const [lectures, setLectures] = useState<Lecture[]>(initialContent)
  const [newLectureTitle, setNewLectureTitle] = useState('')
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'link'>('upload')
  const [externalUrl, setExternalUrl] = useState('')
  const [lectureFile, setLectureFile] = useState<File | null>(null)
  const [lectureProgress, setLectureProgress] = useState(0)
  const [lectureUploading, setLectureUploading] = useState(false)
  const [lectureError, setLectureError] = useState('')
  const lectureFileRef = useRef<HTMLInputElement>(null)

  // Dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // drag state
  const dragId = useRef<string | null>(null)

  // ─────────────────────────────────────────────────────
  // Panel A – Save details
  // ─────────────────────────────────────────────────────

  async function handleSaveDetails() {
    setSavingDetails(true)
    setDetailsMsg(null)
    try {
      await updateCourse(course.id, {
        title,
        description,
        price: Number(price),
        is_published: isPublished,
        is_live: isLive,
        category_id: selectedCategory || null,
        skill: selectedSkill === 'other' ? customSkill : (selectedSkill || null),
      })
      setDetailsMsg({ ok: true, text: 'Course details saved!' })
      router.refresh()
    } catch (err: any) {
      setDetailsMsg({ ok: false, text: err.message || 'Failed to save' })
    } finally {
      setSavingDetails(false)
    }
  }

  // ─────────────────────────────────────────────────────
  // Panel B – Thumbnail upload
  // ─────────────────────────────────────────────────────

  const onDropThumbnail = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      setThumbError('')
      setThumbUploading(true)
      setThumbProgress(0)
      try {
        const url = await uploadToCloudinary(file, 'image', setThumbProgress)
        setThumbnailUrl(url)
        await updateCourse(course.id, {
          title,
          description,
          price: Number(price),
          is_published: isPublished,
          is_live: isLive,
          thumbnail_url: url,
          category_id: selectedCategory || null,
          skill: selectedSkill === 'other' ? customSkill : (selectedSkill || null),
        })
        router.refresh()
      } catch (err: any) {
        setThumbError(err.message || 'Upload failed')
      } finally {
        setThumbUploading(false)
      }
    },
    [course.id, title, description, price, isPublished, isLive, selectedCategory, selectedSkill, customSkill, router]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: thumbUploading,
  })

  // ─────────────────────────────────────────────────────
  // Panel C – Add lecture
  // ─────────────────────────────────────────────────────

  async function handleAddLecture(e: React.FormEvent) {
    e.preventDefault()
    if (!newLectureTitle.trim()) return

    let url = ''
    if (videoSourceType === 'upload') {
      if (!lectureFile) { setLectureError('Please select a video file'); return }
      setLectureError('')
      setLectureUploading(true)
      setLectureProgress(0)
      try {
        url = await uploadToCloudinary(lectureFile, 'video', setLectureProgress)
      } catch (err: any) {
        setLectureError(err.message || 'Upload failed')
        setLectureUploading(false)
        return
      }
    } else {
      if (!externalUrl.trim()) { setLectureError('Please provide a video URL'); return }
      url = externalUrl.trim()
    }

    try {
      const order_index = lectures.length
      await addLecture(course.id, { title: newLectureTitle.trim(), url, order_index })
      setLectures((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          title: newLectureTitle.trim(),
          url,
          order_index,
          created_at: new Date().toISOString(),
        },
      ])
      setNewLectureTitle('')
      setLectureFile(null)
      setExternalUrl('')
      if (lectureFileRef.current) lectureFileRef.current.value = ''
      router.refresh()
    } catch (err: any) {
      setLectureError(err.message || 'Failed to add lecture')
    } finally {
      setLectureUploading(false)
      setLectureProgress(0)
    }
  }

  async function performDeleteLecture() {
    if (!deleteId) return
    try {
      await deleteLecture(deleteId, course.id)
      setLectures((prev) => {
        const updated = prev
          .filter((l) => l.id !== deleteId)
          .map((l, i) => ({ ...l, order_index: i }))
        return updated
      })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeleteId(null)
    }
  }

  function handleDragStart(id: string) { dragId.current = id }

  function handleDrop(targetId: string) {
    if (!dragId.current || dragId.current === targetId) return
    const from = lectures.findIndex((l) => l.id === dragId.current)
    const to = lectures.findIndex((l) => l.id === targetId)
    if (from === -1 || to === -1) return
    const reordered = [...lectures]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const withIndex = reordered.map((l, i) => ({ ...l, order_index: i }))
    setLectures(withIndex)
    reorderLectures(withIndex.map((l) => ({ id: l.id, order_index: l.order_index })))
    dragId.current = null
  }

  const selectClass =
    'w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer'

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full h-12 w-12 border-border/60 hover:bg-muted"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studio · Edit Course</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Polishing your masterpiece: manage details, media and curriculum.
          </p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-full border border-border/40 grid grid-cols-2 max-w-[400px]">
          <TabsTrigger value="basic" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Curriculum
          </TabsTrigger>
        </TabsList>

        {/* ════════════════════════════════════
            TAB 1: BASIC INFORMATION
            ════════════════════════════════════ */}
        <TabsContent value="basic" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN ──────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Course Settings Card ── */}
              <Card className="border-border/60 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Settings className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">Course Settings</CardTitle>
                  </div>
                  <CardDescription>Update the primary information and status of your course.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl focus-visible:ring-primary/20"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                    <Textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl focus-visible:ring-primary/20 resize-none min-h-[150px]"
                      placeholder="Whet their appetite with a compelling description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Tag className="h-3.5 w-3.5" /> Category
                      </Label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">— No category —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {categories.length === 0 && (
                        <p className="text-[10px] text-muted-foreground italic">No categories found for this tenant.</p>
                      )}
                    </div>

                    {/* Skill */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" /> Skill
                      </Label>
                      <select
                        value={selectedSkill}
                        onChange={(e) => {
                          setSelectedSkill(e.target.value)
                          if (e.target.value !== 'other') setCustomSkill('')
                        }}
                        className={selectClass}
                      >
                        {SKILL_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      {selectedSkill === 'other' && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <Input
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            placeholder="Enter skill name (e.g. Pottery)"
                            className="h-10 rounded-xl focus-visible:ring-primary/20"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                        <div className="space-y-1">
                          <Label className="text-sm font-bold">Published Status</Label>
                          <p className="text-xs text-muted-foreground">Make course visible to all students</p>
                        </div>
                        <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                        <div className="space-y-1">
                          <Label className="text-sm font-bold">Live Batch Mode</Label>
                          <p className="text-xs text-muted-foreground">Enable interactivity & live sessions</p>
                        </div>
                        <Switch
                          checked={isLive}
                          onCheckedChange={setIsLive}
                          className="data-[state=checked]:bg-destructive"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course Fee (₹)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="h-11 rounded-xl focus-visible:ring-primary/20 pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2 italic">Set to 0 for free courses.</p>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="p-6 flex items-center justify-between">
                  {detailsMsg && (
                    <div className={`flex items-center gap-2 text-sm font-medium ${detailsMsg.ok ? 'text-emerald-500' : 'text-destructive'}`}>
                      {detailsMsg.ok
                        ? <CheckCircle2 className="h-4 w-4" />
                        : <Loader2 strokeWidth={3} className="h-4 w-4 animate-spin" />}
                      {detailsMsg.text}
                    </div>
                  )}
                  <div />
                  <Button
                    onClick={handleSaveDetails}
                    disabled={savingDetails}
                    className="rounded-full px-8 h-11 bg-primary hover:bg-primary/90 font-bold"
                  >
                    {savingDetails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Changes
                  </Button>
                </CardFooter>
              </Card>

            </div>

            {/* RIGHT COLUMN – Thumbnail ── */}
            <section className="p-6 bg-card rounded-3xl border shadow-sm h-fit">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-primary" />
                Thumbnail
              </h2>

              {thumbnailUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-muted">
                  <img src={thumbnailUrl} alt="Course thumbnail" className="w-full h-full object-cover" />
                </div>
              )}

              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-colors text-center ${isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 hover:border-primary hover:bg-muted/30'
                  } ${thumbUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {isDragActive
                    ? 'Drop image here…'
                    : thumbnailUrl
                      ? 'Drop new image to replace'
                      : 'Drop image or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP · Max 10 MB</p>
              </div>

              {thumbUploading && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    <span>Uploading</span>
                    <span>{thumbProgress}%</span>
                  </div>
                  <Progress value={thumbProgress} className="h-1.5" />
                </div>
              )}

              {thumbError && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 text-center">
                  {thumbError}
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        {/* ════════════════════════════════════
            TAB 2: CURRICULUM
            ════════════════════════════════════ */}
        <TabsContent value="curriculum" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <VideoIcon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Course Curriculum</CardTitle>
              </div>
              <CardDescription>Add lectures in order. Drag handles to reorder.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {/* Lecture list */}
              {lectures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                  <VideoIcon className="h-10 w-10 opacity-20" />
                  <p>No lectures yet. Add your first lecture below.</p>
                </div>
              ) : (
                <ul className="space-y-2 mb-6">
                  {lectures.map((lecture, idx) => (
                    <li
                      key={lecture.id}
                      draggable
                      onDragStart={() => handleDragStart(lecture.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(lecture.id)}
                      className="flex items-center gap-3 p-3 rounded-2xl border bg-background hover:bg-muted/30 transition-colors group cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium truncate">{lecture.title}</span>
                      <a
                        href={lecture.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="Preview video"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setDeleteId(lecture.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete lecture"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Lecture Form */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-bold mb-4 text-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Lecture
                </h3>
                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Lecture Title
                    </label>
                    <input
                      type="text"
                      value={newLectureTitle}
                      onChange={(e) => setNewLectureTitle(e.target.value)}
                      placeholder="e.g. Introduction to the Course"
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex p-1 bg-muted rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => setVideoSourceType('upload')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${videoSourceType === 'upload'
                          ? 'bg-background shadow-sm text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Upload Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSourceType('link')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${videoSourceType === 'link'
                          ? 'bg-background shadow-sm text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        S3 / External Link
                      </button>
                    </div>

                    {videoSourceType === 'upload' ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Video File
                        </label>
                        <label
                          htmlFor="lecture-video"
                          className={`flex items-center gap-3 h-12 w-full rounded-xl border border-dashed border-muted-foreground/40 bg-background px-4 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:bg-muted/20 transition-colors ${lectureUploading ? 'opacity-60 pointer-events-none' : ''}`}
                        >
                          <VideoIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {lectureFile ? lectureFile.name : 'Choose video (.mp4, .mov, .webm…)'}
                          </span>
                        </label>
                        <input
                          ref={lectureFileRef}
                          id="lecture-video"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => setLectureFile(e.target.files?.[0] ?? null)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Video URL (S3, YouTube, Vimeo, etc.)
                        </label>
                        <input
                          type="url"
                          value={externalUrl}
                          onChange={(e) => setExternalUrl(e.target.value)}
                          placeholder="https://psa-bucket.s3.amazonaws.com/video.mp4"
                          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                          Supports direct links (MP4, WebM) and YouTube/Vimeo embeds.
                        </p>
                      </div>
                    )}
                  </div>

                  {lectureUploading && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Uploading video… {lectureProgress}%</p>
                      <Progress value={lectureProgress} className="h-1.5" />
                    </div>
                  )}

                  {lectureError && (
                    <p className="text-red-500 text-xs">{lectureError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      lectureUploading ||
                      !newLectureTitle.trim() ||
                      (videoSourceType === 'upload' && !lectureFile) ||
                      (videoSourceType === 'link' && !externalUrl.trim())
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    {lectureUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                    {lectureUploading ? 'Uploading…' : videoSourceType === 'upload' ? 'Upload & Add Lecture' : 'Save & Add Lecture'}
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lecture?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The lecture will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDeleteLecture} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
