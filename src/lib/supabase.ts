import { createClient } from "@supabase/supabase-js";

// Supabase credentials are kept in environment variables for security.
// Make sure to define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 