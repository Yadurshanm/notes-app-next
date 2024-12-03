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
import { useEffect, useState, forwardRef } from 'react'
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
  HighlightOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  HeadingOutlined,
} from '@ant-design/icons'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(({ content, onChange }, ref) => {
  const { isDarkMode } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor(
    {
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
      autofocus: true,
      enableInputRules: true,
      enablePasteRules: true,
      handleDOMEvents: {
        keydown: (_, event) => {
          // Handle keyboard shortcuts
          if (event.metaKey || event.ctrlKey) {
            switch (event.key.toLowerCase()) {
              case 'u':
                event.preventDefault()
                editor?.chain().focus().toggleUnderline().run()
                return true
              case 'h':
                if (event.shiftKey) {
                  event.preventDefault()
                  editor?.chain().focus().toggleHighlight().run()
                  return true
                }
                break
              case '1':
                if (event.altKey) {
                  event.preventDefault()
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  return true
                }
                break
              case '9':
                if (event.shiftKey) {
                  event.preventDefault()
                  editor?.chain().focus().toggleTaskList().run()
                  return true
                }
                break
              case '.':
                event.preventDefault()
                editor?.chain().focus().toggleSuperscript().run()
                return true
              case ',':
                event.preventDefault()
                editor?.chain().focus().toggleSubscript().run()
                return true
            }
          }
          return false
        },
      },
      editorProps: {
        attributes: {
          class: 'prose max-w-none w-full focus:outline-none',
        },
      },
      onCreate: ({ editor }) => {
        editor.setOptions({ immediateRender: false })
      },
      content: isMounted ? content : '',
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML())
      },
    },
    [isMounted]
  )

  useEffect(() => {
    if (editor && isMounted && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor, isMounted])

  if (!isMounted || !editor) {
    return (
      <div className="prose max-w-none w-full">
        <div className={`mb-4 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
        <div className={`min-h-[200px] border rounded-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="animate-pulse space-y-3">
            <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded w-5/6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>
    )
  }

  const editorButtons = editor ? [
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
      tooltip: 'Highlight (⌘⇧H)',
      icon: <HighlightOutlined />,
      onClick: () => editor?.chain().focus().toggleHighlight().run(),
      active: editor?.isActive('highlight'),
    },
    {
      tooltip: 'Heading 1 (⌘⌥1)',
      icon: <HeadingOutlined />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor?.isActive('heading', { level: 1 }),
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
      tooltip: 'Task List (⌘⇧9)',
      icon: <CheckSquareOutlined />,
      onClick: () => editor?.chain().focus().toggleTaskList().run(),
      active: editor?.isActive('taskList'),
    },
    {
      tooltip: 'Superscript (⌘.)',
      icon: <VerticalAlignTopOutlined />,
      onClick: () => editor?.chain().focus().toggleSuperscript().run(),
      active: editor?.isActive('superscript'),
    },
    {
      tooltip: 'Subscript (⌘,)',
      icon: <VerticalAlignBottomOutlined />,
      onClick: () => editor?.chain().focus().toggleSubscript().run(),
      active: editor?.isActive('subscript'),
    },
    {
      tooltip: 'Link (⌘K)',
      icon: <LinkOutlined />,
      onClick: () => {
        const url = window.prompt('Enter URL')
        if (url && editor) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      active: editor?.isActive('link'),
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
  ] : []

  return (
    <div className="prose max-w-none w-full" ref={ref}>
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

export default Editor