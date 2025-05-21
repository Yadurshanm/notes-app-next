'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { Search, TrendingUp } from 'lucide-react'

interface SearchTrendsProps {
  notes: Note[]
}

export function SearchTrends({ notes }: SearchTrendsProps) {
  const { isDarkMode } = useTheme()

  const trends = useMemo(() => {
    // Get all words from notes
    const words = notes
      .map(note => note.content.replace(/<[^>]*>/g, ''))
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3) // Filter out short words

    // Count word frequencies
    const wordCounts = new Map<string, number>()
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    })

    // Convert to array and sort by frequency
    return Array.from(wordCounts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Get top 10 words
  }, [notes])

  const maxCount = Math.max(...trends.map(t => t.count))

  return (
    <div className={`
      p-4 rounded-lg border
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Common Words
        </h2>
      </div>

      <div className="space-y-3">
        {trends.map(({ word, count }) => {
          const percentage = (count / maxCount) * 100

          return (
            <div key={word} className="relative">
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {word}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {count} occurrences
                </span>
              </div>
              <div className={`
                h-2 rounded-full overflow-hidden
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}>
                <div
                  className={`h-full rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}