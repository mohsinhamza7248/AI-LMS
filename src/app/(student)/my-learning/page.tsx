import { Navbar } from '@/components/navigation/Navbar'
import { getEnrolledCourses } from '@/services/course.service'
import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Play, Clock } from 'lucide-react'

export default async function MyLearningPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = createAdminClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('clerk_id', userId).single() as any

  if (!dbUser) {
    redirect('/')
  }

  const fetchedCourses = await getEnrolledCourses(dbUser.id)

  const dummyCourses = [
    {
      id: 'dummy-1',
      title: 'Advanced React Architecture with Next.js 15',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
      progress: 75,
      instructor: 'Dr. Sarah Chen',
    },
    {
      id: 'dummy-bareilly-1',
      title: 'Mastering Traditional Zardozi Embroidery of Bareilly',
      thumbnail_url: 'https://images.unsplash.com/photo-1620023472627-8d07f35b2e36?q=80&w=2074&auto=format&fit=crop',
      progress: 35,
      instructor: 'Master Artisan Rajesh',
    },
    {
      id: 'dummy-2',
      title: 'Full Stack Web Development: From Zero to Hero',
      thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      progress: 10,
      instructor: 'Alex Rivera',
    },
    {
      id: 'dummy-3',
      title: 'The Art of Bareilly Surma Making: Traditional Heritage',
      thumbnail_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
      progress: 90,
      instructor: 'Hakim Ahmed',
    }
  ]

  const enrolledCourses = [...dummyCourses, ...fetchedCourses]

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground text-lg mt-2">Pick up where you left off and keep growing.</p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolledCourses.map((course: any) => (
              <div key={course.id} className="group relative rounded-3xl border bg-card/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Progress Badge */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {course.progress}% Complete
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{course.instructor}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Link
                      href={`/courses/${course.id}/watch`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 rounded-[40px] border border-dashed border-muted bg-muted/5">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-10 w-10" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold">Your library is empty</h3>
              <p className="text-muted-foreground mt-2">You haven't enrolled in any courses yet. Start your learning journey today!</p>
            </div>
            <Link href="/courses">
              <button className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                Explore Courses
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
