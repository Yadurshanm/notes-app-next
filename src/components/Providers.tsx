'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <div className="min-h-screen">
          {children}
        </div>
      </ThemeProvider>
    </NextUIProvider>
  )
}