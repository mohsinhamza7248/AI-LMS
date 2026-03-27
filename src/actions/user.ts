'use server'

import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getUserRole() {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createAdminClient() as any
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('clerk_id', userId)
    .single()
    
  return data?.role || 'student'
}
