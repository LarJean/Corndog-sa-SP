import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pkuzeqvmschqyznymxqm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdXplcXZtc2NocXl6bnlteHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTYyMDUsImV4cCI6MjA3MTg5MjIwNX0.ddkBFiVYfVxSWbjYyLL8JM-pI44QjIh5kPkn2tV_8O4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
