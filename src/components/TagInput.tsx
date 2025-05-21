'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const { isDarkMode } = useTheme()

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()])
      }
      setInput('')
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className={`
      flex flex-wrap gap-2 p-2 rounded-md border min-h-[42px]
      ${isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      {tags.map(tag => (
        <span
          key={tag}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-sm
            ${isDarkMode
              ? 'bg-gray-700 text-gray-200'
              : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Add tags..." : ""}
        className={`
          flex-1 min-w-[120px] outline-none text-sm
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        `}
      />
    </div>
  )
}