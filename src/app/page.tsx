import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/navigation/Footer'
import Link from 'next/link'
import { Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { getActiveTenant } from '@/lib/tenant'
import { getFeaturedCourses } from '@/services/course.service'
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel'
import { FeaturedCoursesGrid } from '@/components/courses/FeaturedCoursesGrid'

export default async function HomePage() {
  const tenant = await getActiveTenant()
  let featuredCourses: any[] = []

  if (tenant) {
    await getFeaturedCourses(tenant.id, 3)
  }

  // Fallback dummy data if no courses are published yet
  const displayCourses = [
    {
      title: 'Next-Gen SaaS Mastery (Next.js 15)',
      instructor: 'Parth Sharma',
      rating: 4.9,
      students: '3,200',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
      youtube_url: 'https://www.youtube.com/watch?v=XUkNR-JfHwo'
    },
    {
      title: 'Advanced Physics: JEE/NEET 2026',
      instructor: 'Dr. Vivek Kumar',
      rating: 4.8,
      students: '5,100',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1974&auto=format&fit=crop',
      youtube_url: 'https://www.youtube.com/watch?v=NWe0vE3P6cM'
    },
    {
      title: 'AI Engineering & Prompt Design',
      instructor: 'Sarah Jenkins',
      rating: 5.0,
      students: '2,800',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
      youtube_url: 'https://www.youtube.com/watch?v=_ZvnD73m40o'
    }
  ];

  return (
    <div className="relative min-h-screen pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Next-Gen Learning Experience</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight lg:text-4xl leading-[0.9] text-[#0f172a] dark:text-white">
                Education that <span className="italic font-serif">Empowers</span> Your Future.
              </h1>

              <p className="max-w-[700px] text-xl text-muted-foreground lg:text-xl font-medium leading-relaxed">
                Join over 12,000+ students mastering real-world skills with AI-powered tutoring, expert-led courses, and interactive live batches.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link href="/courses">
                  <button
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-background px-10 py-5 text-xl font-black transition-all hover:bg-accent active:scale-95 shadow-sm"

                  >
                    Start
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Real-time Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>

            <div className="relative lg:block animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="relative h-[450px] w-full lg:h-[550px]">
                {/* Main Hero Image */}
                <div className="relative h-full w-full overflow-hidden rounded-[40px] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                    alt="Students studying"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating "New Batch Started" Card */}
                {/* <div className="absolute -top-6 -right-6 lg:-top-10 lg:-right-10 rounded-2xl border bg-card/95 backdrop-blur-md p-4 shadow-2xl animate-in zoom-in duration-700 delay-500">
                  <div className="flex items-center gap-4 pr-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-black whitespace-nowrap">New Batch Started!</p>
                      <p className="text-xs font-bold text-muted-foreground italic">Join JEE/NEET 2026</p>
                    </div>
                  </div>
                </div> */}

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black tracking-tight lg:text-4xl mb-4">Trending Masterclasses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Unlock your potential with our top-rated, industry-focused programs. Learn from the best and accelerate your career.
            </p>
          </div>

          <FeaturedCoursesGrid courses={displayCourses} />
        </div>
      </section>

      {/* Ratings Section */}
      <section className="py-24 bg-muted/30 border-t border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight lg:text-4xl mb-4">Loved by Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover why thousands of learners choose our platform to achieve their academic and professional goals.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      <Footer />
    </div>
  )
}
