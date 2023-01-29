import math
import pandas as pd
from utils import create_project_filename


OUT_DIR = 'allowlists/'
DUNE_EXPORTS = [
    'csv/eth_infra_allowlist.csv',  # https://dune.com/queries/1934656
    'csv/climate_allowlist.csv',    # https://dune.com/queries/1934689
    'csv/oss_allowlist.csv'         # https://dune.com/queries/1934969
]


# Functions for assigning hypercert fractions based on contribution amounts

def floor(amt, min_amt):
    return int(math.floor(amt/min_amt))

def ceil(amt, min_amt):
    return int(max(1, math.ceil(amt/min_amt)))

def rounder(amt, min_amt):
    return int(round(amt/min_amt,0))


# Allow-listing modules

def ingest_allowlist(csv_path):
    df = pd.read_csv(csv_path)
    df['donor'] = df['donor'].apply(lambda x: "0"+x[1:])
    return df

def create_project_allowlist(dataframe, project_title, min_usd, func):
    dff = (dataframe
           .query("title == @project_title")
           .sort_values(by='usd', ascending=False)
           .reset_index(drop=True)
           .dropna()
           .copy())
    dff['price'] = 0.0
    dff['fractions'] = dff['usd'].apply(lambda amt: func(amt, min_usd))
    dff = dff[dff['fractions'] > 0]
    dff.rename(columns={'donor': 'address'}, inplace=True)
    dff.index.name='index'
    dff.drop(columns=['title', 'usd'], inplace=True)    
    return dff

def batch_create_allowlists(paths, min_usd, fraction_func):
    df = pd.concat([ingest_allowlist(f) for f in paths], axis=0)
    project_list = df['title'].unique()
    for p in project_list:
        a = create_project_allowlist(df, p, min_usd, fraction_func)
        filename = create_project_filename(p)
        out_path = f"{OUT_DIR}/{filename}.csv"
        a.to_csv(out_path)


if __name__ == "__main__":
    batch_create_allowlists(
        paths=DUNE_EXPORTS,
        min_usd=1.0,
        fraction_func=floor
    )