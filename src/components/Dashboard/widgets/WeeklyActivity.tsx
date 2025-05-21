'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { Activity } from 'lucide-react'

interface WeeklyActivityProps {
  notes: Note[]
}

export function WeeklyActivity({ notes }: WeeklyActivityProps) {
  const { isDarkMode } = useTheme()

  const weeklyData = useMemo(() => {
    const now = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    // Get data for the last 7 days
    const activityMap = new Map<string, number>()
    const hourlyMap = new Map<number, number>()

    notes.forEach(note => {
      const date = new Date(note.created_at)
      const dayDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayDiff < 7) {
        const dayName = days[date.getDay()]
        activityMap.set(dayName, (activityMap.get(dayName) || 0) + 1)
        hourlyMap.set(date.getHours(), (hourlyMap.get(date.getHours()) || 0) + 1)
      }
    })

    const maxDayActivity = Math.max(...Array.from(activityMap.values(), v => v || 0))
    const maxHourActivity = Math.max(...Array.from(hourlyMap.values(), v => v || 0))

    return {
      days: days.map(day => ({
        name: day,
        count: activityMap.get(day) || 0,
        intensity: maxDayActivity ? (activityMap.get(day) || 0) / maxDayActivity : 0
      })),
      hours: hours.map(hour => ({
        hour,
        count: hourlyMap.get(hour) || 0,
        intensity: maxHourActivity ? (hourlyMap.get(hour) || 0) / maxHourActivity : 0
      }))
    }
  }, [notes])

  const getActivityColor = (intensity: number) => {
    if (intensity === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    if (intensity < 0.25) return isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
    if (intensity < 0.5) return isDarkMode ? 'bg-blue-700/50' : 'bg-blue-300'
    if (intensity < 0.75) return isDarkMode ? 'bg-blue-500/50' : 'bg-blue-500'
    return isDarkMode ? 'bg-blue-400' : 'bg-blue-700'
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}${period}`
  }

  return (
    <div className={`
      p-4 rounded-lg border
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activity Overview
        </h2>
      </div>

      <div className="space-y-6">
        {/* Daily Activity */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Daily Activity
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {weeklyData.days.map(({ name, count, intensity }) => (
              <div key={name} className="text-center">
                <div
                  className={`
                    h-8 rounded-md mb-1
                    ${getActivityColor(intensity)}
                  `}
                  title={`${count} note${count === 1 ? '' : 's'}`}
                />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Activity */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Hourly Distribution
          </h3>
          <div className="grid grid-cols-8 gap-1">
            {weeklyData.hours.map(({ hour, count, intensity }) => (
              <div key={hour} className="text-center">
                <div
                  className={`
                    h-8 rounded-md mb-1
                    ${getActivityColor(intensity)}
                  `}
                  title={`${count} note${count === 1 ? '' : 's'} at ${formatHour(hour)}`}
                />
                {hour % 3 === 0 && (
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}