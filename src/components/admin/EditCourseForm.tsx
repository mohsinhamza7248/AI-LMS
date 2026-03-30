'use client'

import { useState, useCallback, useRef } from 'react'
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
  Layers,
  Settings,
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
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`
    )
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

  // ── Panel B: Thumbnail
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    course.thumbnail_url ?? null
  )
  const [thumbProgress, setThumbProgress] = useState(0)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [thumbError, setThumbError] = useState('')

  // ── Panel C: Lectures
  const [lectures, setLectures] = useState<Lecture[]>(initialContent)
  const [newLectureTitle, setNewLectureTitle] = useState('')
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
        })
        router.refresh()
      } catch (err: any) {
        setThumbError(err.message || 'Upload failed')
      } finally {
        setThumbUploading(false)
      }
    },
    [course.id, title, description, price, isPublished, isLive, router]
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
    if (!lectureFile) { setLectureError('Please select a video file'); return }

    setLectureError('')
    setLectureUploading(true)
    setLectureProgress(0)

    try {
      const url = await uploadToCloudinary(lectureFile, 'video', setLectureProgress)
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
      if (lectureFileRef.current) lectureFileRef.current.value = ''
      router.refresh()
    } catch (err: any) {
      setLectureError(err.message || 'Upload failed')
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

  // ── Drag-reorder ─────────────────────────────────────

  function handleDragStart(id: string) {
    dragId.current = id
  }

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

        {/* ════════════════════════════════════════════════
            TAB 1: BASIC INFORMATION
            ════════════════════════════════════════════════ */}
        <TabsContent value="basic" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DETAILS */}
            <Card className="lg:col-span-2 border-border/60 shadow-md">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold">Published Status</Label>
                        <p className="text-xs text-muted-foreground">Make course visible to all students</p>
                      </div>
                      <Switch
                        checked={isPublished}
                        onCheckedChange={setIsPublished}
                      />
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
                    {detailsMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 strokeWidth={3} className="h-4 w-4 animate-spin" />}
                    {detailsMsg.text}
                  </div>
                )}
                <div />
                <Button
                  onClick={handleSaveDetails}
                  disabled={savingDetails}
                  className="rounded-full px-8 h-11 bg-primary hover:bg-primary/90 font-bold"
                >
                  {savingDetails ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save All Changes
                </Button>
              </CardFooter>
            </Card>

            {/* THUMBNAIL */}
            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Thumbnail</CardTitle>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-muted border border-border/40 aspect-video group">
                  {thumbnailUrl ? (
                    <>
                      <img
                        src={thumbnailUrl}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="rounded-full shadow-lg">Change Image</Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <ImagePlus className="h-10 w-10 opacity-20" />
                      <p className="text-xs font-medium">No thumbnail set</p>
                    </div>
                  )}
                </div>

                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                      : 'border-border hover:border-primary hover:bg-muted/50'
                  } ${thumbUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-primary scale-110' : 'text-muted-foreground/50'} transition-all`} />
                  <div className="text-center">
                    <p className="text-sm font-bold">
                      {thumbUploading ? 'Processing File...' : isDragActive ? 'Drop it now!' : 'Click to Upload Thumbnail'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 1280×720 (16:9)</p>
                  </div>
                </div>

                {thumbUploading && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Uploading Media</span>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ════════════════════════════════════════════════
            TAB 2: CURRICULUM
            ════════════════════════════════════════════════ */}
        <TabsContent value="curriculum" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LECTURE LIST */}
            <Card className="lg:col-span-2 border-border/60 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                      <Layers className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">Module Curriculum</CardTitle>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3">{lectures.length} lessons</Badge>
                </div>
                <CardDescription>Organize your course content. Drag and drop to reorder the learning flow.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {lectures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed border-border rounded-2xl gap-4">
                    <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center shadow-inner">
                      <VideoIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold">No curriculum yet</p>
                      <p className="text-xs text-muted-foreground px-10">Add your first lecture using the form on the right to start building your course.</p>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {lectures.map((lecture, idx) => (
                      <li
                        key={lecture.id}
                        draggable
                        onDragStart={() => handleDragStart(lecture.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(lecture.id)}
                        className="flex items-center gap-4 p-3.5 rounded-2xl border bg-card hover:bg-accent/5 transition-all group cursor-grab active:cursor-grabbing border-border/60 hover:border-primary/40 hover:shadow-sm"
                      >
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors shrink-0">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                             <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">Lesson {idx + 1}</span>
                             {idx === 0 && <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Free Preview</span>}
                          </span>
                          <span className="text-sm font-bold truncate mt-1">
                            {lecture.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
                            <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                              <Play className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(lecture.id)}
                            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* ADD MODULE */}
            <Card className="border-border/60 shadow-md h-fit sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Add Module</CardTitle>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-6">
                <form onSubmit={handleAddLecture} className="space-y-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                    <Input
                      value={newLectureTitle}
                      onChange={(e) => setNewLectureTitle(e.target.value)}
                      placeholder="e.g. 01. Intro to Shadcn UI"
                      className="h-11 rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media Resource</Label>
                    <Label
                      htmlFor="lecture-video"
                      className={`flex flex-col items-center justify-center gap-3 h-32 w-full rounded-2xl border-2 border-dashed border-border py-4 px-4 text-sm text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all ${
                        lectureUploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <div className="p-2.5 rounded-full bg-muted/60">
                        <VideoIcon className="h-6 w-6 text-muted-foreground/70" />
                      </div>
                      <span className="font-bold truncate max-w-full px-2">
                        {lectureFile ? lectureFile.name : 'Choose video file'}
                      </span>
                    </Label>
                    <input
                      ref={lectureFileRef}
                      id="lecture-video"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => setLectureFile(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  {lectureUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Uploading Video</span>
                        <span>{lectureProgress}%</span>
                      </div>
                      <Progress value={lectureProgress} className="h-1.5" />
                    </div>
                  )}

                  {lectureError && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 transition-all animate-in shake duration-500">
                      {lectureError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={lectureUploading || !newLectureTitle.trim() || !lectureFile}
                    className="w-full h-11 rounded-full font-bold shadow-lg shadow-primary/20"
                  >
                    {lectureUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {lectureUploading ? 'Securing Content...' : 'Add Lesson to Course'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Remove this lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove this lecture from your course content. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full px-6">Keep Lesson</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDeleteLecture}
              className="rounded-full px-6 bg-destructive hover:bg-destructive/90"
            >
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'outline' | 'destructive', className?: string }) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-muted text-muted-foreground',
    outline: 'border border-border text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  }
  return <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${variants[variant]} ${className}`}>{children}</span>
}
