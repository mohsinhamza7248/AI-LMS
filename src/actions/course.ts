'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(data: { title: string, description: string, price: number }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = createAdminClient() as any

  // Actually, we should get user id from users table.
  const { data: dbUser } = await supabase.from('users').select('id, tenant_id').eq('clerk_id', userId).single() as any
  if (!dbUser) throw new Error('User not found')

  let tenantId = dbUser.tenant_id
  if (!tenantId) {
    // Fallback: Get first tenant if user has no tenant (e.g. global admin)
    const { data: tenant } = await supabase.from('tenants').select('id').limit(1).single() as any
    if (!tenant) throw new Error('No tenant found in system')
    tenantId = tenant.id
  }

  const { data: tutorProfile } = await supabase.from('tutors').select('id').eq('user_id', dbUser.id).single() as any
  
  // If no tutor profile, we might need to create it for dev purposes or the user is not a tutor.
  let tutorId = tutorProfile?.id
  if (!tutorId) {
    const { data: newTutor } = await supabase.from('tutors').insert({
      user_id: dbUser.id,
      tenant_id: tenantId,
      bio: 'New Tutor',
      expertise: []
    } as any).select('id').single() as any
    if(!newTutor) throw new Error('Could not create tutor profile')
    tutorId = newTutor.id
  }

  const { data: newCourse, error } = await supabase.from('courses').insert({
    title: data.title,
    description: data.description,
    price: data.price,
    tenant_id: tenantId,
    tutor_id: tutorId,
    is_published: false,
    is_live: false,
  } as any).select('id').single() as any

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return newCourse?.id || 'new-course-id'
}
