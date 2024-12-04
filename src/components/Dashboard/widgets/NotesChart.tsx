'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { BarChart3 } from 'lucide-react'

interface NotesChartProps {
  notes: Note[]
}

export function NotesChart({ notes }: NotesChartProps) {
  const { isDarkMode } = useTheme()

  const chartData = useMemo(() => {
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        date,
      }
    }).reverse()

    const data = months.map(({ month, year, date }) => {
      const nextMonth = new Date(date)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const count = notes.filter(note => {
        const noteDate = new Date(note.created_at)
        return noteDate >= date && noteDate < nextMonth
      }).length

      return { month, year, count }
    })

    const maxCount = Math.max(...data.map(d => d.count))

    return {
      data,
      maxCount,
    }
  }, [notes])

  return (
    <div className={`
      p-4 rounded-lg border h-full
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notes Created
        </h2>
      </div>

      <div className="flex items-end h-48 gap-2">
        {chartData.data.map(({ month, year, count }) => {
          const height = chartData.maxCount ? (count / chartData.maxCount) * 100 : 0
          
          return (
            <div
              key={`${month}-${year}`}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className={`w-full rounded-t transition-all duration-500 ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-500'
                }`}
                style={{ height: `${height}%` }}
              />
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {month}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}