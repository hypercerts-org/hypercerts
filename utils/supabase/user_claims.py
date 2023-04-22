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
CSV_FILEPATH = "data/userTokenData.csv"

CALL_LIMIT = 1000


def get_tokens_claimed_by_hypercert(claim_id: str, offset: int = 0) -> list:
    """Fetches tokens from The Graph for a given hypercert id."""
    query = f'''
        {{
            claimTokens(          
               where: {{
                    claim_: {{
                        id: "{claim_id}"
                    }}
                }}
                first: {CALL_LIMIT}
                offset: {offset}
                orderBy: units
                orderDirection: desc
            ) {{
                id
                owner
                units
                claim {{
                    id
                    totalUnits
                    creator
                }} 
            }}
        }}
    '''
    url = "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet"
    response = requests.post(url, json={'query': query})
    json_data = response.json()
    data = json_data['data']['claimTokens']
    return data


def get_all_tokens(list_of_claim_ids: list) -> list:
    """Fetches all tokens from The Graph."""
    all_tokens = []
    for claim_id in list_of_claim_ids:
        calls = 0
        while True:
            tokens = get_tokens_claimed_by_hypercert(claim_id, offset=(calls*CALL_LIMIT))
            if not tokens:
                break
            all_tokens.extend(tokens)
            calls += 1
            if calls >= 5:
                break
    return all_tokens


def create_record(token: dict) -> dict:
    """Creates a record from the given token."""
    claim = token["claim"]
    return {
        "tokenId": token["id"],
        "ownerAddress": token["owner"],
        "units": int(token["units"]),
        "claimId": claim["id"],
        "totalUnits": int(claim["totalUnits"]),
        "creatorAddress": claim["creator"]
    }


def parse_tokens(list_of_tokens: list, existing_tokens: list = []) -> list:
    """Parses tokens, filtering out existing ones, and creates records."""
    print("Parsing new tokens...")
    tokens = []
    for token in list_of_tokens:
        token_id = token["id"]
        if token_id not in existing_tokens:
            record = create_record(token)
            if record:
                tokens.append(record)
    print(f"Total of {len(tokens)} new token claims extracted.")
    return tokens


def fetch_claim_ids_from_supabase() -> list:
    """Fetches claim IDs from the Supabase table."""
    data, _ = supabase.table(TABLE_NAME).select("claimId").execute()
    claims = data[1]
    claim_ids = [c["claimId"] for c in claims]
    print(f"Supabase shows a total of {len(claim_ids)} hypercert claims.")
    return claim_ids


def append_to_csv_file(tokens: list, csv_filepath: str = CSV_FILEPATH) -> None:
    """Appends the token records to the local CSV file."""
    if not os.path.exists(csv_filepath):
        df = pd.DataFrame(columns=tokens[0].keys())
        df.set_index("tokenId", inplace=True)
        df.to_csv(csv_filepath)

    df = pd.read_csv(csv_filepath, index_col="tokenId")
    for token in tokens:
        df = df.append(pd.Series(token, name=token["tokenId"]))

    df.to_csv(csv_filepath)


def main():
    claim_ids = fetch_claim_ids_from_supabase()
    token_data = parse_tokens(get_all_tokens(claim_ids))
    append_to_csv_file(token_data)


if __name__ == "__main__":
    main()
