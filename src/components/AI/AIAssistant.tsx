'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '../Button'
import { 
  Brain, 
  Mic, 
  StopCircle, 
  Loader2,
  MessageSquare,
  Sparkles,
  FileText,
  ListChecks,
  Wand2,
  X,
  Maximize2,
  Minimize2,
  Volume2,
} from 'lucide-react'
import { toast } from 'sonner'

interface AIAssistantProps {
  onInsertText: (text: string) => void
  currentContent: string
}

export function AIAssistant({ onInsertText, currentContent }: AIAssistantProps) {
  const { isDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([])
  const [input, setInput] = useState('')
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickActions = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      prompt: 'Please summarize this text concisely:',
      description: 'Create a brief summary'
    },
    {
      id: 'tasks',
      label: 'Extract Tasks',
      icon: ListChecks,
      prompt: 'Extract all action items and tasks from this text:',
      description: 'Find action items'
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: Sparkles,
      prompt: 'Expand this text with more details and examples:',
      description: 'Add more detail'
    },
    {
      id: 'improve',
      label: 'Improve',
      icon: Wand2,
      prompt: 'Improve the writing style and clarity:',
      description: 'Enhance writing'
    },
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        await handleTranscription(audioBlob)
      }

      mediaRecorder.current = recorder
      recorder.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Transcription failed')

      const { text } = await response.json()
      
      // Add transcription to chat
      setMessages(prev => [...prev, 
        { role: 'system', content: 'Audio transcribed:' },
        { role: 'user', content: text }
      ])
      
      // Process with AI
      await processWithAI(text)
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error('Failed to transcribe audio')
    } finally {
      setIsProcessing(false)
    }
  }

  const processWithAI = async (text: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: text }
          ]
        }),
      })

      if (!response.ok) throw new Error('AI processing failed')

      const { message } = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: message }])
    } catch (error) {
      console.error('AI processing error:', error)
      toast.error('Failed to process with AI')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickAction = async (action: typeof quickActions[0]) => {
    setIsProcessing(true)
    try {
      const prompt = `${action.prompt}\n\n${currentContent}`
      setMessages(prev => [...prev, { role: 'user', content: prompt }])
      await processWithAI(prompt)
    } catch (error) {
      console.error('Quick action error:', error)
      toast.error('Failed to process quick action')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    await processWithAI(userMessage)
  }

  if (!isOpen) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Brain className="w-4 h-4" />
        AI Assistant
      </Button>
    )
  }

  return (
    <div className={`
      fixed inset-x-4 bottom-4 z-50 rounded-lg shadow-lg border
      transition-all duration-200
      ${isExpanded ? 'top-4' : 'h-[600px]'}
      ${isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Header */}
      <div className={`
        flex items-center justify-between p-4 border-b
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Assistant
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              p-2 rounded-md transition-colors
              ${isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className={`
              p-2 rounded-md transition-colors
              ${isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`
        grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-b
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
      `}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            disabled={isProcessing}
            className={`
              p-3 rounded-lg text-left transition-colors
              ${isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <action.icon className={`
              w-5 h-5 mb-2
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {action.label}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {action.description}
            </div>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              flex flex-col
              ${message.role === 'assistant' ? 'items-start' : 'items-end'}
            `}
          >
            <div className={`
              max-w-[80%] rounded-lg px-4 py-2
              ${message.role === 'assistant'
                ? isDarkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
              }
            `}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`
        p-4 border-t
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? 'danger' : 'default'}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className="gap-2"
          >
            {isRecording ? (
              <>
                <StopCircle className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Record
              </>
            )}
          </Button>

          {audioURL && (
            <audio controls src={audioURL} className="h-8" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isProcessing}
            className={`
              flex-1 px-4 py-2 rounded-md border
              ${isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }
            `}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}