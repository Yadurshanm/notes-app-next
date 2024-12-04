'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { Tags } from 'lucide-react'

interface TagCount {
  tag: string
  count: number
}

interface TagsCloudProps {
  notes: Note[]
}

export function TagsCloud({ notes }: TagsCloudProps) {
  const { isDarkMode } = useTheme()

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })

    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [notes])

  const maxCount = Math.max(...tagCounts.map(t => t.count))
  const minCount = Math.min(...tagCounts.map(t => t.count))
  const range = maxCount - minCount

  const getTagSize = (count: number) => {
    const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl']
    if (range === 0) return sizes[2]
    const normalized = (count - minCount) / range
    const index = Math.floor(normalized * (sizes.length - 1))
    return sizes[index]
  }

  const getTagColor = (count: number) => {
    const colors = isDarkMode
      ? ['text-gray-400', 'text-gray-300', 'text-gray-200', 'text-gray-100', 'text-white']
      : ['text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900']
    
    if (range === 0) return colors[2]
    const normalized = (count - minCount) / range
    const index = Math.floor(normalized * (colors.length - 1))
    return colors[index]
  }

  return (
    <div className={`
      p-4 rounded-lg border h-full
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <Tags className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Tags Cloud
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {tagCounts.map(({ tag, count }) => (
          <span
            key={tag}
            className={`
              ${getTagSize(count)}
              ${getTagColor(count)}
              transition-colors duration-200 cursor-default
              hover:text-blue-500
            `}
            title={`${count} note${count === 1 ? '' : 's'}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}