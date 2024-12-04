import { useState, useEffect } from 'react'

export function useWindowFocus() {
  const [isFocused, setIsFocused] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onFocus = () => setIsFocused(true)
    const onBlur = () => setIsFocused(false)
    const onVisibilityChange = () => setIsFocused(!document.hidden)

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return isFocused
}