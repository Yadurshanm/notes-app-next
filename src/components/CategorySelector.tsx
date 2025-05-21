'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Category } from '@/types'
import { Folder } from 'lucide-react'

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySelectorProps) {
  const { isDarkMode } = useTheme()

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="relative group">
      <button
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
          transition-colors
          ${isDarkMode
            ? 'hover:bg-gray-800 text-gray-300'
            : 'hover:bg-gray-100 text-gray-600'
          }
        `}
      >
        <Folder className="w-4 h-4" />
        {selectedCategoryId
          ? categories.find(c => c.id === selectedCategoryId)?.name || 'Select Category'
          : 'Select Category'
        }
      </button>

      <div className={`
        absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg z-10
        opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
        transition-opacity
        ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
      `}>
        <div className="py-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`
              w-full px-4 py-2 text-left text-sm flex items-center gap-2
              transition-colors
              ${!selectedCategoryId
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Folder className="w-4 h-4" />
            Uncategorized
          </button>

          {sortedCategories.map(category => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                w-full px-4 py-2 text-left text-sm flex items-center gap-2
                transition-colors
                ${selectedCategoryId === category.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Folder className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}