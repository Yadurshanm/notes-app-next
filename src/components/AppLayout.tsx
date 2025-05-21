'use client'

import { ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Navigation } from './Navigation'

interface AppLayoutProps {
  sidebar?: ReactNode
  content: ReactNode
}

export function AppLayout({ sidebar, content }: AppLayoutProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navigation />
      <div className="flex-1 flex min-h-0">
        {sidebar && (
          <div className={`
            w-[300px] border-r flex flex-col
            ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
          `}>
            {sidebar}
          </div>
        )}
        <div className={`
          flex-1 flex flex-col min-w-0
          ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
        `}>
          {content}
        </div>
      </div>
    </div>
  )
}