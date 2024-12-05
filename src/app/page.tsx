'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ConnectionStatus } from '@/components/ConnectionStatus'
import { Version } from '@/components/Version'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { supabase } from '@/lib/supabase'
import { Note, Category } from '@/types'
import { Editor } from '@/components/Editor'
import { AppLayout } from '@/components/AppLayout'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode } = useTheme()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const createTimeoutRef = useRef<NodeJS.Timeout>()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchData()
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (createTimeoutRef.current) clearTimeout(createTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const noteId = searchParams.get('note')
    if (noteId && notes.length > 0) {
      const note = notes.find(n => n.id === noteId)
      if (note) {
        handleNoteSelect(note)
      }
    }
  }, [notes, searchParams])

  const fetchData = async () => {
    try {
      setError(null)
      const [notesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('notes')
          .select('*')
          .order('order', { ascending: true }),
        supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true })
      ])

      if (notesResponse.error) throw notesResponse.error
      if (categoriesResponse.error) throw categoriesResponse.error

      setNotes(notesResponse.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (categoryId?: string | null) => {
    const targetCategoryId = categoryId ?? selectedCategory
    
    // If we're creating a note in a category, make sure the category exists
    if (targetCategoryId) {
      const { data: categoryExists } = await supabase
        .from('categories')
        .select('id')
        .eq('id', targetCategoryId)
        .single()

      if (!categoryExists) {
        toast.error('Category not found')
        return
      }
    }
    try {
      const newNote = {
        title: 'Untitled',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_id: targetCategoryId,
        tags: [],
        is_starred: false,
        order: notes.filter(n => n.category_id === targetCategoryId).length
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
        toast.success('New note created')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error('Error creating note')
    }
  }

  const updateNote = async (noteTitle?: string, noteContent?: string) => {
    if (!selectedNote) {
      toast.warning('No note selected')
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
        toast.success('Note saved')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      toast.error('Error saving note')
    }
  }

  const handleNoteSelect = (note: Note) => {
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

    if (noteTitle !== selectedNote.title || noteContent !== selectedNote.content) {
      saveTimeoutRef.current = setTimeout(() => {
        updateNote(noteTitle, noteContent)
      }, 1000)
    }
  }

  const debouncedCreate = async (noteTitle: string, noteContent: string) => {
    if (createTimeoutRef.current) {
      clearTimeout(createTimeoutRef.current)
    }

    createTimeoutRef.current = setTimeout(async () => {
      try {
        const newNote = {
          title: noteTitle,
          content: noteContent,
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
          toast.success('Note created')
        }
      } catch (error) {
        console.error('Error creating note:', error)
        toast.error('Error creating note')
      }
    }, 1000)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    
    if (!selectedNote && (newTitle || noteContent)) {
      debouncedCreate(newTitle, noteContent)
    } else {
      debouncedSave(newTitle, noteContent)
    }
  }

  const handleContentChange = (newContent: string) => {
    setNoteContent(newContent)
    
    if (!selectedNote && (title || newContent)) {
      debouncedCreate(title, newContent)
    } else {
      debouncedSave(title, newContent)
    }
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
      toast.success('Note deleted')
    } catch (error) {
      toast.error('Error deleting note')
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
      <AppLayout
        content={
          <div className="h-screen flex items-center justify-center">
            {loading ? (
              <LoadingSpinner message="Loading notes..." />
            ) : (
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchData}>
                  Retry
                </Button>
              </div>
            )}
          </div>
        }
      />
    )
  }

  const sidebar = (
    <Sidebar
      notes={notes}
      categories={categories}
      selectedNoteId={selectedNote?.id || null}
      selectedCategoryId={selectedCategory}
      onSelectNote={handleNoteSelect}
      onSelectCategory={setSelectedCategory}
      onCreateNote={createNote}
      onUpdateNote={(note) => updateNote(note.title, note.content)}
      onUpdateCategories={setCategories}
    />
  )

  const content = (
    <>
      <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Input
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          size="lg"
          variant="borderless"
        />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <Editor 
          content={noteContent} 
          onChange={handleContentChange}

          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Press ⌘S to save • Last saved: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </>
  )

  return <AppLayout sidebar={sidebar} content={content} />
}