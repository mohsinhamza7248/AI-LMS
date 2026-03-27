'use server'

import { currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getActiveTenant } from '@/lib/tenant'

/**
 * Sync the currently signed-in Clerk user to Supabase.
 * - If a row with the same clerk_id already exists → returns it (no duplicate).
 * - If no row exists → inserts a new user with default 'student' role.
 * Returns the Supabase user record, or null if not authenticated.
 */
export async function syncUserToSupabase() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  const supabase = createAdminClient() as any

  // 1. Check if user already exists by clerk_id
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 = "no rows returned" — that's expected for new users
    console.error('Error checking user in Supabase:', fetchError)
    return null
  }

  // 2. User exists → update tenant_id if missing, then return
  if (existingUser) {
    if (!existingUser.tenant_id) {
      const activeTenant = await getActiveTenant()
      if (activeTenant) {
        const { data: updatedUser } = await supabase
          .from('users')
          .update({ tenant_id: activeTenant.id } as any)
          .eq('id', existingUser.id)
          .select()
          .single() as any
        return updatedUser || existingUser
      }
    }
    return existingUser
  }

  // 3. User does NOT exist → check for pre-registered pending account or create new
  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    clerkUser.phoneNumbers?.[0]?.phoneNumber ||
    `${clerkUser.id}@clerk.user`

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
    'New User'

  // Look for a pending user created by an Admin (e.g., pre-registered tutor)
  const { data: pendingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .like('clerk_id', 'pending_%')
    .single() as any

  if (pendingUser) {
    // Adopt the pending user row by updating it with real Clerk credentials
    const { data: adoptedUser, error: updateError } = await supabase
      .from('users')
      .update({
        clerk_id: clerkUser.id,
        name: pendingUser.name === 'Pending Tutor' ? name : pendingUser.name,
        avatar_url: clerkUser.imageUrl || null,
      } as any)
      .eq('id', pendingUser.id)
      .select()
      .single() as any

    if (updateError) {
      console.error('Error adopting pending user in Supabase:', updateError)
      return null
    }

    console.log(`✅ Pre-registered user synced: ${adoptedUser.clerk_id}`)
    return adoptedUser
  }

  const activeTenant = await getActiveTenant()

  // No pending user exists, do a fresh insert
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkUser.id,
      email,
      name,
      avatar_url: clerkUser.imageUrl || null,
      role: 'student', // Default role for new sign-ups
      tenant_id: activeTenant?.id || null,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating user in Supabase:', insertError)
    return null
  }

  console.log(`✅ New user synced to Supabase: ${newUser.clerk_id} (${newUser.email})`)
  return newUser
}
