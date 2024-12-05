'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { VERSION } from '@/version'

export function Version() {
  const { isDarkMode } = useTheme()

  return (
    <div className="group relative flex items-center">
      <div className={`
        text-xs font-medium
        ${isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}
        transition-colors duration-200
      `}>
        {VERSION.toString()}
      </div>
      
      {/* Tooltip */}
      <div className={`
        absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg
        whitespace-nowrap text-sm opacity-0 group-hover:opacity-100
        transition-opacity pointer-events-none z-50
        ${isDarkMode
          ? 'bg-gray-800 text-gray-200 border border-gray-700'
          : 'bg-white text-gray-700 border border-gray-200 shadow-lg'
        }
      `}>
        {VERSION.getLatestChanges()}
        <div className={`
          absolute -bottom-1 right-4 w-2 h-2 rotate-45
          ${isDarkMode
            ? 'bg-gray-800 border-r border-b border-gray-700'
            : 'bg-white border-r border-b border-gray-200'
          }
        `} />
      </div>
    </div>
  )
}

