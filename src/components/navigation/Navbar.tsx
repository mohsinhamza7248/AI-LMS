'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { getUserRole } from '@/actions/user'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BookOpen, LayoutDashboard, PlusCircle, GraduationCap, Menu, X } from 'lucide-react'

export function Navbar() {
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
    if (!userId || role === 'student') {
      return [
        { href: '/courses', label: 'Courses', icon: BookOpen },
        { href: '/ai-tutor', label: 'AI Tutor', icon: GraduationCap },
      ]
    }
    if (role === 'tutor') {
      return [
        { href: '/tutor', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tutor/courses/create', label: 'Create Course', icon: PlusCircle },
      ]
    }
    if (role === 'admin' || role === 'super_admin') {
      return [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      ]
    }
    return []
  }

  const links = navLinks()

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80">
            <div className="flex h-14 w-28 items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <LayoutDashboard className="h-4 w-4" />
                Portal
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile menu toggle */}
            <button
              className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground mt-2 hover:bg-primary/90"
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
