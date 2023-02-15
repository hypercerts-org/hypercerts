import json
import math
import os
import pandas as pd

from utils import create_project_filename


with open("config.json") as config_file:
    CONFIG = json.load(config_file)

DUNE_EXPORTS  = CONFIG["gitcoin_settings"]["path_to_dune_snapshots"]
ALLOWLIST_DIR = CONFIG["path_to_allowlist_directory"]
DONORLIST_DIR = CONFIG["path_to_donorlist_directory"]


# Functions for assigning hypercert fractions based on contribution amounts

def floor(amt, min_amt):
    return int(math.floor(amt/min_amt))

def buffered_floor(amt, min_amt, buffer=.05):
    amt = amt if amt > min_amt else amt * (1+buffer)
    return int(math.floor(amt/min_amt))

def ceil(amt, min_amt):
    return int(max(1, math.ceil(amt/min_amt)))

def rounder(amt, min_amt):
    return int(round(amt/min_amt,0))


# Allow-listing modules

def ingest_dune_export(csv_path):
    
    df = pd.read_csv(csv_path)
    df['address'] = df['donor'].apply(lambda x: "0"+x[1:])
    df.drop(columns=['donor'], inplace=True)
    
    return df


def prepare_allowlist(dataframe, project_title, min_usd, func):
    
    df = (dataframe
         .query("title == @project_title")
         .sort_values(by='usd', ascending=False)
         .reset_index(drop=True)
         .copy())
    
    df.index.name = 'index'
    df['price'] = 0.0
    df['fractions'] = df['usd'].apply(lambda amt: func(amt, min_usd))
    
    return df


def batch_create_allowlists(paths, min_usd, fraction_func):

    df = pd.concat([ingest_dune_export(f) for f in paths], axis=0)

    project_list = df['title'].unique()

    for project in project_list:
        filename = create_project_filename(project) + ".csv"
        
        dff = prepare_allowlist(df, project, min_usd, fraction_func)
        dff[['title', 'address', 'usd', 'fractions']].to_csv(f"{DONORLIST_DIR}{filename}")

        dfff = dff = dff[dff['fractions'] > 0]
        dfff[['address', 'price', 'fractions']].to_csv(f"{ALLOWLIST_DIR}/{filename}")


def main():
    batch_create_allowlists(
        paths=DUNE_EXPORTS,
        min_usd=1.0,
        fraction_func=buffered_floor
    )


if __name__ == "__main__":
    main()       