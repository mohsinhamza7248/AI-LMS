'use client'

import { useEffect } from 'react'
import { useTenant } from './TenantProvider'

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant()

  useEffect(() => {
    if (tenant?.theme) {
      const root = document.documentElement
      root.style.setProperty('--primary', tenant.theme.primary_color)
      root.style.setProperty('--secondary', tenant.theme.secondary_color)
      // Update document title if needed
      document.title = `${tenant.theme.platform_name} | Powered by Parth Gautam Faundation`
    }
  }, [tenant])

  return <>{children}</>
}
