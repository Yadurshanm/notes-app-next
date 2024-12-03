import { List, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { forwardRef } from 'react'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

const NotesList = forwardRef<HTMLDivElement, NotesListProps>(({ notes, selectedNoteId, onSelectNote, onDeleteNote }, ref) => {
  const { isDarkMode } = useTheme()
  return (
    <List
      ref={ref}
      className="h-full overflow-auto"
      dataSource={notes}
      split={false}
      renderItem={(note) => (
        <List.Item
          className={`
            transition-colors duration-150 py-3 border-0 mb-1 rounded
            ${isDarkMode
              ? `hover:bg-gray-800 ${selectedNoteId === note.id ? 'bg-gray-700' : ''}`
              : `hover:bg-gray-100 ${selectedNoteId === note.id ? 'bg-gray-200' : ''}`
            }
          `}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex items-center w-full gap-3 px-4">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : ''}`}>
                {note.title || 'Untitled'}
              </h3>
              <p className={`truncate text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
              </p>
            </div>
            <Popconfirm
              title="Delete note"
              description="Are you sure you want to delete this note?"
              onConfirm={(e) => {
                e?.stopPropagation();
                onDeleteNote(note.id);
              }}
              onCancel={(e) => e?.stopPropagation()}
            >
              <DeleteOutlined
                className={`
                  transition-colors duration-150 text-lg flex-shrink-0
                  ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}
                `}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </div>
        </List.Item>
      )}
    />
  )
}

export default NotesList