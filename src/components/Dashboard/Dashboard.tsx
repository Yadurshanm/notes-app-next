'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { NotesOverview } from './widgets/NotesOverview'
import { RecentNotes } from './widgets/RecentNotes'
import { TagsCloud } from './widgets/TagsCloud'
import { WeeklyActivity } from './widgets/WeeklyActivity'
import { NotesChart } from './widgets/NotesChart'
import { SearchTrends } from './widgets/SearchTrends'
import { Note } from '@/types'
import { AppLayout } from '../AppLayout'

interface DashboardProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
}

export function Dashboard({ notes, onSelectNote }: DashboardProps) {
  const { isDarkMode } = useTheme()

  const content = (
    <div className="p-6 h-full overflow-auto">
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overview Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NotesOverview notes={notes} />
        </div>

        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <RecentNotes 
            notes={notes} 
            onSelectNote={onSelectNote} 
          />
        </div>

        {/* Tags Cloud */}
        <div>
          <TagsCloud notes={notes} />
        </div>

        {/* Weekly Activity */}
        <div className="lg:col-span-2">
          <WeeklyActivity notes={notes} />
        </div>

        {/* Notes Chart */}
        <div>
          <NotesChart notes={notes} />
        </div>

        {/* Search Trends */}
        <div className="lg:col-span-3">
          <SearchTrends notes={notes} />
        </div>
      </div>
    </div>
  )

  return <AppLayout content={content} />
}