'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { FileText, LayoutDashboard, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { isDarkMode, toggleTheme } = useTheme()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md transition-colors
        ${isActive(href)
          ? isDarkMode
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-900'
          : isDarkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  )

  return (
    <div className={`
      flex items-center justify-between px-4 py-2 border-b
      ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-2">
        <NavLink href="/" icon={FileText} label="Notes" />
        <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      </div>

      <button
        onClick={toggleTheme}
        className={`
          p-2 rounded-md transition-colors
          ${isDarkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}