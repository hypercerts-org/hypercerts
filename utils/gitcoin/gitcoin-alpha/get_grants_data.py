from dotenv import load_dotenv
import json
import os
import requests


load_dotenv()
API_KEY = os.environ['THEGRAPH_API_KEY']

CONFIG   = json.load(open("config/config.json"))
SETTINGS = json.load(open("config/gitcoin-settings.json"))
ROUNDS   = json.load(open("config/rounds-list.json"))


# Get the Round Data by Querying TheGraph 
def get_round_data(round_id):

    # URL with the endpoint of the Gitcoin round manager subgraph for mainnet 
    subgraph = SETTINGS["resources"]["subgraphId"]
    url = f"https://gateway.thegraph.com/api/{API_KEY}/subgraphs/id/{subgraph}"

    # Construct the GraphQL query
    query = '''
        {
    rounds(where:{
        id: "''' + round_id + '''"
    }) {
        id
        projects(first:300) {
        id
        project
        status
        payoutAddress
        metaPtr {
            protocol
            pointer
        }
        }
    }
    }
    '''
    # Query TheGraph API for the round's data by POST request
    response = requests.post(url, json={'query': query})
    data = response.json()

    print(url)
    records = []

    # Iterate through the JSON object and add data to our list
    for round in data['data']['rounds']:
        for project in round['projects']:
            records.append({
                'roundId': round['id'],
                'projectId': project['project'],
                'pointer': project['metaPtr']['pointer']
            })

    print(f"Total of {len(records)} projects extracted.")
    return records


def retrieve_ipfs_file(cid):
    # Build the URL to the file on the Cloudflare IPFS gateway
    url = CONFIG['hostedCidBaseUrl'] + cid
    
    try:    
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse the JSON data
        data = json.loads(response.content)
        return data
    
    except requests.exceptions.HTTPError as e:
        print(e)
        return None


def get_grants_for_all_rounds():

    # Pull the data from TheGraph for each round
    data = []
    for rnd in ROUNDS:
        grant_data = get_round_data(rnd['roundId'])
        for grant in grant_data:

            # Retrieve the project's IPFS data
            ipfs_data = retrieve_ipfs_file(grant['pointer'])

            # Store the data
            data.append({
                'projectId': grant['projectId'],
                'roundId': rnd['roundId'],
                'data': ipfs_data
            })
    
    out_file = open(CONFIG["localPaths"]["graphData"], "w")
    json.dump(data, out_file, indent=4)                
    out_file.close()   


if __name__ == "__main__":
    get_grants_for_all_rounds()