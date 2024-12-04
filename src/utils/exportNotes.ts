import { Note } from '@/types'

export function exportMarkdown(note: Note): string {
  const frontMatter = `---
title: ${note.title || 'Untitled'}
date: ${note.created_at}
updated: ${note.updated_at}
tags: ${note.tags?.join(', ') || ''}
---

`
  return frontMatter + note.content
}

export function exportHTML(note: Note): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${note.title || 'Untitled'}</title>
  <meta name="date" content="${note.created_at}">
  <meta name="last-modified" content="${note.updated_at}">
  ${note.tags?.map(tag => `<meta name="tag" content="${tag}">`).join('\n  ') || ''}
  <style>
    body {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>${note.title || 'Untitled'}</h1>
  ${note.content}
</body>
</html>`
}

export function downloadNote(note: Note, format: 'md' | 'html') {
  const content = format === 'md' ? exportMarkdown(note) : exportHTML(note)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${note.title || 'untitled'}.${format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}