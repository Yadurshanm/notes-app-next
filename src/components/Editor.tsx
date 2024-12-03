import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
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
  const editor = useEditor({
    extensions: [StarterKit],
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

  if (!editor) {
    return null
  }

  return (
    <div className="prose max-w-none w-full">
      <Space wrap className={`mb-4 p-2 border rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Tooltip title="Undo (⌘Z)">
          <Button
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </Tooltip>
        <Tooltip title="Bold">
          <Button
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type={editor.isActive('bold') ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type={editor.isActive('italic') ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Strike">
          <Button
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            type={editor.isActive('strike') ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Bullet List">
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type={editor.isActive('bulletList') ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Ordered List">
          <Button
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type={editor.isActive('orderedList') ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Align Left">
          <Button
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Align Center">
          <Button
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title="Align Right">
          <Button
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
          />
        </Tooltip>
      </Space>
      <EditorContent editor={editor} className="min-h-[200px] border rounded-md p-4" />
    </div>
  )
}