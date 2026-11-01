import { createClient } from "@supabase/supabase-js";

const env =
  typeof import.meta !== "undefined" && import.meta?.env
    ? import.meta.env
    : typeof process !== "undefined" && process?.env
    ? process.env
    : {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

let client = null;

if (!supabaseUrl || !supabaseAnonKey) {
  if (env.DEV) {
    console.warn(
      "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. Client initialized as null."
    );
  }
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
export default supabase;

