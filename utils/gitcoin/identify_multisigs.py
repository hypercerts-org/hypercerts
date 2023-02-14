import json
import pandas as pd
import sys


# https://dune.com/queries/1949707
MULTISIG_PATH = "csv/safe_multisig_list.csv"
OUT_FILENAME  = 'multisig_list.json'

with open("canonical_project_list.json", "r") as project_db:
    PROJECTS_DB = json.load(project_db)


def run_scan(csv_path):
    df = pd.read_csv(csv_path)
    multisigs = list(df['address'].str.lower())
    results = []
    for group, grant_list in PROJECTS_DB.items():
        count = 0
        for grant in grant_list:
            if grant['address'].lower() in multisigs:
                results.append(grant)
                count += 1
        print(f"Round: {group}: {count}/{len(grant_list)} projects")
    print(f"\nTotal: {len(results)}/158  projects")
    out_file = open(OUT_FILENAME, "w")
    json.dump(results, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":

    csv_path = sys.argv[1] if len(sys.argv) == 2 else MULTISIG_PATH
    run_scan(csv_path)