from dotenv import load_dotenv
import json
import os
import pandas as pd
import requests
from utils import create_project_filename


load_dotenv()
API_KEY = os.environ['OPTIMISM_ETHERSCAN_API_KEY']

with open("config.json") as config_file:
    CONFIG = json.load(config_file)

DONORLIST_DIR = CONFIG["path_to_donorlist_directory"]
ALLOWLIST_DIR = CONFIG["path_to_allowlist_directory"]
METADATA_DIR  = CONFIG["path_to_metadata_directory"]
SETTINGS      = CONFIG["gitcoin_settings"]
PROJECTS_PATH = SETTINGS["path_to_project_list"]
ORIGINAL_PATH = SETTINGS["path_to_original_project_mapping_data"]

RESIZED_BANNER_URL = SETTINGS["resized_banner_base_url"]

process_dune_export = lambda path: list(pd.read_csv(path)['address'].str.lower())
SAFES_LIST  = process_dune_export(SETTINGS["path_to_safe_multisig_contract_data"])
SPLITS_LIST = process_dune_export(SETTINGS["path_to_splits_contract_data"])


def serialize_donor_stats(project_name):

    fname = create_project_filename(project_name) + ".csv"
    donorlist_df = pd.read_csv(DONORLIST_DIR + fname)
    allowlist_df = pd.read_csv(ALLOWLIST_DIR + fname)
    
    return dict(
        fundingTotalDollars=round(donorlist_df['usd'].sum()),
        donorsTotal=len(donorlist_df),
        fractionsTotalSupply=round(allowlist_df['fractions'].sum()),
        hypercertEligibleDonors=len(allowlist_df)
    )


def serialize_project_info(project_name):

    fname = create_project_filename(project_name)
    metadata = json.load(open(METADATA_DIR + fname + ".json"))

    return dict(
        projectWebsite=metadata['external_url'],
        projectGrantPage=metadata['hidden_properties']['gitcoin_grant_url'],
        projectLogoUrl=metadata['hidden_properties']['project_icon'],
        projectBannerUrl="".join([RESIZED_BANNER_URL, create_project_filename(fname), '.png']),
        projectBannerUrlOriginal=metadata['hidden_properties']['project_banner']
    )
    

def optimism_scan(address):

    query = "".join(["https://api-optimistic.etherscan.io/api",
                        "?module=account",
                        "&action=balancemulti",
                        f"&address={address}",
                        "&tag=latest",
                        f"&apikey={API_KEY}"])    
    
    response = requests.get(query, headers={"Accept": "application/json"})
    data = response.json()
    has_address = data['message'] == 'OK'
    balance = float(data['result'][0]['balance']) / 1000000000000000000. if has_address else 0
    
    return dict(
        optimismAddressFound=has_address,
        optimismBalanceEth=balance,
    )


def multisig_scan(address):

    addr = address.lower()
    if addr in SAFES_LIST:
        addr_type = 'safe'
    elif addr in SPLITS_LIST:
        addr_type = 'split'
    else:
        addr_type = 'wallet'
    
    return dict(
        addressType=addr_type,
        isMultisig=addr_type!='wallet'
    )


def run_stats(project_checks, address_checks):

    path = PROJECTS_PATH if os.path.exists(PROJECTS_PATH) else ORIGINAL_PATH
    with open(path) as j:
        projects_db = json.load(j)

    for group, grant_list in projects_db.items():
        for grant in grant_list:
            for pcheck in project_checks:
                grant.update(pcheck(grant['title']))
            for acheck in address_checks:
                grant.update(acheck(grant['address']))
    
    out_file = open(PROJECTS_PATH, "w")
    json.dump(projects_db, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    run_stats(
         project_checks=[serialize_project_info, serialize_donor_stats],
         address_checks=[multisig_scan, optimism_scan]
    )