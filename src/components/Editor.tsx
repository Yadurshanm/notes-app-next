import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
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

export default function Editor({ content, onChange }: EditorProps) {
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
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
    },
    onCreate: ({ editor }) => {
      editor.setOptions({ immediateRender: false })
    },
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    enableCoreExtensions: true,
  }, [isMounted])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!isMounted || !editor) {
    return (
      <div className={`min-h-[200px] border rounded-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    )
  }

  const editorButtons = [
    {
      tooltip: 'Undo (⌘Z)',
      icon: <UndoOutlined />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      tooltip: 'Redo',
      icon: <RedoOutlined />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
    {
      tooltip: 'Bold',
      icon: <BoldOutlined />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
    },
    {
      tooltip: 'Italic',
      icon: <ItalicOutlined />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
    },
    {
      tooltip: 'Strike',
      icon: <StrikethroughOutlined />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive('strike'),
    },
    {
      tooltip: 'Bullet List',
      icon: <UnorderedListOutlined />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      tooltip: 'Ordered List',
      icon: <OrderedListOutlined />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
    {
      tooltip: 'Align Left',
      icon: <AlignLeftOutlined />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      active: editor.isActive({ textAlign: 'left' }),
    },
    {
      tooltip: 'Align Center',
      icon: <AlignCenterOutlined />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      active: editor.isActive({ textAlign: 'center' }),
    },
    {
      tooltip: 'Align Right',
      icon: <AlignRightOutlined />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      active: editor.isActive({ textAlign: 'right' }),
    },
  ]

  return (
    <div className="prose max-w-none w-full">
      <Space wrap className={`mb-4 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {editorButtons.map((button, index) => (
          <Tooltip key={index} title={button.tooltip}>
            <Button
              icon={button.icon}
              onClick={button.onClick}
              disabled={button.disabled}
              type={button.active ? 'primary' : 'default'}
            />
          </Tooltip>
        ))}
      </Space>
      <EditorContent editor={editor} className="min-h-[200px] border rounded-md p-4" />
    </div>
  )
}