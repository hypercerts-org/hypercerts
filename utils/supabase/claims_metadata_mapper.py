import os
import json
import pandas as pd
import requests
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TABLE_NAME = "claims-metadata-mapping"
CSV_FILEPATH = "data/claimsData.csv"


def timestamp_to_date_string(timestamp: str) -> str:
    """Converts a Unix timestamp to a formatted date string."""
    fmt = "%Y-%m-%d %H:%M:%S"
    return datetime.fromtimestamp(int(timestamp)).strftime(fmt)


def get_claims_with_offset(offset: int = 0) -> list:
    """Fetches claims from The Graph with a given offset."""
    query = f'''
        {{
            claims(          
                first: 1000
                skip: {offset}
                orderBy: creation
            ) {{
                id
                totalUnits
                uri
                creator
                creation    
            }}
        }}
    '''
    url = "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet"
    response = requests.post(url, json={'query': query})
    json_data = response.json()
    data = json_data['data']['claims']
    return data


def get_all_claims() -> list:
    """Fetches all claims from The Graph."""
    all_claims = []
    offset = 0
    while True:
        claims = get_claims_with_offset(offset)
        if not claims:
            break
        all_claims.extend(claims)
        offset += 1000
    print(f"The Graph shows a total of {len(all_claims)} hypercert claims.")
    return all_claims


def retrieve_ipfs_file(cid: str) -> dict:
    """Fetches JSON data from IPFS using the given content identifier (CID)."""
    url = f"https://cloudflare-ipfs.com/ipfs/{cid}"
    print(f"Fetching: {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = json.loads(response.content)
        return data
    except requests.exceptions.HTTPError as e:
        print(e)
    return None


def create_claim_record(claim, metadata):
    """Creates a claim record from the given claim and metadata."""
    if not metadata:
        print(f"Skipping claim {claim['id']} due to missing metadata.")
        return None

    hypercert = metadata["hypercert"]
    return {
        "claimId": claim["id"],
        "createdAt": int(claim["creation"]),
        "title": metadata["name"],
        "creatorAddress": claim["creator"],
        "totalUnits": int(claim["totalUnits"]),
        "date": timestamp_to_date_string(claim["creation"]),
        "properties": metadata.get("properties"),
        "hypercert": hypercert
    }


def parse_claims(list_of_claims: list, existing_claims: list) -> list:
    """Parses claims, filtering out existing ones, and creates claim records."""
    print("Parsing new claims...")
    claims = []
    for claim in list_of_claims:
        claim_id = claim['id']
        if claim_id not in existing_claims:
            cid = claim['uri'].replace("ipfs://", "")
            metadata = retrieve_ipfs_file(cid)
            claim_record = create_claim_record(claim, metadata)
            if claim_record:
                claims.append(claim_record)
    print(f"Total of {len(claims)} new claims extracted.")
    return claims


def store_claims_in_supabase(claims: list):
    """Stores the claim records in the Supabase table."""
    for claim in claims:
        print(f"Adding {claim['title']} claim to Supabase.")
        supabase.table(TABLE_NAME).insert(claim).execute()


def fetch_claim_ids_from_supabase() -> list:
    """Fetches claim IDs from the Supabase table."""
    data, _ = supabase.table(TABLE_NAME).select("claimId").execute()
    claims = data[1]
    claim_ids = [c["claimId"] for c in claims]
    print(f"Supabase shows a total of {len(claim_ids)} hypercert claims.")
    return claim_ids


def save_supabase_snapshot_to_csv(csv_filepath: str = CSV_FILEPATH) -> None:
    """Saves a snapshot of the Supabase table to a CSV file."""
    data, _ = supabase.table(TABLE_NAME).select("*").execute()
    claims = data[1]
    df = pd.DataFrame(claims)
    df.set_index("claimId", inplace=True)
    df.to_csv(csv_filepath)


def append_to_csv_file(claims: list, csv_filepath: str = CSV_FILEPATH) -> None:
    """Appends the claim records to the local CSV file."""
    if not os.path.exists(csv_filepath):
        df = pd.DataFrame(columns=claims[0].keys())
        df.set_index("claimId", inplace=True)
        df.to_csv(csv_filepath)

    df = pd.read_csv(csv_filepath, index_col="claimId")
    for claim in claims:
        df = df.append(pd.Series(claim, name=claim["claimId"]))

    df.to_csv(csv_filepath)


def main():
    #save_supabase_snapshot_to_csv()
    claims_data = get_all_claims()
    existing_claim_ids = fetch_claim_ids_from_supabase()
    new_claims = parse_claims(claims_data, existing_claim_ids)

    if new_claims:
        store_claims_in_supabase(new_claims)
        append_to_csv_file(new_claims)
        fetch_claim_ids_from_supabase()


if __name__ == "__main__":
    main()
