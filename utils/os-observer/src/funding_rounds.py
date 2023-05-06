from dotenv import load_dotenv
from datetime import datetime
import json
import os
import requests

from web3 import Web3


load_dotenv()
ALCHEMY_KEY    = os.environ['ALCHEMY_KEY']
OPTIMISM_KEY   = os.environ['OPTIMISM_ETHERSCAN_API_KEY']

# create a web3 connection
w3 = Web3(Web3.HTTPProvider(f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"))
op = Web3(Web3.HTTPProvider(f"https://opt-mainnet.g.alchemy.com/v2/{OPTIMISM_KEY}"))


def convert_timestamp(ts):
    fmt = "%Y-%m-%dT%H:%M:%SZ"
    return datetime.fromtimestamp(int(ts)).strftime(fmt)



def get_optimism_txs(addr):
    
    action = "tokentx"
    start, end = 0, 999999999
    headers = {"Accept": "application/json"}

    apicall = "&".join(["https://api-optimistic.etherscan.io/api?module=account",
                       f"address={addr}",
                       f"action={action}",
                       f"startblock={start}&endblock={end}",
                       f"apikey={OPTIMISM_KEY}" ])
    
    response = requests.get(apicall, headers=headers)
    json_data = response.json()
    if json_data['message'] == 'OK':
        result = json_data['result']
        return result


def get_transfers(tx_data, from_addr, token):

    if not tx_data:
        return

    data = []
    for x in tx_data:
        if (x['from'].lower() != from_addr.lower() or x['tokenSymbol'] != token):
            continue
        data.append({
            'date': convert_timestamp(x['timeStamp']),
            'to': x['to'],
            'amount': float(x['value']) / (10**int(x['tokenDecimal']))
        })

    return data


def get_optimism_fdn_transfers():

    treasury = "0x19793c7824be70ec58bb673ca42d2779d12581be"
    addr = op.toChecksumAddress(treasury.lower())
    tx_data = get_optimism_txs(addr)
    data = get_transfers(tx_data, addr, 'OP')
    return data    


if __name__ == '__main__':
    data = get_optimism_fdn_transfers()
