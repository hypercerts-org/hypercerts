
export const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const DEFAULT_CHAIN_ID = requireEnv(
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID,
  "NEXT_PUBLIC_DEFAULT_CHAIN_ID"
);

export const SUPABASE_URL = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL"
);

export const SUPABASE_ANON_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
);

export const PLASMIC_PROJECT_ID = process.env.PLASMIC_PROJECT_ID ?? "MISSING";
export const PLASMIC_PROJECT_API_TOKEN = process.env.PLASMIC_PROJECT_API_TOKEN ?? "MISSING";
