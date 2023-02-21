from collections import Counter
from dotenv import load_dotenv
from ens import ENS
import json
import os
import requests
from web3 import Web3


with open("config.json") as config_file:
    CONFIG = json.load(config_file)

load_dotenv()
ETHERSCAN_KEY = os.environ['ETHERSCAN_KEY']
ALCHEMY_KEY = os.environ['ALCHEMY_KEY']
alchemy_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"
w3 = Web3(Web3.HTTPProvider(alchemy_url))
ns = ENS.fromWeb3(w3)
get_ens = lambda addr: ns.name(addr)

abi_endpoint = "https://api.etherscan.io/api?module=contract&action=getabi&address="
safe_contract = "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
response = requests.get(abi_endpoint + safe_contract)
response_json = response.json()
ABI = json.loads(response_json['result'])


def create_ens_mapping(list_of_addresses):
    return {
        addr: get_ens(addr) 
        for addr in list_of_addresses
    }


def get_safe_owners(addr):
    addr = Web3.toChecksumAddress(addr.lower())
    contract = w3.eth.contract(address=addr, abi=ABI)
    owners = contract.functions.getOwners().call()
    mapping = create_ens_mapping(owners)
    return mapping


def get_safe_users(addr, top_n=5):
    
    normal_txs_query = "".join([
        "https://api.etherscan.io/api",
        "?module=account",
        "&action=txlist",
        f"&address={addr}",
        "&startblock=0",
        "&endblock=99999999",
        "&page=1",
        "&offset=100",
        "&sort=asc",
        f"&apikey={ETHERSCAN_KEY}"
    ])

    response = requests.get(normal_txs_query, headers={"Accept": "application/json"})
    data = response.json()
    
    if data.get('message') == 'OK':
        from_addresses = [x['from'] for x in data['result']]
        count = Counter(from_addresses)
        top_addresses = count.most_common(top_n)
        ens_mapping = {}
        for address, num in top_addresses:
            name = ns.name(address) 
            if name:
                ens_mapping.update({name: num/len(from_addresses)})
            else:
                ens_mapping.update({addr: num/len(from_addresses)})
        return ens_mapping    


def analyze_addresses():

    projects_path = CONFIG["gitcoin_settings"]["path_to_project_list"]
    with open(projects_path) as f:
        projects_db = json.load(f)    

    for group, grant_list in projects_db.items():
        for grant in grant_list:
            addr = grant["address"]
            ens = get_ens(addr)
            grant.update({"ens": ens})
            if grant["addressType"] == "safe":
                safe = dict(
                    safeOwners=get_safe_owners(addr),
                    safeUsers=get_safe_users(addr)
                )
            else:
                safe = {}
            grant.update({"safeData": safe})

    
    out_file = open(projects_path, "w")
    json.dump(projects_db, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    analyze_addresses()        
