const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServerKey = process.env.SUPABASE_SERVER_KEY

if (!supabaseUrl || !supabaseServerKey) {
  throw new Error('Faltam SUPABASE_URL ou SUPABASE_SERVER_KEY no ambiente')
}

const supabase = createClient(supabaseUrl, supabaseServerKey)

module.exports = { supabase }