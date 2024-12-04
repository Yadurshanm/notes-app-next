'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Note } from '@/types'
import { FileText, Tags, Clock, Star } from 'lucide-react'

interface OverviewCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function OverviewCard({ title, value, icon, trend }: OverviewCardProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className={`
      p-4 rounded-lg border
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {icon}
        </div>
        {trend && (
          <span className={`
            text-sm font-medium
            ${trend.isPositive ? 'text-green-500' : 'text-red-500'}
          `}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <h3 className={`mt-4 text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </p>
    </div>
  )
}

interface NotesOverviewProps {
  notes: Note[]
}

export function NotesOverview({ notes }: NotesOverviewProps) {
  const { isDarkMode } = useTheme()

  const stats = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const totalNotes = notes.length
    const totalTags = new Set(notes.flatMap(note => note.tags || [])).size
    const recentNotes = notes.filter(note => new Date(note.created_at) > lastMonth).length
    const starredNotes = notes.filter(note => note.isStarred).length

    // Calculate trends (mock data for now)
    const trends = {
      notes: { value: 12, isPositive: true },
      tags: { value: 8, isPositive: true },
      recent: { value: 5, isPositive: false },
      starred: { value: 15, isPositive: true },
    }

    return {
      totalNotes,
      totalTags,
      recentNotes,
      starredNotes,
      trends,
    }
  }, [notes])

  return (
    <>
      <OverviewCard
        title="Total Notes"
        value={stats.totalNotes}
        icon={<FileText className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />}
        trend={stats.trends.notes}
      />
      <OverviewCard
        title="Total Tags"
        value={stats.totalTags}
        icon={<Tags className={isDarkMode ? 'text-green-400' : 'text-green-500'} />}
        trend={stats.trends.tags}
      />
      <OverviewCard
        title="Recent Notes"
        value={stats.recentNotes}
        icon={<Clock className={isDarkMode ? 'text-purple-400' : 'text-purple-500'} />}
        trend={stats.trends.recent}
      />
      <OverviewCard
        title="Starred Notes"
        value={stats.starredNotes}
        icon={<Star className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} />}
        trend={stats.trends.starred}
      />
    </>
  )
}