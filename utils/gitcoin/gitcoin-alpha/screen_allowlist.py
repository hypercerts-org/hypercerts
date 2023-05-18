import asyncio
import aiohttp
from dotenv import load_dotenv
import json
import os
import pandas as pd
import requests

from aiolimiter import AsyncLimiter


load_dotenv()
CHAINALYSIS_API_KEY = os.environ['CHAINALYSIS_API_KEY']

# currently configured to update directly to the same directory
CONFIG   = json.load(open("config/config.json"))
ALLOWLIST_DIR = CONFIG["localPaths"]["allowlistDirectory"]

# Allow-listing modules

limiter = AsyncLimiter(4500)

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

            is_sanctioned = len(content['identifications']) != 0
            if is_sanctioned:
                print(f"Removing sanctioned wallet: {address}")
                df.drop(df[df['address'] == address].index, inplace=True)


async def screen_allowlist(csv_path):
    df = pd.read_csv(csv_path)
    if 'address' not in df.columns:
        print(f"Error reading {csv_path}. Requires a CSV file with an 'address' column")
        return None
    
    # Test sanctions by adding a sanctioned address
    # new_row = {'address':'1da5821544e25c636c1417ba96ade4cf6d2f9b5a', 'title':'test_project', 'usd':100}
    # df = df.append(new_row, ignore_index=True)

    await asyncio.gather(*[remove_sanctioned(df, address) for address in df['address']])
    
    return df


async def batch_screen_allowlists(in_dir, out_dir):

    allowlist_paths = [p for p in os.listdir(in_dir) if p[-4:] == '.csv']
    for p in allowlist_paths:
        df = await screen_allowlist(in_dir+p)
        if not df.empty:
            df.to_csv(out_dir+p)


async def main():
    await batch_screen_allowlists(ALLOWLIST_DIR, ALLOWLIST_DIR)


asyncio.run(main())