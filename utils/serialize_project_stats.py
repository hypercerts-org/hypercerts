from dotenv import load_dotenv
import json
import os
import pandas as pd
import requests


load_dotenv()
API_KEY = os.environ['OPTIMISM_ETHERSCAN_API_KEY']

with open("config.json") as config_file:
    CONFIG = json.load(config_file)

SETTINGS      = CONFIG["gitcoin_settings"]
PROJECTS_PATH = SETTINGS["path_to_project_list"]
MULTISIG_PATH = SETTINGS["path_to_safe_multisig_contract_data"] # https://dune.com/queries/1949707
SPLITS_PATH   = SETTINGS["path_to_splits_contract_data"]       # https://dune.com/queries/1979620


def optimism_scan(address):

    query = "".join(["https://api-optimistic.etherscan.io/api",
                        "?module=account",
                        "&action=balancemulti",
                        f"&address={address}",
                        "&tag=latest",
                        f"&apikey={API_KEY}"])
    response = requests.get(query, headers={"Accept": "application/json"})
    data = response.json()

    if data['message'] == 'OK':   
        balance = data['result'][0]['balance']
        return float(balance) / 1000000000000000000. # WEI to ETH
    return -1


def run_multisig_scan(check_optimism=False):
    
    process_dune_export = lambda path: list(pd.read_csv(path)['address'].str.lower())
    safes = process_dune_export(MULTISIG_PATH)
    splits = process_dune_export(SPLITS_PATH)

    with open(PROJECTS_PATH) as j:
        projects_db = json.load(j)

    for group, grant_list in projects_db.items():
        for grant in grant_list:
            addr = grant['address'].lower()
            if addr in safes:
                addr_type = 'safe'
            elif addr in splits:
                addr_type = 'split'
            else:
                addr_type = 'wallet'
            grant.update({"type": addr_type})
            grant.update({"multisig": addr_type != 'wallet'})
            grant.update({"optimism": optimism_scan(addr)})
    
    out_file = open(PROJECTS_PATH, "w")
    json.dump(projects_db, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    run_multisig_scan(check_optimism=True)