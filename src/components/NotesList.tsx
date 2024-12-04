import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardBody, Button, Popover } from '@nextui-org/react'
import { Trash2, FileText } from 'lucide-react'
import { useState } from 'react'
import { PressEvent } from '@react-types/shared'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  const { isDarkMode } = useTheme()
  const [isPopoverOpen, setIsPopoverOpen] = useState<string | null>(null)

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
        <Card
          key={note.id}
          isPressable
          isHoverable
          className={`w-full ${
            selectedNoteId === note.id 
              ? isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              : isDarkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}
          onPress={() => onSelectNote(note)}
        >
          <CardBody className="p-3">
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
                <Popover 
                  placement="left"
                  isOpen={isPopoverOpen === note.id}
                  onOpenChange={(open) => setIsPopoverOpen(open ? note.id : null)}
                >
                  <Popover.Trigger>
                    <span className="cursor-pointer">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        className={isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-100'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </span>
                  </Popover.Trigger>
                  <Popover.Content>
                    {(onClose: ((e: PressEvent) => void) | undefined) => (
                      <div className="px-4 py-3">
                        <div className="text-small font-bold">Delete note</div>
                        <div className="text-tiny">Are you sure you want to delete this note?</div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <Button 
                            size="sm" 
                            variant="light"
                            onPress={onClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onPress={() => {
                              onDeleteNote(note.id);
                              onClose();
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </Popover.Content>
                </Popover>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}