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
import { Button, Space, Tooltip } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

export function Editor({ content, onChange }: EditorProps) {
  const { isDarkMode } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor(
    !isMounted ? null : {
      immediatelyRender: false,
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
    ],
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
    },
    content: isMounted ? content : '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && isMounted && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor, isMounted])

  if (!isMounted || !editor) {
    return (
      <div className="prose max-w-none w-full">
        <div className={`mb-4 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex gap-2">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded animate-pulse ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} 
              />
            ))}
          </div>
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
      icon: <UndoOutlined />,
      onClick: () => editor?.chain().focus().undo().run(),
      disabled: !editor?.can().undo(),
    },
    {
      tooltip: 'Redo (⌘⇧Z)',
      icon: <RedoOutlined />,
      onClick: () => editor?.chain().focus().redo().run(),
      disabled: !editor?.can().redo(),
    },
    {
      tooltip: 'Bold (⌘B)',
      icon: <BoldOutlined />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold'),
    },
    {
      tooltip: 'Italic (⌘I)',
      icon: <ItalicOutlined />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic'),
    },
    {
      tooltip: 'Underline (⌘U)',
      icon: <UnderlineOutlined />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: editor?.isActive('underline'),
    },
    {
      tooltip: 'Strike (⌘⇧X)',
      icon: <StrikethroughOutlined />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike'),
    },
    {
      tooltip: 'Bullet List (⌘⇧8)',
      icon: <UnorderedListOutlined />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('bulletList'),
    },
    {
      tooltip: 'Ordered List (⌘⇧7)',
      icon: <OrderedListOutlined />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('orderedList'),
    },
    {
      tooltip: 'Align Left (⌘⇧L)',
      icon: <AlignLeftOutlined />,
      onClick: () => editor?.chain().focus().setTextAlign('left').run(),
      active: editor?.isActive({ textAlign: 'left' }),
    },
    {
      tooltip: 'Align Center (⌘⇧E)',
      icon: <AlignCenterOutlined />,
      onClick: () => editor?.chain().focus().setTextAlign('center').run(),
      active: editor?.isActive({ textAlign: 'center' }),
    },
    {
      tooltip: 'Align Right (⌘⇧R)',
      icon: <AlignRightOutlined />,
      onClick: () => editor?.chain().focus().setTextAlign('right').run(),
      active: editor?.isActive({ textAlign: 'right' }),
    },
  ]

  return (
    <div className="prose max-w-none w-full">
      <Space wrap className={`mb-4 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        {editorButtons.map((button, index) => (
          <Tooltip key={index} title={button.tooltip}>
            <Button
              icon={button.icon}
              onClick={button.onClick}
              disabled={button.disabled}
              type={button.active ? 'primary' : 'default'}
              className={isDarkMode ? 'border-gray-700' : ''}
            />
          </Tooltip>
        ))}
      </Space>
      <EditorContent 
        editor={editor} 
        className={`min-h-[200px] border rounded-md p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200'
        }`} 
      />
    </div>
  )
}

