import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pkuzeqvmschqyznymxqm.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY'  // paste your anon key here
export const supabase = createClient(supabaseUrl, supabaseKey)
