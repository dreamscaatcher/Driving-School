import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://wdloebiexntgrhfmlmaq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uK4zNOb_WV3JFt075pPbUQ_77TK5RCD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
