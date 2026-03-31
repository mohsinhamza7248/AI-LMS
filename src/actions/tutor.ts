'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { syncUserToSupabase } from '@/actions/sync-user'
import { revalidatePath } from 'next/cache'
async function checkTutor() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createAdminClient() as any
  
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

  let currentRole = user?.role

  if (!user) {
    throw new Error('Forbidden')
  }

  // Auto-upgrade students to tutors when they access tutor features
  if (currentRole === 'student') {
    await supabase.from('users').update({ role: 'tutor' }).eq('id', (dbUser as any).id)
    currentRole = 'tutor'
  }

  if (currentRole !== 'tutor' && currentRole !== 'admin' && currentRole !== 'super_admin') {
    throw new Error('Forbidden')
  }

  // Get or auto-create tutor profile
  let { data: tutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!tutor) {
    const { data: newTutor } = await supabase.from('tutors').insert({
      user_id: user.id,
      tenant_id: user.tenant_id,
      bio: 'New Tutor',
      expertise: []
    } as any).select('id').single() as any
    
    tutor = newTutor
  }

  if (!tutor || !tutor.id) {
    throw new Error('Failed to associate tutor profile')
  }

  return { user, tutorId: tutor.id }
}

export async function getTutorDashboardData() {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  // Get all courses for this tutor
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id, title, is_published,
      enrollments ( id, progress )
    `)
    .eq('tutor_id', tutorId)
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

export async function getCourseById(id: string) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, description, price, is_published, is_live, thumbnail_url, skill, category_id,
      categories ( id, name )
    `)
    .eq('id', id)
    .eq('tutor_id', tutorId)
    .single() as { data: any, error: any }

  if (error || !data) throw new Error('Course not found')
  return data
}

export async function getCourseContent(courseId: string) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any
  
  // Verify ownership
  const { data: course } = await supabase.from('courses').select('id').eq('id', courseId).eq('tutor_id', tutorId).single()
  if (!course) throw new Error('Forbidden')

  const { data, error } = await supabase
    .from('course_content')
    .select('id, title, url, order_index, created_at')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true }) as { data: any, error: any }

  return (data ?? []) as { id: string; title: string; url: string; order_index: number; created_at: string }[]
}

export async function updateCourse(
  id: string,
  data: {
    title: string
    description: string
    price: number
    is_published?: boolean
    is_live?: boolean
    thumbnail_url?: string | null
    category_id?: string | null
    skill?: string | null
  }
) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  const updatePayload: Record<string, any> = {
    title: data.title,
    description: data.description,
    price: data.price,
    is_published: data.is_published,
    is_live: data.is_live,
    updated_at: new Date().toISOString(),
  }

  if (data.thumbnail_url !== undefined) updatePayload.thumbnail_url = data.thumbnail_url
  if (data.category_id !== undefined) updatePayload.category_id = data.category_id || null
  if (data.skill !== undefined) updatePayload.skill = data.skill || null

  const { error } = await supabase
    .from('courses')
    .update(updatePayload as any)
    .eq('id', id)
    .eq('tutor_id', tutorId)

  if (error) throw new Error(error.message)

  revalidatePath(`/tutor/courses/${id}`)
  revalidatePath('/tutor')
  revalidatePath('/courses')
  return { success: true }
}

export async function addLecture(
  courseId: string,
  data: { title: string; url: string; order_index: number }
) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any
  
  const { data: course } = await supabase.from('courses').select('id').eq('id', courseId).eq('tutor_id', tutorId).single()
  if (!course) throw new Error('Forbidden')

  const { error } = await supabase.from('course_content').insert({ course_id: courseId, ...data } as any)
  if (error) throw new Error(error.message)

  revalidatePath(`/tutor/courses/${courseId}`)
  return { success: true }
}

export async function deleteLecture(lectureId: string, courseId: string) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  const { data: course } = await supabase.from('courses').select('id').eq('id', courseId).eq('tutor_id', tutorId).single()
  if (!course) throw new Error('Forbidden')

  const { error } = await supabase.from('course_content').delete().eq('id', lectureId).eq('course_id', courseId)
  if (error) throw new Error(error.message)

  revalidatePath(`/tutor/courses/${courseId}`)
  return { success: true }
}

export async function reorderLectures(lectures: { id: string; order_index: number }[]) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  await Promise.all(
    lectures.map((l) =>
      supabase
        .from('course_content')
        .update({ order_index: l.order_index } as any)
        .eq('id', l.id)
    )
  )

  return { success: true }
}

export async function deleteCourse(id: string) {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
    .eq('tutor_id', tutorId)

  if (error) throw new Error(error.message)

  revalidatePath('/tutor')
  revalidatePath('/tutor/courses')
  revalidatePath('/courses')
  return { success: true }
}

export async function getCourseList() {
  const { tutorId } = await checkTutor()
  const supabase = createAdminClient() as any

  const { data } = await supabase
    .from('courses')
    .select(`
      id, title, price, is_published, is_live, thumbnail_url, created_at, skill,
      tutors ( users ( name ) ),
      categories ( id, name )
    `)
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false }) as any

  return data?.map((c: any) => ({
    id: c.id,
    title: c.title,
    price: c.price,
    isPublished: c.is_published,
    isLive: c.is_live,
    thumbnailUrl: c.thumbnail_url,
    tutorName: c.tutors?.users?.name || 'Unknown',
    createdAt: c.created_at,
    skill: c.skill || null,
    categoryName: c.categories?.name || null,
    categoryId: c.categories?.id || null,
  })) || []
}

