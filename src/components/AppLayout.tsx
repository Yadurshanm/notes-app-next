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
    <div className="h-screen flex">
      <div className={`w-[300px] border-r flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {sidebar}
      </div>
      <div className="flex-1 flex flex-col">
        {content}
      </div>
    </div>
  )
}