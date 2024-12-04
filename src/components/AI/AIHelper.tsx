'use client'

import { useState } from 'react'
import { Button } from '../Button'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Brain, 
  Mic, 
  StopCircle, 
  Loader2, 
  ChevronDown,
  MessageSquarePlus,
  Sparkles,
  FileText,
  ListChecks,
  Wand2,
} from 'lucide-react'

interface AIHelperProps {
  onAIResponse: (content: string) => void
  currentContent: string
}

export function AIHelper({ onAIResponse, currentContent }: AIHelperProps) {
  const { isDarkMode } = useTheme()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const aiActions = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      prompt: 'Please summarize the following text concisely:',
      description: 'Create a brief summary of your notes'
    },
    {
      id: 'actionItems',
      label: 'Extract Action Items',
      icon: ListChecks,
      prompt: 'Please extract all action items and tasks from the following text:',
      description: 'Pull out tasks and to-dos'
    },
    {
      id: 'expand',
      label: 'Expand & Enhance',
      icon: Sparkles,
      prompt: 'Please expand and enhance the following text with more details and examples:',
      description: 'Add more detail and depth'
    },
    {
      id: 'improve',
      label: 'Improve Writing',
      icon: Wand2,
      prompt: 'Please improve the writing style and clarity of the following text:',
      description: 'Enhance clarity and style'
    },
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        await handleAudioTranscription(audioBlob)
      }

      setAudioChunks([])
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleAudioTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      // Create form data with audio file
      const formData = new FormData()
      formData.append('audio', audioBlob)

      // Send to your API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Transcription failed')

      const { text } = await response.json()
      onAIResponse(text)
    } catch (error) {
      console.error('Transcription error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAIAction = async (actionId: string) => {
    setIsProcessing(true)
    try {
      const action = aiActions.find(a => a.id === actionId)
      if (!action) return

      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentContent,
          prompt: action.prompt,
          action: actionId,
        }),
      })

      if (!response.ok) throw new Error('AI processing failed')

      const { text } = await response.json()
      onAIResponse(text)
    } catch (error) {
      console.error('AI processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Brain className="w-4 h-4" />
          AI Assistant
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        <Button
          variant={isRecording ? 'danger' : 'default'}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          className="gap-2"
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Record
            </>
          )}
        </Button>

        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        )}
      </div>

      {isOpen && (
        <div className={`
          absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg z-10
          ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        `}>
          <div className="p-2 space-y-1">
            {aiActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAIAction(action.id)}
                disabled={isProcessing}
                className={`
                  w-full px-3 py-2 rounded-md text-left flex items-center gap-3
                  transition-colors
                  ${isDarkMode
                    ? 'hover:bg-gray-700 text-gray-200'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <action.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{action.label}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}