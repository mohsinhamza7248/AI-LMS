'use server'

import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { syncUserToSupabase } from '@/actions/sync-user'

async function checkTutor() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()
  
  // Get user ID mapped from Clerk
  const { data: profile } = await supabase.from('users').select('id, tenant_id').eq('clerk_id', userId).single()
  let dbUser = profile as any
  
  if (!dbUser) {
    dbUser = await syncUserToSupabase()
  }
  
  if (!dbUser) throw new Error('User not found')

  // Now fetch the user with role for role-based checks
  const { data: user } = await supabase
    .from('users')
    .select('id, role, tenant_id')
    .eq('id', (dbUser as any).id)
    .single() as { data: any }

  if (!user || user.role !== 'tutor') {
    // Admins can also act as tutors if needed, but strictly:
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
       throw new Error('Forbidden')
    }
  }

  // Get tutor profile
  const { data: tutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!tutor) {
    throw new Error('Tutor profile not found')
  }

  return { user, tutor }
}

export async function getTutorDashboardData() {
  const { tutor } = await checkTutor()
  const supabase = await createClient()

  // Get all courses for this tutor
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id, title, is_published,
      enrollments ( id, progress )
    `)
    .eq('tutor_id', (tutor as any).id)
    .order('created_at', { ascending: false }) as { data: any[] | null }

  let totalStudents = 0
  let totalCourseViews = 0 // Mocking views since we don't have a views table

  const mappedCourses = courses?.map(c => {
    totalStudents += c.enrollments?.length || 0
    totalCourseViews += (c.enrollments?.length || 0) * 12 // Fake multiplier
    
    return {
      id: c.id,
      title: c.title,
      students: c.enrollments?.length || 0,
      status: c.is_published ? 'Published' : 'Draft',
    }
  }) || []

  return {
    stats: {
      totalEnrolled: totalStudents,
      courseViews: totalCourseViews,
      avgRating: 4.8 // Mocking rating
    },
    courses: mappedCourses
  }
}
