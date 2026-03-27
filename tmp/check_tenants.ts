import { createClient } from './src/lib/supabase/server'

async function listTenants() {
  const supabase = await createClient()
  const { data: tenants, error } = await supabase.from('tenants').select('*')
  if (error) {
    console.error('Error fetching tenants:', error)
    return
  }
  console.log('Available tenants:', JSON.stringify(tenants, null, 2))
}

listTenants()
