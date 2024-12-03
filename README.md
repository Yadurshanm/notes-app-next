# Notes App

A simple notes application built with Next.js, Ant Design, TipTap editor, and Supabase.

## Features

- Create, read, update notes
- Rich text editing with TipTap
- Real-time updates
- Clean and modern UI with Ant Design
- Responsive layout
- Automatic saving

## Technologies Used

- Next.js
- TypeScript
- Ant Design
- TipTap Editor
- Supabase
- Tailwind CSS

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

3. Set up Supabase:
   - Create a new project in Supabase
   - Execute the SQL from schema.sql in the SQL editor
   - Update the Supabase URL and anon key in src/lib/supabase.ts

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