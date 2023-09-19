from dotenv import load_dotenv
from ens import ENS
import os
from web3 import Web3

load_dotenv()
ALCHEMY_KEY = os.environ['ALCHEMY_KEY']

def get_ens(addr):

    # create a web3 connection
    alchemy_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"
    w3 = Web3(Web3.HTTPProvider(alchemy_url))
    ns = ENS.fromWeb3(w3)

    addr = addr.lower()
    try:
        checksum = Web3.toChecksumAddress(addr)
        name = ns.name(checksum)
        if name:
            return name
        else:
            return addr
    except:
        print("Error getting ENS name:", addr)
        return addr
