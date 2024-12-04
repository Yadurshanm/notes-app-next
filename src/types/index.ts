export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  tags: string[]
  category_id: string | null
  is_starred: boolean
  order: number
}

export interface Category {
  id: string
  name: string
  parentId: string | null
  order: number
}