'use client'

import { useEffect, useState } from 'react'
import { Dashboard } from '@/components/Dashboard/Dashboard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      console.error('Error fetching notes:', error)
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectNote = (note: Note) => {
    router.push(`/?note=${note.id}`)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    )
  }

  return <Dashboard notes={notes} onSelectNote={handleSelectNote} />
}