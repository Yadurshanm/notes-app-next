'use client'

import { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { supabase } from '@/lib/supabase'
import { SupabaseIcon } from './SupabaseIcon'
import { useTheme } from '@/contexts/ThemeContext'


export function ConnectionStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)

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

  const statusColors = {
    connecting: 'blue',
    connected: 'green',
    error: 'red'
  }

  const statusText = {
    connecting: 'Connecting to Supabase...',
    connected: 'Connected to Supabase',
    error: 'Connection Error'
  }

  const { isDarkMode } = useTheme()

  return (
    <Tooltip title={error || statusText[status]} mouseEnterDelay={0.5}>
      <div className="flex items-center gap-1.5 cursor-help">
        <SupabaseIcon className={`
          w-3.5 h-3.5 transition-colors duration-200
          ${status === 'connected' ? 'text-green-500' : ''}
          ${status === 'connecting' ? 'text-blue-500' : ''}
          ${status === 'error' ? 'text-red-500' : ''}
        `} />
        <span className={`${status === 'error' ? 'text-red-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Error'}
        </span>
      </div>
    </Tooltip>
  )
}

