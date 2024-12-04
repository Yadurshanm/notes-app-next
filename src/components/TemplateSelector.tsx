'use client'

import { useState } from 'react'
import { Button } from './Button'
import { useTheme } from '@/contexts/ThemeContext'
import { FileText, Layout, CheckSquare, Calendar, Book } from 'lucide-react'

interface Template {
  id: string
  name: string
  icon: React.ReactNode
  content: string
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    icon: <FileText className="w-5 h-5" />,
    content: '',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    icon: <Calendar className="w-5 h-5" />,
    content: `# Meeting Notes

## Date: ${new Date().toLocaleDateString()}

## Attendees
- 

## Agenda
1. 
2. 
3. 

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
- `
  },
  {
    id: 'todo',
    name: 'Todo List',
    icon: <CheckSquare className="w-5 h-5" />,
    content: `# Todo List

## Today
- [ ] 

## This Week
- [ ] 

## Later
- [ ] 

## Notes
- `
  },
  {
    id: 'article',
    name: 'Article',
    icon: <Book className="w-5 h-5" />,
    content: `# Title

## Introduction

## Main Points
1. 
2. 
3. 

## Conclusion

## References
- `
  },
]

interface TemplateSelectorProps {
  onSelect: (content: string) => void
  onClose: () => void
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const { isDarkMode } = useTheme()
  const [selectedId, setSelectedId] = useState<string>('blank')

  const handleSelect = () => {
    const template = templates.find(t => t.id === selectedId)
    if (template) {
      onSelect(template.content)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`
        max-w-2xl w-full rounded-lg p-6
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Choose Template
          </h2>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`
                p-4 rounded-lg border cursor-pointer
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                ${selectedId === template.id
                  ? isDarkMode
                    ? 'bg-gray-700 border-blue-500'
                    : 'bg-blue-50 border-blue-500'
                  : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-50'
                }
              `}
              onClick={() => setSelectedId(template.id)}
            >
              <div className="flex items-center gap-3">
                {template.icon}
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {template.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="default"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSelect}
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  )
}