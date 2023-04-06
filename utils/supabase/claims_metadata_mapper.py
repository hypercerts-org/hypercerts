from datetime import datetime
from dotenv import load_dotenv
import json
import os
import pandas as pd
import requests
from supabase import create_client, Client
import sys

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

table_name = "claims-metadata-mapping"
outpath = "data/claimsData.json"

def datify(u):
   fmt = "%Y-%m-%d %H:%M:%S"
   return datetime.fromtimestamp(int(u)).strftime(fmt)

# graph the hypercert metadata from IPFS
def retrieve_ipfs_file(cid):

   # use the cloudlare gateway
   url = "https://cloudflare-ipfs.com/ipfs/" + cid
   print("Fetching:", url)

   try:    
     response = requests.get(url)
     response.raise_for_status()
     data = json.loads(response.content)
     return data

   except requests.exceptions.HTTPError as e:
     print(e)

   return None


# Get the latest claim data by querying TheGraph 
def get_claims_data():

   # Construct the GraphQL query
   query = '''
     {
        claims(
          first: 300, 
          where: {totalUnits_not: "10000"}
        ) {
          id
          creation
          totalUnits
          creator
          uri
        }
      }
   '''
   # Query TheGraph API for the round's data by POST request
   url = "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet"
   response = requests.post(url, json={'query': query})
   data = response.json()

   # Iterate through the JSON object and add data to our list
   claims = []
   for claim in data['data']['claims']:
      cid = claim['uri'].replace("ipfs://", "")
      claims.append({
         'claimId': claim['id'],
         'createdAt': claim['creation'],
         'totalUnits': claim['totalUnits'],
         'creatorAddress': claim['creator'],
         'metadataCid': cid,
         'metadata': retrieve_ipfs_file(cid)
      })
   print(f"Total of {len(claims)} claims extracted.")

   out_file = open(outpath, "w")
   json.dump(claims, out_file, indent=4)                
   out_file.close()   

   return claims


# populate the supabase with existing claims
def make_initial_csv():

   claims_data = json.load(open(outpath))
   records = []
   for claim in claims_data:
      records.append({
         "createdAt": int(claim["createdAt"]),
         "claimId": claim["claimId"],
         "title": claim["metadata"]["name"],
         "creatorAddress": claim["creatorAddress"],
         "totalUnits": int(claim["totalUnits"]),
         "date": datify(claim["createdAt"])
      })    
   df = pd.DataFrame(records)
   df.sort_values(by="createdAt", inplace=True)
   df.reset_index(inplace=True, drop=True)
   df.index.name = "id"
   df.to_csv(outpath.replace(".json", ".csv"))


# fetch all claims from the database
def fetch_supabase_claims():

   data, _ = (supabase 
               .table(table_name)
               .select('claimId, title')
               .execute())
   claims = data[1]
   count = len(claims)
   print(f"Fetched {count} claims from the database.")
   return claims


# TODO: write a script that looks for new claims and updates the database
#def update_supabase():
#       data, count = (supabase
#                      .table(table_name)
#                      .insert({"address": addr, "claimId": claim_id})
#                      .execute())
#    print(f"Successfully added {len(addresses)} rows to {table_name}")


if __name__ == "__main__":
   #get_claims_data()
   #make_initial_csv()
   fetch_supabase_claims()
   #update_supabase()


