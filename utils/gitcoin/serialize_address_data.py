from collections import Counter
from dotenv import load_dotenv
from ens import ENS
import json
import os
import requests
from web3 import Web3


load_dotenv()
OPTIMISM_KEY  = os.environ['OPTIMISM_ETHERSCAN_API_KEY']
ETHERSCAN_KEY = os.environ['ETHERSCAN_KEY']
ALCHEMY_KEY   = os.environ['ALCHEMY_KEY']

CONFIG        = json.load(open("config/config.json"))
JSONDATA_PATH = CONFIG["localPaths"]["canonicalDataset"]

# create a web3 connection
alchemy_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"
w3 = Web3(Web3.HTTPProvider(alchemy_url))
ns = ENS.fromWeb3(w3)

# get hex codes for checking address/wallet types
SPLITS_CODE = w3.eth.get_code("0xD2584c1CF7E3fF11957195732d380DC886F5f05b")
EOA_CODE = w3.eth.get_code("0xEAF9830bB7a38A3CEbcaCa3Ff9F626C424F3fB55")

# get Gnosis Safe ABI
abi_endpoint = "https://api.etherscan.io/api?module=contract&action=getabi&address="
safe_contract = "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
response = requests.get(abi_endpoint + safe_contract)
response_json = response.json()
ABI = json.loads(response_json['result'])


def get_ens(addr):
    return ns.name(addr)


def get_address_type(addr):
    code = w3.eth.get_code(addr)
    if code == EOA_CODE:
        return "EOA"
    if code == SPLITS_CODE:
        return "0xSplits"
    return "Safe"


def create_ens_mapping(list_of_addresses):
    return {
        addr: get_ens(addr) 
        for addr in list_of_addresses
    }


def get_safe_owners(addr):
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


def optimism_scan(addr):

    query = "".join(["https://api-optimistic.etherscan.io/api",
                        "?module=account",
                        "&action=balancemulti",
                        f"&address={addr}",
                        "&tag=latest",
                        f"&apikey={OPTIMISM_KEY}"])    
    
    response = requests.get(query, headers={"Accept": "application/json"})
    data = response.json()
    has_address = data['message'] == 'OK'
    balance = float(data['result'][0]['balance']) / 1000000000000000000. if has_address else 0
    
    return dict(
        optimismAddressFound=has_address,
        optimismBalanceEth=balance,
    )


def run_address_stats():

    projects_list = json.load(open(JSONDATA_PATH))
    for project in projects_list:
        address = project.get("address")
        address = Web3.toChecksumAddress(address.lower())
        if project:
            addr_type = get_address_type(address)
            if addr_type == "EOA":
                address_scan = optimism_scan(address)
            elif addr_type == "Safe":
                address_scan = dict(
                    safeOwners=get_safe_owners(address),
                    safeUsers=get_safe_users(address)
                )
            else:
                address_scan = {}
            project.update(dict(
                ensName=get_ens(address),
                addressType=addr_type,
                addressScan=address_scan
            ))

    out_file = open(JSONDATA_PATH, "w")
    json.dump(projects_list, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    run_address_stats()