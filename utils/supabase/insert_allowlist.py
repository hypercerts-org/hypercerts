from dotenv import load_dotenv
import os
import pandas as pd
from supabase import create_client, Client
import sys

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def insert_allowlist(csv_file, table_name, claim_id):
   df = pd.read_csv(csv_file)
   addresses = list(df["address"])
   for addr in addresses:
      data, count = (supabase
                     .table(table_name)
                     .insert({"address": addr, "claimId": claim_id})
                     .execute())
   print(f"Successfully added {len(addresses)} rows to {table_name}")


if __name__ == "__main__":
   insert_allowlist(
      csv_file=sys.argv[1],
      table_name=sys.argv[2],
      claim_id=sys.argv[3]
   )


