# Make direct edits to Hypercerts Supabase from a Python client

# Setup

1. Set environment variables in a `.env` file. You'll need a login credentials for Supabase.

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

2. Prepare a list of addresses to add to the allowlist in a CSV file (and a `claimID` for the hypercert.

3. Executive the script with the following arguments:

   > python insert_allowlist.py `yourdata.csv` optimism-allowlistCache 0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-`claimId`
