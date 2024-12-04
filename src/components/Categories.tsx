'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { Input } from './Input'
import { Folder, Plus, X, ChevronRight, ChevronDown } from 'lucide-react'
import { Category } from '@/types'

interface CategoriesProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
  onUpdateCategories: (categories: Category[]) => void
}

export function Categories({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onUpdateCategories,
}: CategoriesProps) {
  const { isDarkMode } = useTheme()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      parentId: null,
      order: categories.length,
    }

    onUpdateCategories([...categories, newCategory])
    setNewCategoryName('')
  }

  const deleteCategory = (categoryId: string) => {
    onUpdateCategories(categories.filter(cat => cat.id !== categoryId))
    if (selectedCategoryId === categoryId) {
      onSelectCategory(null)
    }
  }

  const updateCategoryName = (categoryId: string, newName: string) => {
    onUpdateCategories(
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
    )
  }

  return (
    <div className="space-y-2">
      {/* Add Category */}
      <div className="flex gap-2">
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addCategory()
            }
          }}
          placeholder="New category..."
          size="sm"
        />
        <Button
          onClick={addCategory}
          disabled={!newCategoryName.trim()}
          size="sm"
          isIconOnly
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories List */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            w-full px-3 py-2 rounded-md flex items-center gap-2
            transition-colors text-sm
            ${selectedCategoryId === null
              ? isDarkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-900'
              : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <Folder className="w-4 h-4" />
          All Notes
        </button>

        {sortedCategories.map((category) => (
          <div key={category.id} className="group flex items-center gap-1">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`
                flex-1 px-3 py-2 rounded-md flex items-center gap-2
                transition-colors text-sm
                ${selectedCategoryId === category.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Folder className="w-4 h-4" />
              {editingCategoryId === category.id ? (
                <input
                  autoFocus
                  value={category.name}
                  onChange={(e) => updateCategoryName(category.id, e.target.value)}
                  onBlur={() => setEditingCategoryId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingCategoryId(null)
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    flex-1 bg-transparent outline-none
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}
                />
              ) : (
                category.name
              )}
            </button>

            <button
              onClick={() => deleteCategory(category.id)}
              className={`
                p-2 rounded-md opacity-0 group-hover:opacity-100
                transition-opacity
                ${isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-red-400'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                }
              `}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}