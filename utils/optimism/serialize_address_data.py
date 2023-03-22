from dotenv import load_dotenv
import json
import os
import requests


load_dotenv()
OPTIMISM_KEY  = os.environ['OPTIMISM_ETHERSCAN_API_KEY']
ETHERSCAN_KEY = os.environ['ETHERSCAN_KEY']
HEADERS = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
}

PROJECT_DATA  = "data/projects/"
JSONDATA_PATH = "data/optimism_project_data.json"


def load_projects():
    paths = [p for p in os.listdir(PROJECT_DATA) if p[-5:] == '.json']
    data = []
    for path in paths:
        project = json.load(open(PROJECT_DATA+path))
        project['banner'] = (project['banner'] == None)
        project['logo'] = True
        data.append(project)
    return data


def optimism_scan(addr):

    query = "".join(["https://api-optimistic.etherscan.io/api",
                        "?module=account",
                        "&action=balancemulti",
                        f"&address={addr}",
                        "&tag=latest",
                        f"&apikey={OPTIMISM_KEY}"])    

    response = requests.get(query, headers=HEADERS)
    data = response.json()

    
    has_address = data['message'] == 'OK'
    balance = float(data['result'][0]['balance']) / 1000000000000000000. if has_address else 0
    
    return dict(
        optimismAddressFound=has_address,
        optimismBalanceEth=balance,
    )


def run_address_stats():

    data = load_projects()
    for project in data:
        address = project.get("address")
        try:
            project.update(optimism_scan(address))
        except:
            print("Error:", address)
            

    out_file = open(JSONDATA_PATH, "w")
    json.dump(data, out_file, indent=4)                
    out_file.close()


if __name__ == "__main__":
    run_address_stats()