'use client'

import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { FileText, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  const { isDarkMode } = useTheme()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  if (notes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-4">
        <FileText className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <div>
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No notes yet</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Create your first note to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto space-y-2 p-2">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`
            relative group rounded-lg border p-3 cursor-pointer
            transition-all duration-200
            ${selectedNoteId === note.id 
              ? isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
              : isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center w-full gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {note.title || 'Untitled'}
              </h3>
              <p className={`truncate text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {(note.content || '').replace(/<[^>]*>/g, '').slice(0, 100)}
              </p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              {deleteConfirmId === note.id ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      onDeleteNote(note.id)
                      setDeleteConfirmId(null)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="danger"
                  isIconOnly
                  onClick={() => setDeleteConfirmId(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}