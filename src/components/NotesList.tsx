import { List, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export default function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  const { isDarkMode } = useTheme()
  return (
    <List
      className="h-full overflow-auto"
      dataSource={notes}
      renderItem={(note) => (
        <List.Item
          className={`
            transition-colors duration-150
            ${isDarkMode
              ? `hover:bg-gray-800 ${selectedNoteId === note.id ? 'bg-gray-700' : ''}`
              : `hover:bg-gray-100 ${selectedNoteId === note.id ? 'bg-gray-200' : ''}`
            }
          `}
          actions={[
            <Popconfirm
              key="delete"
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
                  transition-colors duration-150
                  ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}
                `}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          ]}
        >
          <div 
            className="w-full cursor-pointer" 
            onClick={() => onSelectNote(note)}
          >
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
              {note.title || 'Untitled'}
            </h3>
            <p className={`truncate text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
            </p>
          </div>
        </List.Item>
      )}
    />
  )
}