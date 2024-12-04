'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { ConfigProvider, theme } from 'antd'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          algorithm: document.documentElement.classList.contains('dark') 
            ? theme.darkAlgorithm 
            : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 6,
          },
          components: {
            Button: {
              animation: false,
              styleValue: {
                boxShadow: 'none',
                '&:hover': {
                  opacity: 0.85,
                },
              },
            },
            Wave: {
              disabled: true,
            },
          },
        }}
      >
        <div className="min-h-screen">
          {children}
          <Toaster richColors />
        </div>
      </ConfigProvider>
    </ThemeProvider>
  )
}