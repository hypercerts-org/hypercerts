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
      for (i,projectId) in enumerate(project_list):
         print(f"{i+1}. {projectId}")
      
   data, count = (supabase 
                     .table(allowlist_cache)
                     .select('claimId, address')
                     .eq('address', user_address)
                     .execute())
   if count:
      claim_list = sorted([x["claimId"] for x in data[1]])
      print("User may claim the following hypercerts:")
      for (i,claimId) in enumerate(claim_list):
         print(f"{i+1}. {claimId}")
   


if __name__ == "__main__":
   lookup_user(user_address=sys.argv[1]) 