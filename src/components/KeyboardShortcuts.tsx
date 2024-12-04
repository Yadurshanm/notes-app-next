'use client'

import { useState } from 'react'
import { Keyboard } from 'lucide-react'
import { Button } from './Button'
import { useTheme } from '@/contexts/ThemeContext'

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()

  const shortcuts = [
    { keys: '⌘ N', description: 'Create new note' },
    { keys: '⌘ S', description: 'Save current note' },
    { keys: '⌘ K', description: 'Search notes' },
    { keys: '⌘ /', description: 'Show keyboard shortcuts' },
  ]

  return (
    <>
      <Button
        variant="default"
        size="sm"
        isIconOnly
        onClick={() => setIsOpen(true)}
        title="Keyboard shortcuts (⌘/)"
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className={`
              max-w-md w-full rounded-lg p-6 relative
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Keyboard Shortcuts
            </h2>
            <div className="space-y-3">
              {shortcuts.map(({ keys, description }) => (
                <div key={keys} className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {description}
                  </span>
                  <kbd className={`
                    px-2 py-1 text-sm rounded
                    ${isDarkMode 
                      ? 'bg-gray-700 text-gray-300 border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                    border
                  `}>
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              className="mt-6 w-full"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}