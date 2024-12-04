'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ConfigProvider, theme } from 'antd'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 6,
            motion: false,
          },
          components: {
            Button: {
              motion: false,
              className: 'custom-btn',
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