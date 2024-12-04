'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { Input } from './Input'
import { Categories } from './Categories'
import { NotesList } from './NotesList'
import { ConnectionStatus } from './ConnectionStatus'
import { Version } from './Version'
import { Note, Category } from '@/types'
import { Plus, Search } from 'lucide-react'

interface SidebarProps {
  notes: Note[]
  categories: Category[]
  selectedNoteId: string | null
  selectedCategoryId: string | null
  onSelectNote: (note: Note) => void
  onSelectCategory: (categoryId: string | null) => void
  onCreateNote: () => void
  onUpdateNote: (note: Note) => void
  onUpdateCategories: (categories: Category[]) => void
}

export function Sidebar({
  notes,
  categories,
  selectedNoteId,
  selectedCategoryId,
  onSelectNote,
  onSelectCategory,
  onCreateNote,
  onUpdateNote,
  onUpdateCategories,
}: SidebarProps) {
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter notes by search query and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategoryId || note.category_id === selectedCategoryId
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3 flex-none">
        <Button
          variant="primary"
          onClick={onCreateNote}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
          <span className="ml-1 text-xs opacity-70">(⌘N)</span>
        </Button>

        <Input
          placeholder="Search notes... (⌘K)"
          prefix={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="px-4 pb-4 flex-none">
        <Categories
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
          onUpdateCategories={onUpdateCategories}
          onCreateNote={(categoryId) => {
            onCreateNote()
            if (categoryId) {
              onSelectCategory(categoryId)
            }
          }}
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-hidden">
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
        />
      </div>

      {/* Footer */}
      <div className={`
        p-2 border-t flex items-center justify-between text-xs
        ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
      `}>
        <div className="flex items-center gap-4">
          <ConnectionStatus />
          <Version />
        </div>
      </div>
    </div>
  )
}