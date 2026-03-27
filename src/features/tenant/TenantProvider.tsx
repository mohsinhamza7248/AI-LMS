'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Tenant } from '@/types/database.types'

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children, tenant: initialTenant }: { children: React.ReactNode, tenant?: Tenant }) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant || null)
  const [isLoading, setIsLoading] = useState(!initialTenant)

  useEffect(() => {
    if (tenant) {
      // Apply dynamic CSS variables from tenant theme
      const root = document.documentElement
      root.style.setProperty('--primary', tenant.theme.primary_color)
      root.style.setProperty('--secondary', tenant.theme.secondary_color)
    }
  }, [tenant])

  return (
    <TenantContext.Provider value={{ tenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
