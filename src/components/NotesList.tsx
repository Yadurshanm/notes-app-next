import { List } from 'antd'
import { Note } from '@/types'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
}

export default function NotesList({ notes, selectedNoteId, onSelectNote }: NotesListProps) {
  return (
    <List
      className="h-full overflow-auto"
      dataSource={notes}
      renderItem={(note) => (
        <List.Item
          className={`cursor-pointer hover:bg-gray-100 ${
            selectedNoteId === note.id ? 'bg-gray-200' : ''
          }`}
          onClick={() => onSelectNote(note)}
        >
          <div className="w-full">
            <h3 className="font-medium">{note.title || 'Untitled'}</h3>
            <p className="text-gray-500 truncate">
              {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
            </p>
          </div>
        </List.Item>
      )}
    />
  )
}