'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SupabaseIcon } from './SupabaseIcon'
import { useTheme } from '@/contexts/ThemeContext'

export function ConnectionStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase
          .from('notes')
          .select('count')
          .limit(1)
          .single()

        if (error) {
          setStatus('error')
          setError(error.message)
        } else {
          setStatus('connected')
          setError(null)
        }
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Connection failed')
      }
    }

    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    checkConnection() // Initial check

    return () => clearInterval(interval)
  }, [])

  const statusText = {
    connecting: 'Connecting to Supabase...',
    connected: 'Connected to Supabase',
    error: 'Connection Error'
  }

  return (
    <div 
      className="flex items-center gap-1.5 cursor-help group relative"
      title={error || statusText[status]}
    >
      <SupabaseIcon className={`
        w-3.5 h-3.5 transition-colors duration-200
        ${status === 'connected' ? 'text-green-500' : ''}
        ${status === 'connecting' ? 'text-blue-500' : ''}
        ${status === 'error' ? 'text-red-500' : ''}
      `} />
      <span className={`${status === 'error' ? 'text-red-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Error'}
      </span>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {error || statusText[status]}
      </div>
    </div>
  )
}