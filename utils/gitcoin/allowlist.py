import asyncio
import aiohttp
from dotenv import load_dotenv
import json
import math
import os
import pandas as pd
import requests

from aiolimiter import AsyncLimiter
from utils import create_project_filename 

limiter = AsyncLimiter(4500)

load_dotenv()
CHAINALYSIS_API_KEY = os.environ['CHAINALYSIS_API_KEY']

with open("config.json") as config_file:
    CONFIG = json.load(config_file)

OUT_DIR = CONFIG["path_to_allowlist_directory"]
DUNE_EXPORTS = CONFIG["gitcoin_settings"]["path_to_dune_snapshots"]


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

async def remove_sanctioned(df, address):
    async with aiohttp.ClientSession() as session:
        async with limiter:
            url = f"https://public.chainalysis.com/api/v1/address/{address}"
            headers = {
                "X-API-Key": CHAINALYSIS_API_KEY,
                "Accept": "application/json"
            }

            resp = await session.get(url, headers=headers)
            content = await resp.json()
            print("OK")

            is_sanctioned = len(content['identifications']) != 0
            if is_sanctioned:
                print(f"Removing sanctioned wallet: {address}")
                df.drop(df[df['address'] == address].index, inplace=True)

def ingest_allowlist(csv_path):
    df = pd.read_csv(csv_path)
    df['donor'] = df['donor'].apply(lambda x: "0"+x[1:])
    return df

async def create_project_allowlist(dataframe, project_title, min_usd, func):
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

    #await asyncio.gather(*[remove_sanctioned(dff, address) for address in dff['address']])

    return dff

async def batch_create_allowlists(paths, min_usd, fraction_func):
    df = pd.concat([ingest_allowlist(f) for f in paths], axis=0)

    project_list = df['title'].unique()

    # Test sanctions by adding a sanctioned address
    # new_row = {'donor':'1da5821544e25c636c1417ba96ade4cf6d2f9b5a', 'title':project_list[0], 'usd':1.2}
    # df = df.append(new_row, ignore_index=True)

    for p in project_list:
        a = await create_project_allowlist(df, p, min_usd, fraction_func)
        filename = create_project_filename(p)
        out_path = f"{OUT_DIR}/{filename}.csv"
        a.to_csv(out_path)

async def main():
    await batch_create_allowlists(
        paths=DUNE_EXPORTS,
        min_usd=1.0,
        fraction_func=buffered_floor
    )

asyncio.run(main())