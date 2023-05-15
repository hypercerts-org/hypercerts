from dotenv import load_dotenv
from datetime import datetime
import json
import os
import requests

from web3 import Web3


load_dotenv()
ALCHEMY_KEY    = os.environ['ALCHEMY_KEY']
ALCHEMY_KEY_OP = os.environ['ALCHEMY_KEY_OP']
ETHERSCAN      = os.environ['ETHERSCAN_KEY']
ETHERSCAN_OP   = os.environ['ETHERSCAN_KEY_OP']


# create a web3 connection
w3 = Web3(Web3.HTTPProvider(f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"))
op = Web3(Web3.HTTPProvider(f"https://opt-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY_OP}"))

# Grants Database
# TODO refactor to pull from Supabase
GRANTS = {
    "Optimism RetroPGF": {
        "chain": "optimism",
        "address": "0x19793c7824be70ec58bb673ca42d2779d12581be",
        "action": "tokentx",
        "token_symbols": ['OP']
    },
    "Gitcoin Grants - Test": {
        "chain": "mainnet",
        "address": "0x7d655c57f71464B6f83811C55D84009Cd9f5221C",
        "action": "txlist",
        "token_symbols": ['ETH', 'DAI']
    }
}


def convert_timestamp(ts):

    fmt = "%Y-%m-%d %H:%M:%S"
    return datetime.fromtimestamp(int(ts)).strftime(fmt)


def get_txs(grant_data, start=0):
    
    if grant_data['chain'] == 'optimism':
        subdomain = "api-optimistic"
        apikey = ETHERSCAN_OP
    else:
        subdomain = "api"
        apikey = ETHERSCAN

    end = 999999999
    headers = {"Accept": "application/json"}

    apicall = "&".join([
                       f"https://{subdomain}.etherscan.io/api?module=account",
                       f"address={grant_data['address']}",
                       f"action={grant_data['action']}",
                       f"startblock={start}&endblock={end}",
                       f"apikey={apikey}" ])
    
    response = requests.get(apicall, headers=headers)
    json_data = response.json()
    if json_data['message'] == 'OK':
        result = json_data['result']
        return result


def get_transfers(grant):

    tx_data = get_txs(grant)

    if not tx_data:
        return

    data = []
    for x in tx_data:
        data.append({
            'timestamp': convert_timestamp(x['timeStamp']),
            'data_source': 'etherscan',
            'event_type': 'grant',
            'amount': float(x['value']) / (10**int(x.get('tokenDecimal', 18))),
            'details': x
        })

    return data


if __name__ == '__main__':

    grant = GRANTS.get("Optimism RetroPGF")
    data = get_transfers(grant)
    print(data[-1])
    print(len(data))

    #data = get_gitcoin_grants_transfers()