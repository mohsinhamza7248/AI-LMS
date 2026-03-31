'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { syncUserToSupabase } from '@/actions/sync-user'

export async function enrollCourse(courseId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createAdminClient()
  
  // Get user ID mapped from Clerk
  let { data: dbUser } = await supabase.from('users').select('id, tenant_id').eq('clerk_id', userId).single()
  
  if (!dbUser) {
    dbUser = await syncUserToSupabase() as any
  }
  
  if (!dbUser) throw new Error('User not found')

  // Prevent duplicate enrollment
  const { data: existingEnrollment } = await supabase.from('enrollments').select('id').eq('course_id', courseId).eq('user_id', (dbUser as any).id).single()
  if (existingEnrollment) {
    return (existingEnrollment as any).id
  }

  const { data: newEnrollment, error } = await supabase.from('enrollments').insert({
    course_id: courseId,
    user_id: (dbUser as any).id,
    progress: 0
  } as any).select('id').single()

  if (error) throw new Error(error.message)

  revalidatePath(`/courses/${courseId}`)
  return (newEnrollment as any).id
}
