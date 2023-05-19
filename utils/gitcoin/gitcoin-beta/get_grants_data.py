from datetime import datetime
import json
import logging
import os
import pandas as pd
import re
import requests

# from ai_description import summarize

# https://github.com/gitcoinco/allo-indexer
CHAIN_NUM      = "1"
CHAINSAUCE_URL = "https://indexer-grants-stack.gitcoin.co/data/"
START_TIME     = 1682424000

ROUNDS_DATA    = "data/funding-round-data.json"
PROJECTS_DATA  = "data/projects-data.json"


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


def get_funding_rounds():

    round_url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds.json"])
    r = requests.get(round_url)
    round_data = r.json()

    funding_round_data = [
        {
            "roundId": r['id'],
            "roundName": r['metadata']['name'],
            "backgroundColor": "blue",  # manually updated later
            "backgroundVectorArt": "contours"  # manually updated later
        }
        for r in round_data
        if int(r['roundStartTime']) >= START_TIME and r['votes'] > 10
    ]

    with open(ROUNDS_DATA, 'w') as f:
        json.dump(funding_round_data, f, indent=4)


def get_allo_data():
    with open(ROUNDS_DATA) as f:
        funding_round_data = json.load(f)

    projects_data = {}
    for funding_round in funding_round_data:
        round_id = funding_round['roundId']
        round_name = funding_round['roundName']
        logging.info(f"Gathering projects data for round: {round_name}...")

        url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds", round_id, "projects.json"])
        projects_json = requests.get(url).json()

        for project in projects_json:
            if project['status'] != "APPROVED":
                continue

            projectId = project.get('id')
            if projects_data.get(projectId):
                projects_data[projectId]['fundingRounds'].append(round_name)
                continue

            app = flatten_dict(project['metadata']['application'])
            name = app.get('project.title')
            projects_data[projectId] = {
                'name': name,
                'description': app.get('project.description'),
                'address': app.get('recipient'),
                'logoImg': app.get('project.logoImg'),
                'bannerImg': app.get('project.bannerImg'),
                'externalLink': app.get('project.website'),
                'backgroundColor': funding_round['backgroundColor'],
                'backgroundVectorArt': funding_round['backgroundVectorArt'],
                'fundingRounds': [round_name]
            }
            logging.info(f"Normalized data for project: {name}")

        logging.info(f"Obtained {len(projects_data)} projects in round {round_name}.")

    with open(PROJECTS_DATA, 'w') as f:
        json.dump(projects_data, f, indent=4)

    df = pd.DataFrame(projects_data).T
    df.index.name = 'id'
    df.to_csv("data/projects.csv")


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
        logging.info(f"Gathering voting data for round: {round_name}...")

        url = "/".join([CHAINSAUCE_URL, CHAIN_NUM, "rounds", round_id, "votes.json"])
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
    #get_funding_rounds()

    get_allo_data()
    get_allowlists()