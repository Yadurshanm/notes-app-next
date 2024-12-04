import { Note } from '@/types'
import { useTheme } from '@/contexts/ThemeContext'
import { List, Popconfirm } from 'antd'
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  const { isDarkMode } = useTheme()

  if (notes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-4">
        <FileTextOutlined className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
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
    <List
      className="h-full overflow-auto"
      dataSource={notes}
      split={false}
      renderItem={(note) => (
        <List.Item
          className={`
            transition-colors duration-150 py-3 border-0 mb-1 rounded cursor-pointer
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
                {(note.content || '').replace(/<[^>]*>/g, '').slice(0, 100)}
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
              okButtonProps={{ danger: true }}
              okText="Delete"
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