'use client'

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Check, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const LANGUAGES = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
]

export function CodeBlockView({ node, updateAttributes, extension }: NodeViewProps) {
  const { isDarkMode } = useTheme()
  const [showLanguages, setShowLanguages] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      const content = node.textContent
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <NodeViewWrapper className="relative group">
      <div className={`
        relative rounded-lg overflow-hidden
        ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
      `}>
        {/* Language selector and copy button */}
        <div className={`
          flex items-center justify-between p-2 text-sm
          ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'}
        `}>
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className={`
                px-2 py-1 rounded text-sm font-mono
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              `}
            >
              {node.attrs.language || 'plain'}
            </button>
            
            {showLanguages && (
              <div className={`
                absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg z-10 py-1
                ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
              `}>
                {LANGUAGES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      updateAttributes({ language: value })
                      setShowLanguages(false)
                    }}
                    className={`
                      w-full px-4 py-1.5 text-left text-sm
                      ${isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                      ${node.attrs.language === value && 'font-semibold'}
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className={`
              p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
            `}
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Code content */}
        <div className="p-4 font-mono text-sm overflow-x-auto">
          <NodeViewContent as="pre" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}