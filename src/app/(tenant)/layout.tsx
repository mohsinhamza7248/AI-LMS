import { getActiveTenant } from '@/lib/tenant'
import { TenantProvider } from '@/features/tenant/TenantProvider'
import { redirect } from 'next/navigation'

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getActiveTenant()

  if (!tenant) {
    // If no tenant found and it's not the super-admin or marketing, maybe redirect
    // For now, we'll just provide a null tenant to the provider
  }

  return (
    <TenantProvider tenant={tenant || undefined}>
      {children}
    </TenantProvider>
  )
}
