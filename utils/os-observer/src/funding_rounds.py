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
GRANTS = {
    "Optimism RetroPGF": {
        "chain": "optimism",
        "address": "0x19793c7824be70ec58bb673ca42d2779d12581be",
        "action": "tokentx",
        "token_symbols": ['OP']
    },
    "Gitcoin Grants": {
        "chain": "mainnet",
        "address": "0x7d655c57f71464B6f83811C55D84009Cd9f5221C",
        "action": "txlist",
        "token_symbols": ['ETH', 'DAI']
    },
    "Gitcoin: Eth Infra Beta Round": {
        "chain": "mainnet",
        "address": "0xda2f26b30e8f5aa9cbe9c5b7ed58e1ca81d0ebf2",
        "action": "txlistinternal"
    }
}


def convert_timestamp(ts):
    fmt = "%Y-%m-%dT%H:%M:%SZ"
    return datetime.fromtimestamp(int(ts)).strftime(fmt)


def get_txs(grant, start=0):

    grant_data = GRANTS.get(grant)
    
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
    print(tx_data[-1])
    for x in tx_data:
        data.append({
            'date': convert_timestamp(x['timeStamp']),
            'from': x['from'],
            'to': x['to'],
            'amount': float(x['value']) / (10**int(x.get('tokenDecimal', 18))),
            #'token': x['tokenSymbol']
        })

    return data


def get_optimism_fdn_transfers():

    data = get_transfers("Optimism RetroPGF")
    return data    


def get_gitcoin_grants_transfers():

    data = get_transfers("Gitcoin: Eth Infra Beta Round")
    return data        




if __name__ == '__main__':
    data = get_optimism_fdn_transfers()
    #data = get_gitcoin_grants_transfers()

    import pandas as pd
    pd.DataFrame(data).to_csv("~/Desktop/op_transfers.csv")
    print(len(data), data[-1])
