'use client'

import { useTheme } from '@/contexts/ThemeContext'

export function Version() {
  const { isDarkMode } = useTheme()
  const version = 'v1.0.0'

  return (
    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`}>
      {version}
    </div>
  )
}