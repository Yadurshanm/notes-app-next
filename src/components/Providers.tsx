'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <div className="min-h-screen">
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </div>
  )
}