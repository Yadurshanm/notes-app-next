import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://escauwvleshpppyzying.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY2F1d3ZsZXNocHBweXp5aW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNDY2MzMsImV4cCI6MjA0ODgyMjYzM30.wZnIBPGzqDN7XNs0m4J7h7LEyt7EXxEF7EpoREjH2Dg'

export const supabase = createClient(supabaseUrl, supabaseKey)