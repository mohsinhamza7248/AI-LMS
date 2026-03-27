import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase admin client using the service role key.
 * This client bypasses RLS and should only be used in server-side code
 * (server actions, API routes, webhooks).
 * Unlike the cookie-based server client, this does not require cookies.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
