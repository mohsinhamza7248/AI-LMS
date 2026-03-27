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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  // 1. Get signed params from our API
  const res = await fetch(`/api/upload?type=${type}`)
  const { signature, timestamp, cloudName, apiKey, folder } = await res.json()

  // 2. Build multipart form
  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', apiKey)
  fd.append('timestamp', String(timestamp))
  fd.append('signature', signature)
  fd.append('folder', folder)

  // 3. Upload with XHR so we can track progress
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
// Progress bar sub-component
// ─────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
      <div
        className="h-2 rounded-full bg-primary transition-all duration-200"
        style={{ width: `${value}%` }}
      />
    </div>
  )
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

  // ── Panel A: Details ──────────────────────────────────
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description || '')
  const [price, setPrice] = useState(course.price || 0)
  const [isPublished, setIsPublished] = useState(course.is_published)
  const [isLive, setIsLive] = useState(course.is_live)
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsMsg, setDetailsMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // ── Panel B: Thumbnail ────────────────────────────────
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    course.thumbnail_url ?? null
  )
  const [thumbProgress, setThumbProgress] = useState(0)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [thumbError, setThumbError] = useState('')

  // ── Panel C: Lectures ─────────────────────────────────
  const [lectures, setLectures] = useState<Lecture[]>(initialContent)
  const [newLectureTitle, setNewLectureTitle] = useState('')
  const [lectureFile, setLectureFile] = useState<File | null>(null)
  const [lectureProgress, setLectureProgress] = useState(0)
  const [lectureUploading, setLectureUploading] = useState(false)
  const [lectureError, setLectureError] = useState('')
  const lectureFileRef = useRef<HTMLInputElement>(null)

  // drag state
  const dragId = useRef<string | null>(null)

  // ─────────────────────────────────────────────────────
  // Panel A – Save details
  // ─────────────────────────────────────────────────────

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault()
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
        // Persist to DB
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

      // Optimistic UI
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

  async function handleDeleteLecture(id: string) {
    if (!confirm('Delete this lecture?')) return
    try {
      await deleteLecture(id, course.id)
      setLectures((prev) => {
        const updated = prev
          .filter((l) => l.id !== id)
          .map((l, i) => ({ ...l, order_index: i }))
        return updated
      })
    } catch (err: any) {
      alert(err.message)
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

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage details, thumbnail and lectures
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ════════════════════════════════════════════════
            LEFT – Details + Thumbnail
            ════════════════════════════════════════════════ */}
        <div className="lg:col-span-1 space-y-6">
          {/* ── Panel A: Details ─────────────────────── */}
          <section className="p-6 bg-card rounded-3xl border shadow-sm">
            <h2 className="text-base font-bold mb-4">Course Details</h2>
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="pt-1 space-y-3">
                <ToggleRow
                  label="Published"
                  description="Visible to students"
                  checked={isPublished}
                  onChange={setIsPublished}
                  color="primary"
                />
                <ToggleRow
                  label="Live Course"
                  description="Enable live features"
                  checked={isLive}
                  onChange={setIsLive}
                  color="red"
                />
              </div>

              <button
                type="submit"
                disabled={savingDetails}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-bold text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 text-sm"
              >
                {savingDetails ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Details
              </button>

              {detailsMsg && (
                <p
                  className={`text-xs text-center font-medium flex items-center justify-center gap-1 ${
                    detailsMsg.ok ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {detailsMsg.ok && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {detailsMsg.text}
                </p>
              )}
            </form>
          </section>

          {/* ── Panel B: Thumbnail ───────────────────── */}
          <section className="p-6 bg-card rounded-3xl border shadow-sm">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-primary" />
              Thumbnail
            </h2>

            {thumbnailUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-muted">
                <img
                  src={thumbnailUrl}
                  alt="Course thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-colors text-center ${
                isDragActive
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
                <p className="text-xs text-muted-foreground mb-1">
                  Uploading… {thumbProgress}%
                </p>
                <ProgressBar value={thumbProgress} />
              </div>
            )}

            {thumbError && (
              <p className="text-red-500 text-xs mt-2">{thumbError}</p>
            )}
          </section>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT – Course Content / Lectures
            ════════════════════════════════════════════════ */}
        <div className="lg:col-span-2">
          <section className="p-6 bg-card rounded-3xl border shadow-sm">
            <h2 className="text-base font-bold mb-1 flex items-center gap-2">
              <VideoIcon className="h-4 w-4 text-primary" />
              Course Content
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Add lectures in order. Drag to reorder.
            </p>

            {/* ── Lecture List ──────────────────────── */}
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
                    <span className="flex-1 text-sm font-medium truncate">
                      {lecture.title}
                    </span>
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
                      onClick={() => handleDeleteLecture(lecture.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete lecture"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* ── Add Lecture Form ─────────────────── */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-bold mb-4">Add New Lecture</h3>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Video File
                  </label>
                  <label
                    htmlFor="lecture-video"
                    className={`flex items-center gap-3 h-12 w-full rounded-xl border border-dashed border-muted-foreground/40 bg-background px-4 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:bg-muted/20 transition-colors ${
                      lectureUploading ? 'opacity-60 pointer-events-none' : ''
                    }`}
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

                {lectureUploading && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Uploading video… {lectureProgress}%
                    </p>
                    <ProgressBar value={lectureProgress} />
                  </div>
                )}

                {lectureError && (
                  <p className="text-red-500 text-xs">{lectureError}</p>
                )}

                <button
                  type="submit"
                  disabled={lectureUploading || !newLectureTitle.trim() || !lectureFile}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                >
                  {lectureUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                  {lectureUploading ? 'Uploading…' : 'Upload & Add Lecture'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ToggleRow helper
// ─────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  color,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  color: 'primary' | 'red'
}) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30">
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`h-5 w-5 ${color === 'primary' ? 'accent-primary' : 'accent-red-500'}`}
      />
    </div>
  )
}
