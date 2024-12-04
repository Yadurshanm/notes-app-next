# Notes App

A modern note-taking application built with Next.js and Supabase.

## Features

### Version 1.0.0 (Current)
- 📝 Rich text editing with TipTap
- 🏷️ Tag support for better organization
- 📤 Export notes to Markdown or HTML
- 🌓 Dark mode support
- ⌨️ Keyboard shortcuts
- 💾 Auto-save functionality
- 🔄 Real-time sync with Supabase
- 🔍 Full-text search
- 📱 Responsive design

### Version 0.2.0
- Migrated from Ant Design to native components
- Improved performance and bundle size
- Better error handling
- Enhanced accessibility
- Improved dark mode support

### Version 0.1.0
- Initial release
- Basic note creation and editing
- Supabase integration
- Basic search functionality

## Keyboard Shortcuts

- `⌘ N` - Create new note
- `⌘ S` - Save current note
- `⌘ K` - Search notes
- `⌘ /` - Show keyboard shortcuts

## Tech Stack

- Next.js 13+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- TipTap for rich text editing
- Supabase for backend and real-time sync
- Lucide React for icons
- Custom components for UI

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd notes-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the Supabase URL and anon key in `.env.local`
   ```bash
   cp .env.example .env.local
   ```

4. Set up Supabase:
   - Create a new project in Supabase
   - Execute the SQL from schema.sql in the SQL editor
   - Update the environment variables with your Supabase credentials

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request