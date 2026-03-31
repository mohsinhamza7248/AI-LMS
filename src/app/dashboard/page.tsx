import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { syncUserToSupabase } from '@/actions/sync-user'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Sync user to Supabase on login:
  //  - If clerk_id exists in DB → returns existing user (no duplicate)
  //  - If clerk_id not in DB → creates new account with default 'student' role
  const user = await syncUserToSupabase()

  if (!user) {
    // Something went wrong with sync — redirect to home
    redirect('/')
  }

  const role = user.role as string

  // Redirect based on role
  if (role === 'super_admin') {
    redirect('/super-admin')
  } else if (role === 'admin') {
    redirect('/admin')
  } else if (role === 'tutor') {
    redirect('/tutor')
  } else {
    // Default to student — my learning page
    redirect('/my-learning')
  }
}
