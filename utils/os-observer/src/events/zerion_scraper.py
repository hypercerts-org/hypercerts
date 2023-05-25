from dotenv import load_dotenv
import json
import os
import pandas as pd
import shutil
import time

from supabase import create_client, Client

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from webdriver_manager.chrome import ChromeDriverManager

# -------------------- DATABASE -------------------- #

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def fetch_list_of_wallets():
    response = (supabase
                .table('wallets')
                .select('address, project_id')
                .execute())

    return response.data

# -------------------- SCRAPER -------------------- #

DOWNLOAD_DIR = os.getcwd()
STORAGE_DIR = "data/temp"

SLEEP = 5
MAX_TRIES = 5


def download_zerion_history(driver, wallet_address):
    destination = f'{STORAGE_DIR}/{wallet_address}.csv'
    url = f'https://app.zerion.io/{wallet_address}/history'

    driver.get(url)
    print(f"Loading Zerion history at: {url}")
    time.sleep(SLEEP)  # wait for page to load
    try:
        accept_button = driver.find_element(By.XPATH, "//*[contains(text(),'Accept')]/ancestor::button")
        accept_button.click()
        time.sleep(SLEEP)  # wait for cookies to be accepted
    except:
        pass

    try:
        print("Clicking download button...")
        button = WebDriverWait(driver, SLEEP * 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Download CSV')]"))
        )
        button.click()
    except:
        print("Zerion appears unable to support analytics for this address:", url)
        return

    for tries in range(0, 5):
        time.sleep(SLEEP)  # wait for download to complete
        files = [
            os.path.join(DOWNLOAD_DIR, f)
            for f in os.listdir(DOWNLOAD_DIR)
            if ".csv" in f
        ]
        if files:
            downloaded_file = max(files, key=os.path.getctime)
            if wallet_address in downloaded_file.lower():
                shutil.move(downloaded_file, destination)
                print(f"Successfully downloaded Zerion history to: {destination}.")
                return
            print("Most recent file:", downloaded_file)

    print("Unable to find a history for this address:", url)


def retrieve_wallet_history(wallet_address, override=False):
    wallet_address = wallet_address.lower()
    if not override:
        destination = f'{STORAGE_DIR}/{wallet_address}.csv'
        if os.path.isfile(destination):
            print(f"File for {wallet_address} already exists. Skipping download.")
            return

    chrome_options = Options()
    chrome_options.add_argument('--headless')

    # Automatically download and configure the appropriate ChromeDriver
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)

    download_zerion_history(driver, wallet_address)
    driver.quit()

# -------------------- ETL HELPERS -------------------- #

strs = [
    'Transaction Type', 'Status', 'Chain',
    'Buy Currency', 'Buy Currency Address', 'Buy Fiat Currency',
    'Sell Currency', 'Sell Currency Address', 'Sell Fiat Currency',
    'Fee Currency', 'Fee Fiat Currency',
    'Tx Hash', 'Link', 'Timestamp'
]
flts = [
    'Buy Amount', 'Buy Fiat Amount',
    'Sell Amount', 'Sell Fiat Amount',
    'Fee Amount', 'Fee Fiat Amount'
]
FIELDS = strs + flts


def to_numeric(x):
    if pd.isna(x):
        return 0
    try:
        return float(x)
    except:
        if isinstance(x, str):
            if "\n" in x:
                return to_numeric(x.split("\n")[0])


def classify_event(buy, sell, fee):
    if buy > 0 and sell > 0:
        event_type = "exchange"
        amount = buy - sell - fee
    elif buy > 0:
        event_type = "income"
        amount = buy - fee
    elif sell > 0:
        event_type = "expense"
        amount = sell + fee
    else:
        event_type = "fee"
        amount = fee

    return event_type, amount


def consolidate_csvs():
    wallet_data = fetch_list_of_wallets()
    wallet_mapping = {w['address'].lower(): w['project_id'] for w in wallet_data}
    csv_paths = [f for f in os.listdir(STORAGE_DIR) if ".csv" in f]

    dfs = []
    for file in csv_paths:
        df = pd.read_csv(f"{STORAGE_DIR}/{file}", usecols=FIELDS)
        for c in df.columns:
            if c in flts:
                df[c] = df[c].apply(to_numeric)
        df.fillna("", inplace=True)

        wallet = file.replace(".csv", "").lower()
        df['wallet'] = wallet
        df['details'] = df.apply(lambda x: dict(x), axis=1)

        df['project_id'] = wallet_mapping.get(wallet)
        df['data_source'] = 'zerion'
        df['timestamp'] = df['Timestamp']
        df['event_type'], df['amount'] = zip(
            *df.apply(lambda x: classify_event(
                x['Buy Fiat Amount'],
                x['Sell Fiat Amount'],
                x['Fee Fiat Amount']),
                axis=1))

        df.drop(columns=FIELDS, inplace=True)
        df.drop(columns=['wallet'], inplace=True)
        dfs.append(df)

    return pd.concat(dfs, axis=0, ignore_index=True)


def convert_csvs_to_records():
    df = consolidate_csvs()
    records = df.to_dict(orient='records')
    return records


if __name__ == '__main__':
    try:
        #test = retrieve_wallet_history('0xc44F30Be3eBBEfdDBB5a85168710b4f0e18f4Ff0')
        # consolidate_csvs()

        wallet_data = fetch_list_of_wallets()
        for w in wallet_data:
            addr = w['address']
            retrieve_wallet_history(addr, override=True)

        # r = convert_csvs_to_records()

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Attempting to download the appropriate ChromeDriver...")

        try:
            webdriver.Chrome(ChromeDriverManager().install())
            print("ChromeDriver installation successful.")
            print("Please run the script again to continue.")
        except Exception as e:
            print("Failed to download ChromeDriver. Please install it manually.")
            print(f"Error message: {e}")
