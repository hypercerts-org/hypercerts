from dotenv import load_dotenv
import os
import requests

from ens import ENS
from web3 import Web3


load_dotenv()
ALCHEMY_KEY    = os.environ['ALCHEMY_KEY']
ALCHEMY_KEY_OP = os.environ['ALCHEMY_KEY_OP']
ETHERSCAN_OP   = os.environ['ETHERSCAN_KEY_OP']

# create a web3 connection
mainnet_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"
w3 = Web3(Web3.HTTPProvider(mainnet_url))
ns = ENS.fromWeb3(w3)

optimism_url = f"https://opt-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY_OP}"
op = Web3(Web3.HTTPProvider(optimism_url))

# get hex codes for checking address/wallet types

# TODO: map Optimism contracts

SPLITS_CODE = w3.eth.get_code("0xD2584c1CF7E3fF11957195732d380DC886F5f05b")
EOA_CODE = w3.eth.get_code("0xEAF9830bB7a38A3CEbcaCa3Ff9F626C424F3fB55")
SAFES = [
    w3.eth.get_code(Web3.toChecksumAddress(x.lower())) 
    for x in [
        "0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd",
        "0x7DAC9Fc15C1Db4379D75A6E3f330aE849dFfcE18",
        "0x70CCBE10F980d80b7eBaab7D2E3A73e87D67B775"
    ]
]

def get_ens(addr):
    try:
        return ns.name(addr)
    except:
        return None


def get_address_type(addr):

    try:
        code = w3.eth.get_code(addr)
    except:
        return "Unknown"
    if code == EOA_CODE:
        return "EOA"
    if code == SPLITS_CODE:
        return "0xSplits"
    if code in SAFES:
        return "Safe"
    return "Unknown"
    

def get_transaction_count(client, addr):
    try:
        return client.eth.get_transaction_count(addr)
    except:
        return None


def lookup_op_contract(addr):
    headers = {'Accept': 'application/json'}
    url = "&".join([
        "https://api-optimistic.etherscan.io/api?module=contract&action=getcontractcreation",
        f"contractaddresses={addr}",
        f"apikey={ETHERSCAN_OP}"
    ])
    response = requests.get(url, headers=headers).json()
    if response['status'] == '1':
        return response['result'][0]['contractAddress']
    else:
        return None
    

def get_address_data(address, tx_count=False):

    def checksum(a):
        try:
            return Web3.toChecksumAddress(a.lower())
        except Exception as e:
            print(e)
            return None

    
    result = {
        'address': None,
        'type': None,
        'ens': None
    }

    if not isinstance(address, str):
        result.update({
            'type': "Missing"
        })
    elif "oeth:" in address:
        address = address.replace("oeth:","")
        result.update({
            'address': address,
            'type': "Safe (OP)"
        })
    elif len(address) == 42:
        address = checksum(address)
        result.update({
            'address': address,
            'type': get_address_type(address),
            'ens': get_ens(address)
        })
    else:
        result.update({
            'type': "Needs Review"
        })

    if tx_count:
        result.update(dict(
            eth_count=get_transaction_count(w3, address),
            op_count=get_transaction_count(op, address)
        ))

    return result

