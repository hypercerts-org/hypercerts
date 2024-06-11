export const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const DOMAIN = requireEnv(
  process.env.NEXT_PUBLIC_DOMAIN,
  "NEXT_PUBLIC_DOMAIN",
);

export const isProduction = DOMAIN === "hypercerts.org";

export const WALLETCONNECT_ID = requireEnv(
  process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  "NEXT_PUBLIC_WALLETCONNECT_ID",
);

export const SUPABASE_URL = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
);

export const SUPABASE_ANON_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
);

export const SUPABASE_TABLE = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_TABLE,
  "NEXT_PUBLIC_SUPABASE_TABLE",
);

export const UNSAFE_FORCE_OVERRIDE_CONFIG =
  process.env.NEXT_PUBLIC_UNSAFE_FORCE_OVERRIDE_CONFIG == "1";
