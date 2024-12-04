'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(initialDarkMode)
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 6,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}