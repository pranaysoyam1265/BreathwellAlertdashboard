import { config } from 'dotenv';
import path from 'path';

// Explicitly load from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('📁 Loading from:', envPath);

const result = config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
} else {
  console.log('✅ .env.local loaded successfully');
}

console.log('🔍 Checking environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}