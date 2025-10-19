import { createClient } from '@supabase/supabase-js'

console.log('🔌 Detailed Supabase connection test...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key starts with:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'No key')

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function test() {
  try {
    console.log('1. Testing basic query...')
    const { data, error, status } = await supabase.from('alerts').select('*').limit(1)
    
    console.log('Status:', status)
    
    if (error) {
      console.log('❌ Query Error:')
      console.log('   Code:', error.code)
      console.log('   Message:', error.message)
      console.log('   Details:', error.details)
      console.log('   Hint:', error.hint)
      
      // Test if it's an authentication issue
      console.log('2. Testing authentication...')
      const { data: authData, error: authError } = await supabase.auth.getSession()
      if (authError) {
        console.log('❌ Auth Error:', authError.message)
      } else {
        console.log('✅ Auth OK - Session:', authData.session ? 'Exists' : 'None (expected)')
      }
      
    } else {
      console.log('✅ Query successful!')
      console.log('Data:', data)
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err)
  }
}

test()