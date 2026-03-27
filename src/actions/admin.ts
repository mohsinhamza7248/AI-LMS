'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createAdminClient() as any
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    throw new Error('Forbidden')
  }

  return user
}

export async function getAdminStats() {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  // Get total students
  const { count: studentsCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', admin.tenant_id)
    .eq('role', 'student')

  // Get total tutors
  const { count: tutorsCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', admin.tenant_id)
    .eq('role', 'tutor')

  // Get active courses
  const { count: coursesCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', admin.tenant_id)

  // Get total revenue (mocked for now, depending on payments table)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('tenant_id', admin.tenant_id)
    .eq('status', 'completed') as any
  
  const revenue = payments?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0

  return {
    students: studentsCount || 0,
    tutors: tutorsCount || 0,
    courses: coursesCount || 0,
    revenue: revenue
  }
}

export async function getTutorList() {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  const { data } = await supabase
    .from('tutors')
    .select(`
      id,
      bio,
      users ( id, name, email, avatar_url ),
      courses ( id )
    `)
    .eq('tenant_id', admin.tenant_id) as any

  return data?.map((t: any) => ({
    id: t.id,
    user_id: t.users?.id,
    name: t.users?.name,
    email: t.users?.email,
    avatar: t.users?.avatar_url,
    coursesCount: t.courses?.length || 0,
  })) || []
}

export async function getStudentList() {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  // Find students for this tenant
  const { data } = await supabase
    .from('users')
    .select(`
      id, name, email, avatar_url, created_at,
      enrollments ( id )
    `)
    .eq('tenant_id', admin.tenant_id)
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(20) as any

  return data?.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar_url,
    joined: u.created_at,
    enrollmentsCount: u.enrollments?.length || 0,
  })) || []
}

export async function getRecentActivity() {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  // Get recent enrollments with user and course info
  const { data } = await supabase
    .from('enrollments')
    .select(`
      id, enrolled_at,
      users ( name, avatar_url ),
      courses ( title )
    `)
    .order('enrolled_at', { ascending: false })
    .limit(5) as any
  
  return data?.map((e: any) => ({
    id: e.id,
    studentName: e.users?.name || 'Unknown',
    studentAvatar: e.users?.avatar_url,
    courseTitle: e.courses?.title || 'Unknown Course',
    date: e.enrolled_at,
  })) || []
}

export async function addUser(data: { name: string, email?: string, phone: string, role: string }) {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  // Clean identifier
  let searchIdentifier = data.phone.trim()
  if (/^\d{10,}$/.test(searchIdentifier)) {
    searchIdentifier = `+${searchIdentifier}`
  }

  // 1. Find user by email/phone
  let { data: user } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', searchIdentifier)
    .single() as any

  // 2. If user doesn't exist, PRE-REGISTER them
  if (!user) {
    const tempId = `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_id: tempId,
        email: searchIdentifier,
        name: data.name,
        role: data.role,
        tenant_id: admin.tenant_id
      })
      .select('id')
      .single() as any
      
    if (insertError) {
      throw new Error(`Failed to pre-register user: ${insertError.message}`)
    }
    user = newUser
  } else {
    // User exists, update their role
    await supabase
      .from('users')
      .update({ role: data.role } as any)
      .eq('id', user.id)
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getCourseList() {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  const { data } = await supabase
    .from('courses')
    .select(`
      id, title, price, is_published, is_live, thumbnail_url, created_at,
      tutors ( users ( name ) )
    `)
    .eq('tenant_id', admin.tenant_id)
    .order('created_at', { ascending: false }) as any

  return data?.map((c: any) => ({
    id: c.id,
    title: c.title,
    price: c.price,
    isPublished: c.is_published,
    isLive: c.is_live,
    thumbnailUrl: c.thumbnail_url,
    tutorName: c.tutors?.users?.name || 'Unknown',
    createdAt: c.created_at
  })) || []
}

export async function getCourseById(id: string) {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, description, price, is_published, is_live, thumbnail_url,
      tutors ( id, users ( name ) )
    `)
    .eq('id', id)
    .eq('tenant_id', admin.tenant_id)
    .single() as any

  if (error || !data) throw new Error('Course not found')
  return data
}

export async function updateCourse(
  id: string,
  data: {
    title: string
    description: string
    price: number
    is_published?: boolean
    is_live?: boolean
    thumbnail_url?: string
  }
) {
  const admin = await checkAdmin()
  const supabase = createAdminClient() as any

  const updatePayload: Record<string, any> = {
    title: data.title,
    description: data.description,
    price: data.price,
    is_published: data.is_published,
    is_live: data.is_live,
    updated_at: new Date().toISOString(),
  }

  if (data.thumbnail_url !== undefined) {
    updatePayload.thumbnail_url = data.thumbnail_url
  }

  const { error } = await supabase
    .from('courses')
    .update(updatePayload)
    .eq('id', id)
    .eq('tenant_id', admin.tenant_id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${id}`)
  return { success: true }
}

// ──────────────────────────────────────────
// Course Content (Lectures)
// ──────────────────────────────────────────

export async function getCourseContent(courseId: string) {
  await checkAdmin()
  const supabase = createAdminClient() as any

  const { data, error } = await supabase
    .from('course_content')
    .select('id, title, url, order_index, created_at')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true }) as any

  if (error) throw new Error(error.message)
  return (data ?? []) as { id: string; title: string; url: string; order_index: number; created_at: string }[]
}

export async function addLecture(
  courseId: string,
  data: { title: string; url: string; order_index: number }
) {
  await checkAdmin()
  const supabase = createAdminClient() as any

  const { error } = await supabase
    .from('course_content')
    .insert({ course_id: courseId, title: data.title, url: data.url, order_index: data.order_index } as any)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function updateLecture(
  id: string,
  data: { title: string; url: string; order_index: number }
) {
  await checkAdmin()
  const supabase = createAdminClient() as any

  const { error } = await supabase
    .from('course_content')
    .update({ title: data.title, url: data.url, order_index: data.order_index } as any)
    .eq('id', id)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function deleteLecture(id: string, courseId: string) {
  await checkAdmin()
  const supabase = createAdminClient() as any

  const { error } = await supabase
    .from('course_content')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function reorderLectures(lectures: { id: string; order_index: number }[]) {
  await checkAdmin()
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

