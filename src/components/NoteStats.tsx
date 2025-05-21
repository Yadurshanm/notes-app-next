'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Clock, 
  Calendar, 
  Hash, 
  AlignLeft, 
  Type, 
  List, 
  Link as LinkIcon 
} from 'lucide-react'

interface NoteStatsProps {
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export function NoteStats({ content, createdAt, updatedAt, tags }: NoteStatsProps) {
  const { isDarkMode } = useTheme()

  const stats = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const words = plainText.trim().split(/\s+/).filter(Boolean)
    const sentences = plainText.split(/[.!?]+/).filter(Boolean)
    const paragraphs = content.split(/<\/?p>/).filter(Boolean)
    const lists = (content.match(/<\/?[uo]l>/g) || []).length / 2
    const links = (content.match(/<a[^>]*>/g) || []).length

    return {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lists,
      links,
    }
  }, [content])

  const StatItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
        <span className="font-medium">{value}</span>
        <span className="text-sm text-gray-500 ml-1">{label}</span>
      </div>
    </div>
  )

  return (
    <div className={`
      rounded-lg border p-4 space-y-4
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Note Statistics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <StatItem
          icon={Calendar}
          label="Created"
          value={new Date(createdAt).toLocaleDateString()}
        />
        <StatItem
          icon={Clock}
          label="Updated"
          value={new Date(updatedAt).toLocaleDateString()}
        />
        <StatItem
          icon={Type}
          label="Words"
          value={stats.words}
        />
        <StatItem
          icon={AlignLeft}
          label="Paragraphs"
          value={stats.paragraphs}
        />
        <StatItem
          icon={List}
          label="Lists"
          value={stats.lists}
        />
        <StatItem
          icon={LinkIcon}
          label="Links"
          value={stats.links}
        />
        <StatItem
          icon={Hash}
          label="Tags"
          value={tags.length}
        />
      </div>
    </div>
  )
}