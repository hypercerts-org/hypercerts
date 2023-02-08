import json
import pandas as pd
import sys


with open("config.json") as config_file:
    CONFIG = json.load(config_file)

SETTINGS      = CONFIG["gitcoin_settings"]
PROJECTS_PATH = SETTINGS["path_to_project_list"]
MULTISIG_PATH = SETTINGS["path_to_safe_multisig_contract_data"] # https://dune.com/queries/1949707
SPLITS_PATH   = SETTINGS["path_to_splits_contract_data"]       # https://dune.com/queries/1979620


def run_multisig_scan():
    df = pd.read_csv(MULTISIG_PATH)
    multisigs = list(df['address'].str.lower())

    with open(PROJECTS_PATH) as j:
        projects_db = json.load(j)

    for group, grant_list in projects_db.items():
        for grant in grant_list:
            if grant['address'].lower() in multisigs:
                grant.update({"multisig": True})
            else:
                grant.update({"multisig": False})
    
    out_file = open(PROJECTS_PATH, "w")
    json.dump(projects_db, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    run_multisig_scan()