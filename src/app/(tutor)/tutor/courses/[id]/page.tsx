import { Navbar } from '@/components/navigation/Navbar'
import { getCourseById, getCourseContent } from '@/actions/tutor'
import TutorEditCourseForm from '@/components/tutor/TutorEditCourseForm'

export default async function TutorEditCoursePage({
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-12">
        <TutorEditCourseForm course={course} initialContent={initialContent} />
      </div>
    </div>
  )
}
