'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ConfigProvider, theme } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'

interface ProvidersProps {
  children: ReactNode
}

function AntConfigProvider({ children }: ProvidersProps) {
  const { isDarkMode } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          borderRadius: 6,
        },
        components: {
          Button: {
            // Disable the wave animation
            animation: false,
            // Use box-shadow for hover effect instead
            styleValue: {
              boxShadow: 'none',
              '&:hover': {
                opacity: 0.85,
              },
            },
          },
          Wave: {
            // Disable wave effect globally
            disabled: true,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AntConfigProvider>
        <div className="min-h-screen">
          {children}
          <Toaster richColors />
        </div>
      </AntConfigProvider>
    </ThemeProvider>
  )
}