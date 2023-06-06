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

JSON_OUTPATH = "data/hypercertAccounting.json"
CSV_OUTPATH = "data/hypercertAccounting.csv"
RATE_LIMIT = 1000


def timestamp_to_date_string(timestamp: str) -> str:
    """
    Converts a Unix timestamp to a formatted date string.

    Args:
        timestamp: Unix timestamp string.

    Returns:
        Formatted date string.
    """
    fmt = "%Y-%m-%d %H:%M:%S"
    return datetime.fromtimestamp(int(timestamp)).strftime(fmt)


def get_graph_data(query: str) -> dict:
    """
    Sends a POST request to The Graph API and returns the response data.

    Args:
        query: The GraphQL query string.

    Returns:
        Response data in dictionary format.
    """
    url = "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet"
    response = requests.post(url, json={'query': query})
    json_data = response.json()
    return json_data.get('data', {})


def get_hypercerts() -> list:
    """
    Fetches hypercerts with allowlists from The Graph.

    Returns:
        List of hypercert data.
    """
    query = '''
        {
          allowlists(first: 1000) {
            claim {
              id
              creation
              creator      
              owner
              totalUnits
              uri               
            }
          }
        }
    '''
    json_data = get_graph_data(query)
    data = json_data.get('allowlists', [])
    return data


def get_claims(claim_id: str, offset: int = 0) -> list:
    """
    Fetches claims for a given claim ID from The Graph.

    Args:
        claim_id: The ID of the claim.
        offset: Offset value for pagination.

    Returns:
        List of claim data.
    """
    query = f'''
        {{
          claimTokens(          
             where: {{
                  claim_: {{
                      id: "{claim_id}"
                  }}
              }}
              first: 1000
              skip: {offset}
              orderBy: units
              orderDirection: desc
          ) {{
              id
              owner
              units
            }}
        }}
    '''
    json_data = get_graph_data(query)
    data = json_data.get('claimTokens', [])
    return data


def retrieve_ipfs_file(uri: str) -> dict:
    """
    Fetches JSON data from IPFS using the given content identifier in the URI.

    Args:
        uri: The IPFS URI.

    Returns:
        JSON data as a dictionary.
    """
    cid = uri.replace("ipfs://", "")
    url = f"https://cloudflare-ipfs.com/ipfs/{cid}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = json.loads(response.content)
        return data
    except requests.exceptions.HTTPError as e:
        print(e)
    return None


def fetch_addresses_from_supabase(claim_id: str) -> list:
    """
    Fetches addresses from the Supabase table.

    Args:
        claim_id: The ID of the claim.

    Returns:
        List of addresses.
    """
    response = (supabase
                .table("optimism-allowlistCache")
                .select("address")
                .eq("claimId", claim_id)
                .execute())
    addresses = [x["address"] for x in response.data]
    return addresses


def create_claim_record(claim: dict) -> dict:
    """
    Creates a claim record from the given claim and metadata.

    Args:
        claim: Claim data as a dictionary.

    Returns:
        Claim record as a dictionary.
    """
    metadata_uri = claim["uri"]
    print("Fetching claim data from:", metadata_uri)
    try:
        metadata = retrieve_ipfs_file(metadata_uri)
        metadata.pop('image')
    except:
        print("Error retrieving metadata at:", metadata_uri)
        return None

    allowlist_uri = metadata.get("allowList")
    try:
        merkle_tree = eval(retrieve_ipfs_file(allowlist_uri))
        allowlist = [x['value'] for x in merkle_tree['values']]
    except:
        print("Error retrieving allowlist at:", allowlist_uri)
        return None

    user_claims = get_claims(claim["id"])
    all_user_claims = user_claims
    offset = 0
    while len(user_claims) == RATE_LIMIT:
        offset += RATE_LIMIT
        user_claims = get_claims(claim["id"], offset=offset)
        all_user_claims.extend(user_claims)

    supabase_addresses = fetch_addresses_from_supabase(claim["id"])

    return {
        "claimId": claim["id"],
        "createdAt": int(claim["creation"]),
        "createdDate": timestamp_to_date_string(claim["creation"]),
        "creatorAddress": claim["creator"],
        "ownerAddress": claim["owner"],
        "totalUnits": int(claim["totalUnits"]),
        "metadataUri": metadata_uri,
        "allowlistUri": allowlist_uri,
        "metadata": metadata,
        "allowlist": allowlist,
        "userClaims": all_user_claims,
        "supabaseList": supabase_addresses
    }


def parse_claims(list_of_claims: list, existing_claims: list) -> list:
    """
    Parses claims, filtering out existing ones, and creates claim records.

    Args:
        list_of_claims: List of claim data.
        existing_claims: List of existing claim IDs.

    Returns:
        List of claim records.
    """
    print("Parsing new claims...")
    claims = []
    for claim_dict in list_of_claims:
        claim = claim_dict['claim']
        claim_id = claim['id']
        if claim_id not in existing_claims:
            claim_record = create_claim_record(claim)
            if claim_record:
                claims.append(claim_record)
    print(f"Total of {len(claims)} new claims extracted.")
    return claims


def update_hypercert_accounting(json_filepath: str = JSON_OUTPATH) -> None:
    """
    Store hypercert data in a local JSON file.

    Args:
        json_filepath: Path to the JSON file.
    """
    hypercerts = get_hypercerts()
    if not os.path.exists(json_filepath):
        claims_data = parse_claims(hypercerts, [])
    else:
        with open(json_filepath) as f:
            claims_data = json.load(f)
        existing_claims = [c['claimId'] for c in claims_data]
        new_claims = parse_claims(hypercerts, existing_claims)
        claims_data.extend(new_claims)

    with open(json_filepath, 'w') as f:
        json.dump(claims_data, f, indent=4)


def reconcile_claims(json_filepath: str = JSON_OUTPATH) -> None:
    """
    Reconciles claims data and generates a CSV report.

    Args:
        json_filepath: Path to the JSON file containing claims data.

    Returns:
        None
    """
    with open(json_filepath) as f:
        claims_data = json.load(f)

    results = []
    for claim in claims_data:
        allowlist = {}

        def create_entry(address, units, slots):
            return {
                'address': address,
                'claimId': claim['claimId'],
                'claimName': claim['metadata']['name'],
                'creator': claim['creatorAddress'] == address,
                'units': units,
                'claimed': 0,
                'supabase': False,
                'slots': slots
            }

        for (address, units) in claim['allowlist']:
            if address in allowlist:
                allowlist[address]['units'] += units
                allowlist[address]['slots'] += 1
            else:
                allowlist[address] = create_entry(address, units, 1)

        for user_claim in claim['userClaims']:
            owner = user_claim['owner']
            num_units = int(user_claim['units'])
            if owner not in allowlist:
                allowlist[owner] = create_entry(owner, 0, 0)
            allowlist[owner]['claimed'] += num_units

        for address in claim['supabaseList']:
            if address in allowlist:
                allowlist[address]['supabase'] = True

        results.extend(allowlist.values())

    df = pd.DataFrame(results)
    df.to_csv(CSV_OUTPATH, index=False)


if __name__ == "__main__":
    #update_hypercert_accounting()
    reconcile_claims()
