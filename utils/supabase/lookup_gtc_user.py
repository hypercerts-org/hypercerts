from dotenv import load_dotenv
import os
from supabase import create_client, Client
import sys

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

allowlist_source = "gtc-alpha-allowlist"
allowlist_cache  = "optimism-allowlistCache"

def lookup_user(user_address):

   user_address = user_address.lower()

   data, count = (supabase 
                     .table(allowlist_source)
                     .select('project, address')
                     .eq('address', user_address)
                     .execute())
   if count:
      project_list = sorted([x["project"] for x in data[1]])
      print("User donated to the following Gitcoin projects:")
      print(", ".join([f"{i+1}. {p}" for (i,p) in enumerate(project_list)]))
      

   data, count = (supabase 
                     .table(allowlist_cache)
                     .select('claimId, address')
                     .eq('address', user_address)
                     .execute())
   if count:
      claim_list = sorted([x["claimId"] for x in data[1]])
      print("User may claim the following hypercerts:")
      print(", ".join([f"{i+1}. {p}" for (i,p) in enumerate(claim_list)]))


if __name__ == "__main__":
   lookup_user(user_address=sys.argv[1]) 