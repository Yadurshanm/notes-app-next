import { List, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Note } from '@/types'

interface NotesListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export default function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  return (
    <List
      className="h-full overflow-auto"
      dataSource={notes}
      renderItem={(note) => (
        <List.Item
          className={`hover:bg-gray-100 ${
            selectedNoteId === note.id ? 'bg-gray-200' : ''
          }`}
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
                className="text-red-500 hover:text-red-700"
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          ]}
        >
          <div className="w-full cursor-pointer" onClick={() => onSelectNote(note)}>
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