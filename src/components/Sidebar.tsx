'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { Input } from './Input'
import { Categories } from './Categories'
import { ConnectionStatus } from './ConnectionStatus'
import { Version } from './Version'
import { Note, Category } from '@/types'
import { Plus, Search, Star, ChevronRight, ChevronDown } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

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
  const [showCategories, setShowCategories] = useState(true)

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategoryId || note.category_id === selectedCategoryId
    return matchesSearch && matchesCategory
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // First by starred status
    if (a.is_starred && !b.is_starred) return -1
    if (!a.is_starred && b.is_starred) return 1
    // Then by order
    return a.order - b.order
  })

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const updatedNotes = [...notes]
    const [movedNote] = updatedNotes.splice(source.index, 1)
    updatedNotes.splice(destination.index, 0, movedNote)

    // Update order for all notes
    updatedNotes.forEach((note, index) => {
      note.order = index
    })

    // Update each note
    updatedNotes.forEach(note => {
      onUpdateNote(note)
    })
  }

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories Section */}
        <div className="flex-none">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`
              w-full px-4 py-2 flex items-center justify-between
              text-sm font-medium
              ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
            `}
          >
            <span>Categories</span>
            {showCategories ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {showCategories && (
            <div className="px-2">
              <Categories
                categories={categories}
                onCategoryChange={onUpdateCategories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={onSelectCategory}
              />
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="h-full overflow-auto p-2 space-y-2"
                >
                  {sortedNotes.map((note, index) => (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onSelectNote(note)}
                          className={`
                            group rounded-lg border p-3 cursor-pointer
                            transition-all duration-200
                            ${selectedNoteId === note.id
                              ? isDarkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-gray-100 border-gray-200'
                              : isDarkMode
                                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {note.title || 'Untitled'}
                            </h3>
                            {note.is_starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
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