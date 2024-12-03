'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <div className="min-h-screen">
          {children}
          <Toaster richColors />
        </div>
      </ThemeProvider>
    </NextUIProvider>
  )
}