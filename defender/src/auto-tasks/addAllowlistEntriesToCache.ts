import { createClient } from "@supabase/supabase-js";

exports.handler = async function (event) {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = event.secrets;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // TODO: Get correct pairs from emitted event, by downloading and parsing allowlist
  const pairs = [{ address: "0x0x0x0x", claimId: "AAA" }];

  return client
    .from("allowlistCache")
    .insert(pairs)
    .then((data) => data.data);
};
