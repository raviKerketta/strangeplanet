
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = // supabase url
const supabaseKey = //supabase key
export const supabase = createClient(supabaseUrl, supabaseKey)