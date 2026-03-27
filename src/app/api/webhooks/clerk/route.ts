import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const supabase = createAdminClient()

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data
    const email = email_addresses[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'New User'

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', id)
      .single()

    if (existingUser) {
      // User exists → update their profile (name, email, avatar)
      const { error } = await supabase
        .from('users')
        .update({
          email,
          name,
          avatar_url: image_url,
        })
        .eq('clerk_id', id)

      if (error) console.error('Error updating user in Supabase:', error)
    } else {
      // User does NOT exist → create new account
      const { error } = await supabase.from('users').insert({
        clerk_id: id,
        email,
        name,
        avatar_url: image_url,
        role: 'student',
      })

      if (error) console.error('Error creating user in Supabase:', error)
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data

    if (id) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', id)

      if (error) console.error('Error deleting user from Supabase:', error)
      else console.log(`🗑️ User ${id} deleted from Supabase`)
    }
  }

  return new Response('', { status: 200 })
}
