'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { Clock, Star } from 'lucide-react'

interface RecentNotesProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
}

export function RecentNotes({ notes, onSelectNote }: RecentNotesProps) {
  const { isDarkMode } = useTheme()

  const recentNotes = useMemo(() => {
    return [...notes]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  }, [notes])

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  }

  return (
    <div className={`
      p-4 rounded-lg border h-full
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Notes
        </h2>
      </div>

      <div className="space-y-3">
        {recentNotes.map(note => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`
              p-3 rounded-lg cursor-pointer
              ${isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {note.title || 'Untitled'}
                {note.isStarred && (
                  <Star className="inline-block w-4 h-4 ml-2 text-yellow-500" />
                )}
              </h3>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(note.updated_at)}
              </span>
            </div>
            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {note.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className={`
                      px-2 py-0.5 rounded-full text-xs
                      ${isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}