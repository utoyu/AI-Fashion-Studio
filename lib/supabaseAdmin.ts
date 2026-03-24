import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ Missing Supabase admin credentials in .env.local');
}

/**
 * Supabase Admin Client
 * WARNING: This client bypasses Row Level Security (RLS).
 * MUST ONLY be used on the server side (API routes, Server Actions).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Admin client initialized — uses Service Role Key, bypasses RLS. Server-side only.
