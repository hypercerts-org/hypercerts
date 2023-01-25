
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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