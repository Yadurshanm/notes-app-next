'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { App, ConfigProvider, theme } from 'antd'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 6,
          },
          components: {
            Button: {
              algorithm: true,
            },
          },
        }}
      >
        <App>
          <div className="min-h-screen">
            {children}
            <Toaster richColors />
          </div>
        </App>
      </ConfigProvider>
    </ThemeProvider>
  )
}