'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { Folder, Plus, X, ChevronRight, ChevronDown, MoreVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Category {
  id: string
  name: string
  parentId: string | null
  order: number
}

interface CategoriesProps {
  categories: Category[]
  onCategoryChange: (categories: Category[]) => void
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export function Categories({ 
  categories, 
  onCategoryChange, 
  selectedCategoryId,
  onSelectCategory,
}: CategoriesProps) {
  const { isDarkMode } = useTheme()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const rootCategories = categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => a.order - b.order)

  const getChildCategories = (parentId: string) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.order - b.order)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceParentId = source.droppableId === 'root' ? null : source.droppableId
    const destParentId = destination.droppableId === 'root' ? null : destination.droppableId

    const updatedCategories = [...categories]
    const [movedCategory] = updatedCategories.splice(source.index, 1)
    
    movedCategory.parentId = destParentId
    updatedCategories.splice(destination.index, 0, movedCategory)

    // Update order for all categories
    const reorderedCategories = updatedCategories.map((cat, index) => ({
      ...cat,
      order: index,
    }))

    onCategoryChange(reorderedCategories)
  }

  const addCategory = (parentId: string | null = null) => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      parentId,
      order: categories.length,
    }

    onCategoryChange([...categories, newCategory])
    setNewCategoryName('')
  }

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => 
      cat.id !== categoryId && cat.parentId !== categoryId
    )
    onCategoryChange(updatedCategories)
    if (selectedCategoryId === categoryId) {
      onSelectCategory(null)
    }
  }

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: Category, level = 0) => {
    const children = getChildCategories(category.id)
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} className="w-full">
        <Draggable draggableId={category.id} index={category.order}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`
                group flex items-center gap-2 px-2 py-1.5 rounded-md
                transition-colors cursor-pointer
                ${selectedCategoryId === category.id
                  ? isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : isDarkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }
              `}
              style={{
                paddingLeft: `${level * 16 + 8}px`,
                ...provided.draggableProps.style,
              }}
              onClick={() => onSelectCategory(category.id)}
            >
              {children.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpanded(category.id)
                  }}
                  className={`
                    p-0.5 rounded transition-colors
                    ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                  `}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
              
              {editingCategoryId === category.id ? (
                <input
                  autoFocus
                  value={category.name}
                  onChange={(e) => {
                    const updatedCategories = categories.map(cat =>
                      cat.id === category.id
                        ? { ...cat, name: e.target.value }
                        : cat
                    )
                    onCategoryChange(updatedCategories)
                  }}
                  onBlur={() => setEditingCategoryId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingCategoryId(null)
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    flex-1 px-1 rounded bg-transparent outline-none
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}
                />
              ) : (
                <span className="flex-1">{category.name}</span>
              )}

              <div className={`
                flex items-center gap-1 opacity-0 group-hover:opacity-100
                transition-opacity
              `}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingCategoryId(category.id)
                  }}
                  className={`
                    p-1 rounded transition-colors
                    ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                  `}
                >
                  <MoreVertical className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCategory(category.id)
                  }}
                  className={`
                    p-1 rounded transition-colors text-red-500
                    ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                  `}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </Draggable>

        {isExpanded && children.length > 0 && (
          <Droppable droppableId={category.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {children.map((child) => renderCategory(child, level + 1))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addCategory()
            }
          }}
          placeholder="New category..."
          className={`
            flex-1 px-3 py-1.5 rounded-md border outline-none
            transition-colors
            ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-600'
              : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
            }
          `}
        />
        <Button
          onClick={() => addCategory()}
          disabled={!newCategoryName.trim()}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="root">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 overflow-auto p-2"
            >
              {rootCategories.map((category) => renderCategory(category))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}