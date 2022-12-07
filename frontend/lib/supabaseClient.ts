
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "MISSING";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseQueryArgs {
  table: string;
  columns?: string[];
}

export async function supabaseQuery(args: SupabaseQueryArgs) : Promise<any[]> {
  const { table, columns } = args;
  const { data, error, status } = await supabase.from(table).select(columns?.join(","));
  if (error) {
    throw error;
  }
  return data;
}