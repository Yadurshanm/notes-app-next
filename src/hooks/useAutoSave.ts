import { useState, useEffect, useCallback } from 'react'

type SaveStatus = 'saved' | 'saving' | 'error'

export function useAutoSave(
  onSave: () => Promise<void>,
  debounceMs: number = 1000
) {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout>()

  const save = useCallback(async () => {
    try {
      setStatus('saving')
      await onSave()
      setStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      console.error('Auto-save error:', error)
      setStatus('error')
    }
  }, [onSave])

  const debouncedSave = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    const timeout = setTimeout(save, debounceMs)
    setSaveTimeout(timeout)
  }, [save, debounceMs, saveTimeout])

  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  return {
    status,
    lastSaved,
    debouncedSave,
    save,
  }
}