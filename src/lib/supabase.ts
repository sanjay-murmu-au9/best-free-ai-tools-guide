import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://digldzbwgoqnwuhpdjuw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2xkemJ3Z29xbnd1aHBkanV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc1MjYsImV4cCI6MjA3NDY2MzUyNn0.cQGlXzKJBKJHJKJHJKJHJKJHJKJHJKJHJKJHJKJH' // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)