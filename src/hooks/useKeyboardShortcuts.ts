import { useEffect } from 'react'

interface ShortcutHandlers {
  onNewNote?: () => void
  onSave?: () => void
  onSearch?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const { onNewNote, onSave, onSearch } = handlers

  useEffect(() => {
    if (!onNewNote && !onSave && !onSearch) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (modifier) {
        switch (e.key.toLowerCase()) {
          case 'n':
            if (onNewNote) {
              e.preventDefault()
              onNewNote()
            }
            break
          case 's':
            if (onSave) {
              e.preventDefault()
              onSave()
            }
            break
          case 'k':
            if (onSearch) {
              e.preventDefault()
              onSearch()
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNewNote, onSave, onSearch])
}