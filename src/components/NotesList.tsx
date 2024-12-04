import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardBody, Button, Popover } from '@nextui-org/react'
import { Trash2 } from 'lucide-react'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  const { isDarkMode } = useTheme()
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
              : ''
          }`}
          onPress={() => onSelectNote(note)}
        >
          <CardBody className="p-3">
            <div className="flex items-center w-full gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : ''}`}>
                  {note.title || 'Untitled'}
                </h3>
                <p className={`truncate text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
                </p>
              </div>
              <Popover placement="left">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Popover.Content>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Delete note</div>
                    <div className="text-tiny">Are you sure you want to delete this note?</div>
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="flat" 
                        color="default"
                        onPress={(e) => e.stopPropagation()}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onPress={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Popover.Content>
              </Popover>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

