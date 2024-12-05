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
import Image from '@tiptap/extension-image'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
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
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Type,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from 'lucide-react'
import { CategorySelector } from '../CategorySelector'
import { Category } from '@/types'
import { CodeBlock } from './extensions/CodeBlock'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  categories?: Category[]
  selectedCategoryId?: string | null
  onSelectCategory?: (categoryId: string | null) => void
}

function EditorComponent({
  content,
  onChange,
  categories = [],
  selectedCategoryId = null,
  onSelectCategory = () => {},
}: EditorProps) {
  const { isDarkMode } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      TextStyle,
      Color,
      FontFamily,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-t border-gray-300 dark:border-gray-700',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
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

  const handleImageUpload = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const editorButtons = [
    {
      tooltip: 'Undo',
      group: 'history',
      icon: <Undo className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().undo().run(),
      disabled: !editor?.can().undo(),
    },
    {
      tooltip: 'Redo',
      group: 'history',
      icon: <Redo className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().redo().run(),
      disabled: !editor?.can().redo(),
    },
    {
      tooltip: 'Bold',
      group: 'basic',
      icon: <Bold className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold'),
    },
    {
      tooltip: 'Italic',
      group: 'basic',
      icon: <Italic className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic'),
    },
    {
      tooltip: 'Underline',
      group: 'basic',
      icon: <UnderlineIcon className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: editor?.isActive('underline'),
    },
    {
      tooltip: 'Strike',
      group: 'basic',
      icon: <Strikethrough className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike'),
    },
    {
      tooltip: 'Code Block',
      group: 'insert',
      icon: <Code className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleNode('codeBlock', 'paragraph').run(),
      active: editor?.isActive('codeBlock'),
    },
    {
      tooltip: 'Bullet List',
      group: 'list',
      icon: <List className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('bulletList'),
    },
    {
      tooltip: 'Ordered List',
      group: 'list',
      icon: <ListOrdered className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('orderedList'),
    },
    {
      tooltip: 'Align Left',
      group: 'align',
      icon: <AlignLeft className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('left').run(),
      active: editor?.isActive({ textAlign: 'left' }),
    },
    {
      tooltip: 'Align Center',
      group: 'align',
      icon: <AlignCenter className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('center').run(),
      active: editor?.isActive({ textAlign: 'center' }),
    },
    {
      tooltip: 'Align Right',
      group: 'align',
      icon: <AlignRight className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setTextAlign('right').run(),
      active: editor?.isActive({ textAlign: 'right' }),
    },
    {
      tooltip: 'Heading 1',
      group: 'heading',
      icon: <Heading1 className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor?.isActive('heading', { level: 1 }),
    },
    {
      tooltip: 'Heading 2',
      group: 'heading',
      icon: <Heading2 className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor?.isActive('heading', { level: 2 }),
    },
    {
      tooltip: 'Heading 3',
      group: 'heading',
      icon: <Heading3 className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor?.isActive('heading', { level: 3 }),
    },
    {
      tooltip: 'Quote',
      group: 'list',
      icon: <Quote className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      active: editor?.isActive('blockquote'),
    },
    {
      tooltip: 'Insert Link',
      group: 'insert',
      icon: <LinkIcon className="w-4 h-4" />,
      onClick: () => {
        const url = window.prompt('Enter URL:')
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run()
        }
      },
      active: editor?.isActive('link'),
    },
    {
      tooltip: 'Insert Image',
      group: 'insert',
      icon: <ImageIcon className="w-4 h-4" />,
      onClick: handleImageUpload,
    },
    {
      tooltip: 'Insert Table',
      group: 'insert',
      icon: <TableIcon className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
    },
    {
      tooltip: 'Insert Horizontal Rule',
      group: 'insert',
      icon: <Minus className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      tooltip: 'Superscript',
      group: 'script',
      icon: <SuperscriptIcon className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleSuperscript().run(),
      active: editor?.isActive('superscript'),
    },
    {
      tooltip: 'Subscript',
      group: 'script',
      icon: <SubscriptIcon className="w-4 h-4" />,
      onClick: () => editor?.chain().focus().toggleSubscript().run(),
      active: editor?.isActive('subscript'),
    },
  ]

  return (
    <div className={`prose max-w-none w-full ${isDarkMode ? 'prose-invert' : ''}`}>
      <div className="flex flex-col gap-2 mb-4 p-2">
        <div className="flex items-center justify-between mb-2">
          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
          />
        </div>
        <div className={`
          flex flex-wrap gap-4 p-2 rounded-lg border
          ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'}
        `}>
          {/* History Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'history')
              .map((button, index) => (
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

          {/* Basic Formatting Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'basic')
              .map((button, index) => (
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

          {/* Headings Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'heading')
              .map((button, index) => (
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

          {/* Lists and Quote Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'list')
              .map((button, index) => (
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

          {/* Alignment Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'align')
              .map((button, index) => (
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

          {/* Super/Subscript Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'script')
              .map((button, index) => (
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

          {/* Insert Group */}
          <div className="flex gap-1">
            {editorButtons
              .filter(btn => btn.group === 'insert')
              .map((button, index) => (
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
        </div>
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