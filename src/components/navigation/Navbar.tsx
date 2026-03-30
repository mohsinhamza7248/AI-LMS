'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { getUserRole } from '@/actions/user'
import { ModeToggle } from '@/components/mode-toggle'

export function Navbar() {
  const { isLoaded, userId } = useAuth()
  const [role, setRole] = useState<string>('student')

  useEffect(() => {
    async function fetchRole() {
      if (userId) {
        const r = await getUserRole()
        if (r) setRole(r)
      }
    }
    if (isLoaded) fetchRole()
  }, [userId, isLoaded])

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl transition-colors hover:opacity-80">
          <div className="flex h-16 w-32 items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
        </Link>

        {/* Dynamic Links Based on Role */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-tight uppercase">
          {(!userId || role === 'student') && (
            <>
              {userId && <Link href="/my-learning" className="transition-colors hover:text-primary">My Learning</Link>}
              <Link href="/courses" className="transition-colors hover:text-primary">All Courses</Link>
              <Link href="/ai-tutor" className="transition-colors hover:text-primary">AI Tutor</Link>
            </>
          )}

          {role === 'tutor' && (
            <>
              <Link href="/tutor" className="transition-colors hover:text-primary">My Dashboard</Link>
              <Link href="/tutor/courses/create" className="transition-colors hover:text-primary">Create Course</Link>
            </>
          )}

          {(role === 'admin' || role === 'super_admin') && (
            <>
              <Link href="/admin" className="transition-colors hover:text-primary">Dashboard</Link>
              <Link href="/admin/courses" className="transition-colors hover:text-primary">Courses</Link>
              <Link href="/admin/students" className="transition-colors hover:text-primary">Students</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-full bg-gradient-to-r from-violet-600 to-amber-500 px-6 py-2.5 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary hidden md:block"
            >
              Portal
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}


