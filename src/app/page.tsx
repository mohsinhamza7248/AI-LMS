import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/navigation/Footer'
import Link from 'next/link'
import { Sparkles, Zap, ShieldCheck, ArrowRight, Users, Star, BookOpen } from 'lucide-react'
import { getActiveTenant } from '@/lib/tenant'
import { getFeaturedCourses } from '@/services/course.service'
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel'
import { FeaturedCoursesGrid } from '@/components/courses/FeaturedCoursesGrid'
import { Badge } from '@/components/ui/badge'
import { ParticlesBg } from '@/components/ui/ParticlesBg'

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

  const stats = [
    { label: 'Active Students', value: '12,000+', icon: Users },
    { label: 'Expert Courses', value: '250+', icon: BookOpen },
    { label: 'Avg. Rating', value: '4.9 ★', icon: Star },
  ]

  return (
    <div className="relative min-h-screen pt-10">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-10 lg:py-14">
        <ParticlesBg />
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div className="space-y-7 animate-in fade-in slide-in-from-left duration-700">
              <Badge variant="outline" className="gap-1.5 rounded-full border-primary/30 bg-primary/5 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Next-Gen Learning Experience
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl leading-[1.1]">
                Education that{' '}
                <span className="text-gradient-primary font-serif">Empowers</span>{' '}
                Your Future.
              </h1>

              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Join over 12,000+ students mastering real-world skills with AI-powered tutoring, expert-led courses, and interactive live batches.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/courses">
                  <button className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 hover:shadow-xl active:scale-95">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/ai-tutor">
                  <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-7 py-3 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground active:scale-95">
                    Try AI Tutor <Zap className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-2 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Real-time Feedback</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>

            {/* Right – hero image */}
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="relative h-[320px] w-full lg:h-[420px]">
                <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border/30">
                  <img
                    src="/home-page.jpg"
                    alt="Students studying"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                </div>
                {/* Floating stats card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md p-4 shadow-xl animate-in zoom-in duration-700 delay-500">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Learners</p>
                      <p className="text-lg font-bold leading-none">12,000+</p>
                    </div>
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/15 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-3 gap-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 divide-x divide-border/50">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-14 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold px-4 py-1.5">
              Top Picks
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
              Trending Masterclasses
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Unlock your potential with our top-rated, industry-focused programs. Learn from the best and accelerate your career.
            </p>
          </div>

          <FeaturedCoursesGrid courses={displayCourses} />

          <div className="mt-10 text-center">
            <Link href="/courses">
              <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-7 py-3 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground">
                View All Courses <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 border-t border-border/40 overflow-hidden relative">
        <div className="pointer-events-none absolute top-0 right-1/4 -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="mb-14 text-center">
            <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold px-4 py-1.5">
              Reviews
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
              Loved by Students
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Discover why thousands of learners choose our platform to achieve their goals.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      <Footer />
    </div>
  )
}
