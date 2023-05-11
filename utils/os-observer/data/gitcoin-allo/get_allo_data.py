import json
import logging
import pandas as pd
import re
import requests

from ai_description import summarize

# https://github.com/gitcoinco/allo-indexer
CHAIN_NUM      = "1"
CHAINSAUCE_URL = "https://indexer-grants-stack.gitcoin.co/data/"
JSON_PATH_RAW  = "allo_raw.json"
JSON_PATH      = "allo.json"
ROUND_DATA_CSV = "round_data.csv"


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


def clean_allo_data():

    with open(JSON_PATH_RAW) as f:
        project_data = json.load(f) 

    project_data = list({project['github_org']: project for project in project_data}.values())

    for i, project in enumerate(project_data):
        descr = project.get('description')
        descr = summarize(descr)
        if descr == "aborted":
            log.error(f"Aborted project {i} ({project['name']})")
            break

        project.update({'description': descr})
        logging.info(f"Cleaned project {project['name']} with GitHub org {project['github_org']}")
        
    with open(JSON_PATH, 'w') as f:
         json.dump(project_data, f, indent=4)    


def get_allo_data():

    round_url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds.json"])
    r = requests.get(round_url)
    round_data = r.json()

    funding_round_data = []
    project_data = []
    for funding_round in round_data:
        
        details = flatten_dict(funding_round)
        round_id = funding_round['id']        
        funding_round_data.append({
            "ecosystem": "Gitcoin",
            "name": funding_round['metadata']['name'],
            "amount": funding_round['matchAmountUSD'], 
            'start_date': funding_round['roundStartTime'], 
            'end_date': funding_round['roundEndTime'],
            'details': details
        })

        logging.info(f"Gathering data for round: {funding_round['metadata']['name']}...")
        url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds", round_id, "projects.json"])
        projects_json = requests.get(url).json()

        for project in projects_json:    

            if project['status'] != "APPROVED":
                continue
            
            application = project['metadata']['application']
            application.pop('answers')
            application['project'].pop('credentials')
            details = flatten_dict(application)

            name = details.pop('project.title')
            description = details.pop('project.description')
            address = details.pop('recipient')

            # only ingest projects with valid githubs
            github = extract_github_owner(details.get('project.projectGithub'))
            if not github:
                github = extract_github_owner(details.get('project.userGithub'))

            project_data.append({
                'name': name,               
                'github_org': github,
                'wallets': [address.lower()],
                'description': description,
                'details': details
            })

        logging.info(f"... obtained {len(project_data)} projects.")

    with open(JSON_PATH_RAW, 'w') as f:
         json.dump(project_data, f, indent=4)    

    pd.DataFrame(funding_round_data).to_csv(ROUND_DATA_CSV)


if __name__ == '__main__':
    setup_logging()
    get_allo_data()
    clean_allo_data()