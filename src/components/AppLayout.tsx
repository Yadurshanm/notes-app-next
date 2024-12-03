'use client'

import { ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface AppLayoutProps {
  sidebar: ReactNode
  content: ReactNode
}

export function AppLayout({ sidebar, content }: AppLayoutProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <div className={`w-[300px] border-r flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {content}
      </div>
    </div>
  )
}