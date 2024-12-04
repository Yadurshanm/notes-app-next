'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Share2, Copy, Link, Mail } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from 'sonner'

interface ShareDialogProps {
  noteId: string
  noteTitle: string
  onClose: () => void
}

export function ShareDialog({ noteId, noteTitle, onClose }: ShareDialogProps) {
  const { isDarkMode } = useTheme()
  const [shareUrl] = useState(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/shared/${noteId}`
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Shared Note: ${noteTitle}`)
    const body = encodeURIComponent(`Check out this note: ${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`
        max-w-md w-full rounded-lg p-6
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Share Note
          </h2>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={copyToClipboard}
                title="Copy link"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={copyToClipboard}
            >
              <Link className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={shareViaEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>

          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Anyone with the link can view this note
          </div>
        </div>
      </div>
    </div>
  )
}