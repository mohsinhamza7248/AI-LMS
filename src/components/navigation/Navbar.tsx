'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { getUserRole } from '@/actions/user'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BookOpen, LayoutDashboard, PlusCircle, GraduationCap, Menu, X, Tag, ArrowLeft } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoaded, userId } = useAuth()
  const [role, setRole] = useState<string>('student')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    async function fetchRole() {
      if (userId) {
        const r = await getUserRole()
        if (r) setRole(r)
      }
    }
    if (isLoaded) fetchRole()
  }, [userId, isLoaded])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = () => {
    if (role === 'admin' || role === 'super_admin') {
      return [
        { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
        { href: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
        { href: '/admin/categories', label: 'Categories', icon: Tag },
        { href: '/courses', label: 'View Site', icon: GraduationCap },
      ]
    }
    if (role === 'tutor') {
      return [
        { href: '/tutor', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tutor/courses', label: 'Manage Courses', icon: BookOpen },
      ]
    }
    
    // Default & Student
    const links = [
      { href: '/courses', label: 'Courses', icon: BookOpen },
      { href: '/ai-tutor', label: 'AI Tutor', icon: GraduationCap },
    ]
    
    if (userId) {
      links.unshift({ href: '/my-learning', label: 'My Learning', icon: LayoutDashboard })
    }
    
    return links
  }

  const links = navLinks()

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-300',
          (scrolled || pathname !== '/')
            ? 'border-b border-border/50 bg-background/70 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Header Left (Back + Logo) */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {pathname !== '/' && (
              <button
                onClick={() => router.back()}
                className="md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-14 w-24 md:w-28 items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8 ml-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 py-1 px-1",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <link.icon className={cn("h-4 w-4 transition-transform", isActive && "scale-110")} />
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(var(--primary),0.2)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <ModeToggle />
            <SignedIn>
               <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="inline-flex h-9 text-sm font-semibold items-center justify-center rounded-full bg-primary px-5 text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Right Edge */}
          <div className="flex md:hidden items-center gap-3">
            <ModeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl pb-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <link.icon className="h-4 w-4" />
                </div>
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="flex mt-4 w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow flex-1"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        )}
      </nav>
    </>
  )
}
