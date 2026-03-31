import { headers } from 'next/headers'
import { getTenantBySlug } from '@/services/tenant.service'

export async function getActiveTenant() {
  // 1. Environment Variable Override (Best for Vercel custom deployments)
  if (process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG) {
    const overrideTenant = await getTenantBySlug(process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG)
    if (overrideTenant) return overrideTenant
  }

  const headerList = await headers()
  const host = headerList.get('host') || ''
  
  // Example: demo.lms.com or localhost:3000/?tenant=demo
  const domain = host.split(':')[0]
  const subdomain = domain.split('.')[0]
  
  if (subdomain === 'localhost' || subdomain === 'www') {
    const tenant = await getTenantBySlug('demo')
    if (tenant) return tenant

    // Fallback: Get the first available tenant if 'demo' doesn't exist
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: firstTenant } = await supabase.from('tenants').select('*').limit(1).single()
    return firstTenant
  }

  // Uses 'ai-lms-zeta-nine' from 'ai-lms-zeta-nine.vercel.app'
  return await getTenantBySlug(subdomain)
}
