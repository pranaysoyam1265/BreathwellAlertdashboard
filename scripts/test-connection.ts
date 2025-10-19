// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please set in .env.local:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('Current URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
    console.log('Current Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
    process.exit(1);
  }
  
  console.log('✅ Environment variables found');
  console.log('📡 Testing database connection...');
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Database connection successful!');
      console.log(`📊 Found ${data?.length || 0} alert records`);
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Connection test error:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  testConnection().catch(console.error);
}

export { testConnection };