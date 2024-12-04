'use client'

import dynamic from 'next/dynamic'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Redo,
  Undo,
  Code,
} from 'lucide-react'
import { CodeBlock } from './extensions/CodeBlock'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  noteId?: string // Add noteId prop to track current note
}

function EditorComponent({ content, onChange, noteId }: EditorProps) {
  const { isDarkMode } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState(noteId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset editor content when noteId changes
  useEffect(() => {
    if (noteId !== currentNoteId) {
      setCurrentNoteId(noteId)
      if (editor) {
        editor.commands.setContent(content)
      }
    }
  }, [noteId, content, currentNoteId])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-disc list-outside ml-4',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Superscript,
      Subscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      CodeBlock,
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
    },
    content,
    onUpdate: ({ editor }) => {
      // Only trigger onChange if we're still editing the same note
      if (noteId === currentNoteId) {
        onChange(editor.getHTML())
      }
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!isMounted || !editor) {
    return (
      <div className="prose max-w-none w-full">
        <div className="flex flex-wrap gap-2 mb-4 p-2">
          {[...Array(10)].map((_, i) => (
            <Button
              key={i}
              disabled
              size="sm"
              isIconOnly
              className="w-8 h-8 animate-pulse"
            />
          ))}
        </div>
        <div className={`min-h-[200px] border rounded-md p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="animate-pulse space-y-3">
            <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded w-5/6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>
    )
  }

  const editorButtons = [
    {
      tooltip: 'Undo (⌘Z)',
      icon: <Undo className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().undo().run(),
      disabled: !editor?.can().undo(),
    },
    {
      tooltip: 'Redo (⌘⇧Z)',
      icon: <Redo className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().redo().run(),
      disabled: !editor?.can().redo(),
    },
    {
      tooltip: 'Bold (⌘B)',
      icon: <Bold className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold'),
    },
    {
      tooltip: 'Italic (⌘I)',
      icon: <Italic className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic'),
    },
    {
      tooltip: 'Underline (⌘U)',
      icon: <UnderlineIcon className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: editor?.isActive('underline'),
    },
    {
      tooltip: 'Strike (⌘⇧X)',
      icon: <Strikethrough className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike'),
    },
    {
      tooltip: 'Code Block (⌘⇧C)',
      icon: <Code className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleNode('codeBlock', 'paragraph').run(),
      active: editor?.isActive('codeBlock'),
    },
    {
      tooltip: 'Bullet List (⌘⇧8)',
      icon: <List className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('bulletList'),
    },
    {
      tooltip: 'Ordered List (⌘⇧7)',
      icon: <ListOrdered className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('orderedList'),
    },
    {
      tooltip: 'Align Left (⌘⇧L)',
      icon: <AlignLeft className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('left').run(),
      active: editor?.isActive({ textAlign: 'left' }),
    },
    {
      tooltip: 'Align Center (⌘⇧E)',
      icon: <AlignCenter className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('center').run(),
      active: editor?.isActive({ textAlign: 'center' }),
    },
    {
      tooltip: 'Align Right (⌘⇧R)',
      icon: <AlignRight className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('right').run(),
      active: editor?.isActive({ textAlign: 'right' }),
    },
  ]

  return (
    <div className={`prose max-w-none w-full ${isDarkMode ? 'prose-invert' : ''}`}>
      <div className="flex flex-wrap gap-2 mb-4 p-2">
        {editorButtons.map((button, index) => (
          <div key={index} title={button.tooltip}>
            <Button
              size="sm"
              isIconOnly
              variant={button.active ? "primary" : "default"}
              onClick={button.onClick}
              disabled={button.disabled}
              className="w-8 h-8"
            >
              {button.icon}
            </Button>
          </div>
        ))}
      </div>
      <EditorContent 
        editor={editor} 
        className={`min-h-[200px] border rounded-md p-4 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-100 prose-invert' 
            : 'bg-white border-gray-200'
        }`} 
      />
    </div>
  )
}

export const Editor = dynamic(() => Promise.resolve(EditorComponent), {
  ssr: false,
}) as typeof EditorComponent