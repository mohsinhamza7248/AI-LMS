import { headers } from 'next/headers'
import { getTenantBySlug } from '@/services/tenant.service'

export async function getActiveTenant() {
  const headerList = await headers()
  const host = headerList.get('host') || ''
  
  // Example: demo.lms.com or localhost:3000/?tenant=demo
  // For now, let's use a simple slug from the hostname or default to 'default'
  const domain = host.split(':')[0]
  const subdomain = domain.split('.')[0]
  
  // If subdomain is 'localhost' or 'www', we might want to use a query param or default
  if (subdomain === 'localhost' || subdomain === 'www') {
    // In dev, you could use a hardcoded slug or query param logic
    const tenant = await getTenantBySlug('demo')
    if (tenant) return tenant

    // Fallback: Get the first available tenant if 'demo' doesn't exist
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: firstTenant } = await supabase.from('tenants').select('*').limit(1).single()
    return firstTenant
  }

  return await getTenantBySlug(subdomain)
}
