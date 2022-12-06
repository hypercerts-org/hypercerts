
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const supabase = createClient(supabaseUrl, supabaseAnonKey);