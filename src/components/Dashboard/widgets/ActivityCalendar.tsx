'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { Calendar } from 'lucide-react'

interface ActivityCalendarProps {
  notes: Note[]
}

export function ActivityCalendar({ notes }: ActivityCalendarProps) {
  const { isDarkMode } = useTheme()

  const activityData = useMemo(() => {
    const now = new Date()
    const days = Array.from({ length: 365 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const activityMap = new Map<string, number>()
    notes.forEach(note => {
      const date = new Date(note.created_at).toISOString().split('T')[0]
      activityMap.set(date, (activityMap.get(date) || 0) + 1)
    })

    const maxActivity = Math.max(...Array.from(activityMap.values()))

    return days.map(date => ({
      date,
      count: activityMap.get(date) || 0,
      intensity: activityMap.get(date) ? (activityMap.get(date) || 0) / maxActivity : 0,
    }))
  }, [notes])

  const getActivityColor = (intensity: number) => {
    if (intensity === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    if (intensity < 0.25) return isDarkMode ? 'bg-green-900' : 'bg-green-100'
    if (intensity < 0.5) return isDarkMode ? 'bg-green-700' : 'bg-green-300'
    if (intensity < 0.75) return isDarkMode ? 'bg-green-500' : 'bg-green-500'
    return isDarkMode ? 'bg-green-400' : 'bg-green-700'
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className={`
      p-4 rounded-lg border
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activity Calendar
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex text-xs mb-1">
          {months.map(month => (
            <div key={month} style={{ width: '8.33%' }} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              {month}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-52 gap-1">
          {Array.from({ length: 7 }).map((_, weekday) => (
            <div key={weekday} className="grid gap-1">
              {activityData
                .filter((_, i) => i % 7 === weekday)
                .map(({ date, count, intensity }) => (
                  <div
                    key={date}
                    className={`
                      w-3 h-3 rounded-sm
                      ${getActivityColor(intensity)}
                    `}
                    title={`${date}: ${count} note${count === 1 ? '' : 's'}`}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}