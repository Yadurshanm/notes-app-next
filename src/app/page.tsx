'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Input, message, Tooltip } from 'antd'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ConnectionStatus } from '@/components/ConnectionStatus'
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
import { AppLayout } from '@/components/AppLayout'

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode, toggleTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching notes'
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    try {
      const newNote = {
        title: 'Untitled',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select('*')
        .single()

      if (error) throw error
      if (data) {
        setNotes([data, ...notes])
        setSelectedNote(data)
        setTitle(data.title)
        setNoteContent(data.content)
        message.success('New note created')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      message.error('Error creating note')
    }
  }

  const updateNote = async (noteTitle?: string, noteContent?: string) => {
    if (!selectedNote) {
      message.warning('No note selected')
      return
    }

    const updatedTitle = noteTitle ?? title
    const updatedContent = noteContent ?? ''
    const now = new Date().toISOString()

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          title: updatedTitle, 
          content: updatedContent,
          updated_at: now
        })
        .eq('id', selectedNote.id)
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        const updatedNotes = notes.map((note) =>
          note.id === selectedNote.id ? data : note
        )
        setNotes(updatedNotes)
        setSelectedNote(data)
        message.success('Note saved')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      message.error('Error saving note')
    }
  }

  const handleNoteSelect = (note: Note) => {
    // Use a single state update to prevent race conditions
    requestAnimationFrame(() => {
      setSelectedNote(note)
      setTitle(note.title)
      setNoteContent(note.content)
    })
  }

  const debouncedSave = (noteTitle: string, noteContent: string) => {
    if (!selectedNote) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Only save if there are actual changes
    if (noteTitle !== selectedNote.title || noteContent !== selectedNote.content) {
      saveTimeoutRef.current = setTimeout(() => {
        updateNote(noteTitle, noteContent)
      }, 1000)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedSave(newTitle, noteContent)
  }

  const handleContentChange = (newContent: string) => {
    setNoteContent(newContent)
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
        setNoteContent('')
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

  useKeyboardShortcuts({
    onNewNote: createNote,
    onSave: updateNote,
    onSearch: () => searchInputRef.current?.focus(),
  })

  if (loading || error) {
    return (
      <div className="h-screen flex items-center justify-center">
        {loading ? (
          <LoadingSpinner message="Loading notes..." />
        ) : (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button type="primary" onClick={fetchNotes}>
              Retry
            </Button>
          </div>
        )}
      </div>
    )
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 flex-none">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={createNote}
            className="flex-1"
          >
            New Note
            <span className="ml-1 text-xs opacity-70">(⌘N)</span>
          </Button>
          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <Button
              icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggleTheme}
            />
          </Tooltip>
        </div>
        <div className="flex items-center justify-between">
          <ConnectionStatus />
        </div>
        <Input
          ref={searchInputRef}
          placeholder="Search notes... (⌘K)"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          className={`${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleNoteSelect}
          onDeleteNote={deleteNote}
        />
      </div>
    </div>
  )

  const content = (
    <>
      <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Input
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          className={`text-xl ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
        />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <Editor content={noteContent} onChange={handleContentChange} />
        <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Press ⌘S to save • Last saved: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </>
  )

  return <AppLayout sidebar={sidebar} content={content} />
}