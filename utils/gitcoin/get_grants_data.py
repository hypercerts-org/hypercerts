from dotenv import load_dotenv
import json
import os
import pandas as pd
import requests


load_dotenv()
API_KEY = os.environ['THEGRAPH_API_KEY']

with open("config.json") as config_file:
    CONFIG = json.load(config_file)    
SETTINGS = CONFIG["gitcoin_settings"]
ROUNDS = SETTINGS["matching_pool_settings"]

# Directory for keeping csv files returned by the module
OUT_DIR = SETTINGS["path_to_round_csv_dir"]


# Get the Round Data by Querying TheGraph 
def get_round_data(round_id):

    # URL with the endpoint of the Gitcoin round manager subgraph for mainnet 
    subgraph = SETTINGS["subgraph_id"]
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
    # Initialize an empty list to store the fields
    fields = []

    # Iterate through the JSON object and add data to our list
    for round in data['data']['rounds']:
        for project in round['projects']:
            fields.append({
                'round_id': round['id'],
                'project_id': project['project'],
                'status': project['status'],
                'payoutAddress': project['payoutAddress'],
                'pointer': project['metaPtr']['pointer']
            })

    df = pd.DataFrame(fields)
    print(f"Total of {len(df)} projects extracted.")
    return df


def retrieve_ipfs_file(cid):
    # Build the URL to the file on the Cloudflare IPFS gateway
    url = f"{CONFIG['hosted_cid_base_url']}{cid}"
    
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


def main(round_id):

    # Pull the Data from TheGraph and save it to a dataframe
    df = get_round_data(round_id)

    # Add IPFS data with the grantees name and address 
    df['ipfs_data'] = df['pointer'].apply(retrieve_ipfs_file)
    df['recipient'] = df['ipfs_data'].apply(lambda x: x["application"]["recipient"])
    df['title'] = df['ipfs_data'].apply(lambda x: x["application"]["project"]["title"])
   
    # Save the data as a CSV file
    round_name = ROUNDS[round_id]["name"].replace(" ","")
    csv_file_name = '{}{}_ProjectData.csv'.format(OUT_DIR, round_name)
    df.to_csv(csv_file_name, index=False)


if __name__ == "__main__":

    for round_id in ROUNDS.keys():
        main(round_id)       