'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Input, Layout, message, Tooltip } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types'
import NotesList from '@/components/NotesList'
import Editor from '@/components/Editor'

const { Header, Sider, Content } = Layout

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode, toggleTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useKeyboardShortcuts({
    onNewNote: createNote,
    onSave: updateNote,
    onSearch: () => searchInputRef.current?.focus(),
  })

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      message.error('Error fetching notes')
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title: 'Untitled', content: '' }])
        .select()

      if (error) throw error
      if (data) {
        setNotes([data[0], ...notes])
        setSelectedNote(data[0])
        setTitle(data[0].title)
        setContent(data[0].content)
      }
    } catch (error) {
      message.error('Error creating note')
    }
  }

  const updateNote = async () => {
    if (!selectedNote) return

    try {
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', selectedNote.id)

      if (error) throw error

      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, title, content } : note
      )
      setNotes(updatedNotes)
      message.success('Note saved')
    } catch (error) {
      message.error('Error saving note')
    }
  }

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const debouncedSave = (noteTitle: string, noteContent: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (selectedNote) {
        updateNote(noteTitle, noteContent)
      }
    }, 1000)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedSave(newTitle, content)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    debouncedSave(title, newContent)
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error

      setNotes(notes.filter(note => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
        setTitle('')
        setContent('')
      }
      message.success('Note deleted')
    } catch (error) {
      message.error('Error deleting note')
    }
  }

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes
    const query = searchQuery.toLowerCase()
    return notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().replace(/<[^>]*>/g, '').includes(query)
    )
  }, [notes, searchQuery])

  return (
    <Layout className="h-screen">
      <Sider width={300} className={`border-r ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createNote}
              className="flex-1"
            >
              New Note (⌘N)
            </Button>
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <Button
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleTheme}
              />
            </Tooltip>
          </div>
          <Input
            ref={searchInputRef}
            placeholder="Search notes... (⌘K)"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleNoteSelect}
          onDeleteNote={deleteNote}
        />
      </Sider>
      <Layout>
        <Header className={`p-4 border-b ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <Input
            placeholder="Note title"
            value={title}
            onChange={handleTitleChange}
            className="text-xl"
          />
        </Header>
        <Content className="p-4">
          <Editor content={content} onChange={handleContentChange} />
          <div className="mt-4 text-sm text-gray-500">
            Press ⌘S to save • Last saved: {new Date().toLocaleTimeString()}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}