import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Course } from '@/types/database.types'

export async function getCoursesByTenant(tenantId: string, options?: {
  categoryId?: string
  limit?: number
  offset?: number
  published?: boolean
}) {
  const supabase = createAdminClient() as any
  let query = supabase
    .from('courses')
    .select(`
      *,
      categories(id, name),
      tutors(id, bio, users(id, name, avatar_url))
    `)
    .eq('tenant_id', tenantId)

  if (options?.published !== false) {
    query = query.eq('is_published', true)
  }
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
  }

  const { data } = await query.order('created_at', { ascending: false })
  return data || []
}

export async function getCourseById(id: string) {
  const supabase = createAdminClient() as any
  const { data } = await supabase
    .from('courses')
    .select(`
      *,
      categories(id, name),
      tutors(id, bio, users(id, name, avatar_url)),
      course_content(*)
    `)
    .eq('id', id)
    .single()
  return data
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCourse(id: string, updates: Partial<Course>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}

export async function getFeaturedCourses(tenantId: string, limit = 6) {
  return getCoursesByTenant(tenantId, { limit, published: true })
}

export async function getEnrolledCourses(userId: string) {
  const supabase = createAdminClient() as any
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      progress,
      enrolled_at,
      courses (
        id,
        title,
        thumbnail_url,
        description,
        tutors (
          users (
            name
          )
        )
      )
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Error fetching enrolled courses:', error)
    return []
  }

  return data.map((item: any) => ({
    id: item.courses.id,
    title: item.courses.title,
    thumbnail_url: item.courses.thumbnail_url,
    instructor: item.courses.tutors?.users?.name || 'Expert Instructor',
    progress: item.progress || 0,
    enrolledAt: item.enrolled_at
  }))
}
