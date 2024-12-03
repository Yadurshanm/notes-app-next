'use client'

import { useEffect, useState } from 'react'
import { Badge, Tooltip } from 'antd'
import { supabase } from '@/lib/supabase'

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
      <Badge
        status={statusColors[status] as any}
        text={statusText[status]}
        className="cursor-help"
      />
    </Tooltip>
  )
}