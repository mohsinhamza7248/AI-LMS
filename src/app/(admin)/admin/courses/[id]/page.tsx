import { Navbar } from '@/components/navigation/Navbar'
import { getCourseById, getCourseContent } from '@/actions/admin'
import EditCourseForm from '@/components/admin/EditCourseForm'

export default async function AdminEditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [course, initialContent] = await Promise.all([
    getCourseById(id),
    getCourseContent(id),
  ])

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <EditCourseForm course={course} initialContent={initialContent} />
      </div>
    </div>
  )
}
