import { createClient } from '@/lib/supabase/server'
import { Course } from '@/types/database.types'

export async function getCoursesByTenant(tenantId: string, options?: {
  categoryId?: string
  limit?: number
  offset?: number
  published?: boolean
}) {
  const supabase = await createClient()
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
  const supabase = await createClient()
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
