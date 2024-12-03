'use client'

import { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { supabase } from '@/lib/supabase'
import { SupabaseIcon } from './SupabaseIcon'

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

  return (
    <Tooltip title={error || statusText[status]}>
      <div className="flex items-center gap-2 cursor-help">
        <SupabaseIcon className={`
          transition-colors duration-200
          ${status === 'connected' ? 'text-green-500' : ''}
          ${status === 'connecting' ? 'text-blue-500' : ''}
          ${status === 'error' ? 'text-red-500' : ''}
        `} />
        <span className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
          {statusText[status]}
        </span>
      </div>
    </Tooltip>
  )
}