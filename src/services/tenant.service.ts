import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types/database.types'

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getAllTenants() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createTenant(tenant: {
  name: string
  slug: string
  logo_url?: string
  theme?: Record<string, string>
  feature_flags?: Record<string, boolean>
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      ...tenant,
      theme: tenant.theme || {
        primary_color: '#6366f1',
        secondary_color: '#8b5cf6',
        platform_name: tenant.name,
      },
      feature_flags: tenant.feature_flags || {
        enable_payments: false,
        enable_ai_chat: true,
        enable_voice_ai: false,
        enable_live_classes: true,
      },
      subscription_status: 'trial',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTenant(id: string, updates: Partial<Tenant>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tenants')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
