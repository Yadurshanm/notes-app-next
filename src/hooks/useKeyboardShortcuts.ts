import { useEffect } from 'react'

interface ShortcutHandlers {
  onNewNote?: () => void
  onSave?: () => void
  onSearch?: () => void
}

export function useKeyboardShortcuts({
  onNewNote,
  onSave,
  onSearch,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (modifier) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            onNewNote?.()
            break
          case 's':
            e.preventDefault()
            onSave?.()
            break
          case 'k':
            e.preventDefault()
            onSearch?.()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNewNote, onSave, onSearch])
}