'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Brain, Mic } from 'lucide-react'

export function AIConnectionStatus() {
  const [gptStatus, setGptStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [speechStatus, setSpeechStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [error, setError] = useState<string | null>(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    async function checkConnections() {
      try {
        // Check GPT connection
        const gptResponse = await fetch('/api/ai/health')
        if (gptResponse.ok) {
          setGptStatus('connected')
        } else {
          setGptStatus('error')
          const gptError = await gptResponse.json()
          setError(gptError.message)
        }

        // Check Speech service connection
        const speechResponse = await fetch('/api/speech/health')
        if (speechResponse.ok) {
          setSpeechStatus('connected')
        } else {
          setSpeechStatus('error')
          const speechError = await speechResponse.json()
          setError(speechError.message)
        }
      } catch (err) {
        setGptStatus('error')
        setSpeechStatus('error')
        setError('Failed to check AI services')
      }
    }

    checkConnections()
    const interval = setInterval(checkConnections, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center gap-1.5 cursor-help group relative"
        title={error || `GPT Status: ${gptStatus}`}
      >
        <Brain className={`
          w-3.5 h-3.5 transition-colors duration-200
          ${gptStatus === 'connected' ? 'text-green-500' : ''}
          ${gptStatus === 'connecting' ? 'text-blue-500' : ''}
          ${gptStatus === 'error' ? 'text-red-500' : ''}
        `} />
        <span className={`${gptStatus === 'error' ? 'text-red-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          GPT
        </span>
      </div>

      <div 
        className="flex items-center gap-1.5 cursor-help group relative"
        title={error || `Speech Status: ${speechStatus}`}
      >
        <Mic className={`
          w-3.5 h-3.5 transition-colors duration-200
          ${speechStatus === 'connected' ? 'text-green-500' : ''}
          ${speechStatus === 'connecting' ? 'text-blue-500' : ''}
          ${speechStatus === 'error' ? 'text-red-500' : ''}
        `} />
        <span className={`${speechStatus === 'error' ? 'text-red-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Speech
        </span>
      </div>
    </div>
  )
}