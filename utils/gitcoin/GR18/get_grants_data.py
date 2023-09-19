from datetime import datetime
import json
import logging
import os
import pandas as pd
import re
import requests

from get_ens import get_ens


CHAINSAUCE_URL = "https://indexer-grants-stack.gitcoin.co/data/"
CHAIN_IDS = {
    #'1': 'mainnet',
    '10': 'optimism',
    #'250': 'fantom',
    #'42161': 'arbitrum one',
    '424': 'pgn'
}
START_TIME = 1690862400  # Aug 1, 2023
END_TIME = 1692331200 # Aug 18 2023

ROUNDS_DATA = "data/funding-round-data.json"
PROJECTS_DATA = "data/projects-data.json"


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


def assign_color_and_vector(round_name):

    design_mappings = [
        {
            "words": "Community|Social|Source",
            "color": "blue",
            "vector": "contours"
        },
        {
            "words": "Zuzalu|ReFi|Climate",
            "color": "green",
            "vector": "circles"
        },
        {
            "words": "Infrastructure|Chinese|Engineering",
            "color": "purple",
            "vector": "octagonals"
        }
    ]
    default_color = "blue"
    default_vector = "contours"

    for mapping in design_mappings:
        if re.search(mapping['words'], round_name):
            return mapping['color'], mapping['vector']
    return default_color, default_vector


def get_funding_rounds(chain_nums):

    funding_round_data = []
    for chain_num in chain_nums:
        round_url = "/".join([CHAINSAUCE_URL, chain_num, "rounds.json"])
        r = requests.get(round_url)
        round_data = r.json()
        for r in round_data:
            if START_TIME < int(r['roundStartTime']) < END_TIME:
                round_name = r['metadata']['name']
                if r['votes'] > 10 and 'test' not in round_name.lower():
                    color, vectors = assign_color_and_vector(round_name)
                    funding_round_data.append({
                        "roundId": r['id'],
                        "roundName": round_name,
                        "chain": chain_num,
                        "backgroundColor": color,
                        "backgroundVectorArt": vectors
                    })

    with open(ROUNDS_DATA, 'w') as f:
        json.dump(funding_round_data, f, indent=4)


def get_allo_data(chain_nums):
    with open(ROUNDS_DATA) as f:
        funding_round_data = json.load(f)

    projects_data = []
    for funding_round in funding_round_data:
        round_id = funding_round['roundId']
        round_name = funding_round['roundName']
        chain_num = funding_round['chain']
        print(f"Gathering projects data for round: {round_name} on Chain {chain_num}...")

        url = "/".join([CHAINSAUCE_URL, chain_num, "rounds", round_id, "applications.json"])
        projects_json = requests.get(url).json()

        for project in projects_json:
            if project['status'] != "APPROVED":
                continue

            app = flatten_dict(project['metadata']['application'])
            name = app.get('project.title')
            address = get_ens(app.get('recipient'))
            
            project_data = {
                'id': project['projectId'],
                'name': name,
                'description': app.get('project.description'),
                'address': address,
                'logoImg': app.get('project.logoImg'),
                'bannerImg': app.get('project.bannerImg'),
                'externalLink': app.get('project.website'),
                'fundingRounds': [round_name],
                'chain': chain_num,
                "backgroundColor": funding_round['backgroundColor'],
                "backgroundVectorArt": funding_round['backgroundVectorArt']
            }
            
            # Check if this project already exists in the list
            existing_project = next((item for item in projects_data if item['name'] == name and item['chain'] == chain_num), None)
            if existing_project:
                existing_project['fundingRounds'].append(round_name)
            else:
                projects_data.append(project_data)
            print(f"Normalized data for project: {name}")

    print(f"Obtained {len(projects_data)} projects.")
    
    with open(PROJECTS_DATA, 'w') as f:
        json.dump(projects_data, f, indent=4)

    df = pd.DataFrame(projects_data)
    df.to_csv("data/projects.csv", index=False)


def rerun_get_ens():
    with open(PROJECTS_DATA) as f:
        projects_data = json.load(f)

    for project in projects_data:
        address = project['address']
        if ".eth" in address:
            continue
        ens = get_ens(address)
        project['address'] = ens

    with open(PROJECTS_DATA, 'w') as f:
        json.dump(projects_data, f, indent=4)


def get_allowlists():

    path = "data/allowlists/"
    if not os.path.exists(path):
        os.makedirs(path)

    with open(ROUNDS_DATA) as f:
        funding_round_data = json.load(f)

    votes_data = []
    for funding_round in funding_round_data:
        round_id = funding_round['roundId']
        round_name = funding_round['roundName']
        chain_num = funding_round['chain']
        logging.info(f"Gathering voting data for round: {round_name}...")

        url = "/".join([CHAINSAUCE_URL, chain_num, "rounds", round_id, "votes.json"])
        votes_json = requests.get(url).json()
        votes_data.extend(votes_json)

    df = pd.DataFrame(votes_data)

    for project in df['projectId'].unique():
        dff = (
            df[df['projectId'] == project]
            .groupby('voter')['amountUSD']
            .sum()
            .sort_values(ascending=False)
            .reset_index()
            .rename(columns={'voter': 'address'})
        )
        dff.index.name = 'index'

        # Round the hypercert quantity UP to the nearest integer
        dff['fractions'] = dff['amountUSD'].apply(lambda x: int(x) + 1)
        dff['address'] = dff['address'].apply(lambda x: x.lower())
        dff.drop(columns='amountUSD', inplace=True)

        dff.to_csv(f"{path}{project}.csv")


if __name__ == "__main__":
    
    # TODO: set colors and vectors dynamically
    # Currently requires manually overriding a default color/vector combo
    
    if not os.path.exists(ROUNDS_DATA):
        get_funding_rounds(CHAIN_IDS.keys())
    if not os.path.exists("data/img"):
        os.makedirs("data/img")

    get_allo_data(CHAIN_IDS.keys())
    #get_allowlists()
    #rerun_get_ens()