import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Function to get Supabase client (lazy initialization)
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Export a function that creates the client when needed
export function createClient() {
  return getSupabaseClient();
}