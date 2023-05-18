from datetime import datetime
import json
import logging
import pandas as pd
import re
import requests

# from ai_description import summarize

# https://github.com/gitcoinco/allo-indexer
CHAIN_NUM      = "1"
CHAINSAUCE_URL = "https://indexer-grants-stack.gitcoin.co/data/"
JSON_PATH_RAW  = "data/gitcoin-allo/allo_raw.json"
JSON_PATH      = "data/gitcoin-allo/allo.json"
ROUND_DATA_CSV = "data/gitcoin-allo/round_data.csv"
DAI_ADDRESS    = "0x6b175474e89094c44da98b954eedeac495271d0f"
START_TIME     = 1682424000


def setup_logging():

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)-8s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.FileHandler("allo.log"),
            logging.StreamHandler()
        ]
    )


def extract_github_owner(string):

    pattern = r"(?:https?://)?(?:www\.)?github\.com/([A-Za-z0-9-]+)/?(?:.*)?$|@([A-Za-z0-9-]+)|([A-Za-z0-9-]+)"
    if isinstance(string, str):
        match = re.search(pattern, string)
        if match:
            return match.group(1) or match.group(2) or match.group(3)

    return None


def convert_timestamp(timestamp):

    if isinstance(timestamp, str):
        timestamp = int(timestamp)
    dt = datetime.fromtimestamp(timestamp)
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def flatten_dict(d):

    flattened_dict = {}
    for key, value in d.items():
        if isinstance(value, dict):
            inner_dict = flatten_dict(value)
            flattened_dict.update({f"{key}.{inner_key}": inner_value for inner_key, inner_value in inner_dict.items()})
        elif isinstance(value, list):
            flattened_dict.update({f"{key}.{i}": item for i, item in enumerate(value)})
        else:
            flattened_dict[key] = value
    return flattened_dict      


def get_funding_rounds():    

    round_url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds.json"])
    r = requests.get(round_url)
    round_data = r.json()

    funding_round_data = []
    for funding_round in round_data:
        
        start_time = int(funding_round['roundStartTime'])
        votes = funding_round['votes']
        # filter out older and testing rounds
        if start_time >= START_TIME and votes > 10:        
            funding_round_data.append({
                "roundId": funding_round['id'],
                "roundName": funding_round['metadata']['name'],
                "backgroundColor": "blue",
                "backgroundVectorArt": "contours"
            })

    with open('data/funding_round_data.json', 'w') as f:
        json.dump(funding_round_data, f, indent=4)   


def get_allo_data():

    round_url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds.json"])
    r = requests.get(round_url)
    round_data = r.json()

    funding_round_data = []
    project_data = []
    for funding_round in round_data:
        
        round_id = funding_round['id']
        start_time = int(funding_round['roundStartTime'])
        votes = funding_round['votes']

        if start_time >= START_TIME and votes > 10:        
            funding_round_data.append({
                "roundId": round_id,
                "roundName": funding_round['metadata']['name'],
                "backgroundColor": "blue",
                "backgroundVectorArt": "contours"
            })

        # logging.info(f"Gathering data for round: {funding_round['metadata']['name']}...")
        # url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds", round_id, "projects.json"])
        # projects_json = requests.get(url).json()

        # for project in projects_json:    

        #     if project['status'] != "APPROVED":
        #         continue
            
        #     application = project['metadata']['application']
        #     application.pop('answers')
        #     application['project'].pop('credentials')
        #     details = flatten_dict(application)

        #     name = details.pop('project.title')
        #     description = details.pop('project.description')
        #     address = details.pop('recipient')

        #     # only ingest projects with valid githubs
        #     github = extract_github_owner(details.get('project.projectGithub'))
        #     if not github:
        #         github = extract_github_owner(details.get('project.userGithub'))

        #     project_data.append({
        #         'name': name,               
        #         'github_org': github,
        #         'wallets': [address.lower()],
        #         'description': description,
        #         'details': details
        #     })

        # logging.info(f"... obtained {len(project_data)} projects.")

    with open('temp.json', 'w') as f:
         json.dump(funding_round_data, f, indent=4)    

    # df = pd.DataFrame(funding_round_data)
    # df.index.name = 'id'
    # df.to_csv(ROUND_DATA_CSV)


# def clean_allo_data():

#     with open(JSON_PATH_RAW) as f:
#         project_data = json.load(f) 

#     project_data = list({project['github_org']: project for project in project_data}.values())

#     for i, project in enumerate(project_data):
#         descr = project.get('description')
#         descr = summarize(descr)
#         if descr == "aborted":
#             log.error(f"Aborted project {i} ({project['name']})")
#             break

#         project.update({'description': descr})
#         logging.info(f"Cleaned project {project['name']} with GitHub org {project['github_org']}")
        
#     with open(JSON_PATH, 'w') as f:
#          json.dump(project_data, f, indent=4)


if __name__ == "__main__":
    get_funding_rounds()