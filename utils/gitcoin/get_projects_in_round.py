import pandas as pd
import requests

# https://github.com/gitcoinco/allo-indexer
CHAINSAUCE_URL = "https://indexer-grants-stack.gitcoin.co/data/"
START_TIME     = 1690862400     # Aug 1, 2023


def get_rounds(chain_num):

    round_url = "/".join([CHAINSAUCE_URL, chain_num, "rounds.json"])
    r = requests.get(round_url)
    round_data = r.json()

    funding_round_data = [
        {
            "roundId": r['id'],
            "roundName": r['metadata']['name'],
        }
        for r in round_data
        if int(r['roundStartTime']) >= START_TIME and r['votes'] > 10
    ]

    return funding_round_data


def get_projects(chain_num, funding_round_data):
    
    projects_data = {}
    for funding_round in funding_round_data:
        round_id = funding_round['roundId']
        round_name = funding_round['roundName']
        print(f"Gathering projects data for round: {round_name}...")

        url = "/".join([CHAINSAUCE_URL, chain_num, "rounds", round_id, "applications.json"])
        projects_json = requests.get(url).json()

        for project in projects_json:
                        
            if project['status'] != "APPROVED":
                continue

            projectId = project.get('id')
            if projects_data.get(projectId):
                projects_data[projectId]['fundingRounds'].append(round_name)
                continue

            name = project['metadata']['application']['project']['title']
            address = project['metadata']['application']['recipient']
            
            projects_data[projectId] = {
                'name': name,
                'address': address,
                'fundingRounds': [round_name],
                'chain': chain_num
            }
            print(f"Normalized data for project: {name}")

    print(f"Obtained {len(projects_data)} projects on Chain {chain_num}.")

    return projects_data


def get_all_projects_in_round(chain_nums):
    projects_data = {}
    for chain_id in chain_nums:
        funding_round_data = get_rounds(chain_id)
        projects_data.update(get_projects(chain_id, funding_round_data))

    df = pd.DataFrame(projects_data).T
    df.sort_values(by='name', inplace=True)
    df.reset_index(inplace=True, drop=True)
    df.to_csv("projects.csv")


if __name__ == "__main__":
    get_all_projects_in_round(['10','424'])    