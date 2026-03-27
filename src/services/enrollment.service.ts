import { createClient } from '@/lib/supabase/server'
import { Enrollment } from '@/types/database.types'

export async function enrollStudent(userId: string, courseId: string) {
  const supabase = await createClient()
  
  // Check if already enrolled
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (existing) return existing

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      progress: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getStudentEnrollments(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses:course_id (
        id,
        title,
        thumbnail_url,
        categories(name),
        tutors(users(name))
      )
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  return data || []
}

export async function updateProgress(enrollmentId: string, progress: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enrollments')
    .update({ 
      progress,
      completed_at: progress === 100 ? new Date().toISOString() : null
    })
    .eq('id', enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data
}
