from dotenv import load_dotenv
import json
import os
import requests


load_dotenv()
API_KEY = os.environ['THEGRAPH_API_KEY']

CONFIG   = json.load(open("config/config.json"))
SETTINGS = json.load(open("config/gitcoin-settings.json"))
OUTDIR   = CONFIG["localPaths"]["exportsDirectory"]

INTERVAL = 1000

# Get the QF Voting Data by Querying TheGraph 
def query_qfdata(skip):

    # URL with the endpoint of the Gitcoin round manager subgraph for mainnet 
    subgraph = SETTINGS["resources"]["subgraphId"]
    url = f"https://gateway.thegraph.com/api/{API_KEY}/subgraphs/id/{subgraph}"

    # Construct the GraphQL query
    query = '''
        {
          qfvotes (first: ''' + str(INTERVAL) + ''', skip: ''' + str(skip) + '''){
            id
            from
            to
            amount
            token
            projectId
            createdAt
          }
        }
    '''
    # Query TheGraph API for the round's data by POST request
    response = requests.post(url, json={'query': query})
    data = response.json()['data']['qfvotes']
    return data


def batch_query():

    skip = 0
    all_votes = []
    new_votes = query_qfdata(skip)
    all_votes.extend(new_votes)
    while len(new_votes) == INTERVAL:
        print(f"Fetching records {skip} - {skip + INTERVAL}.")
        skip += INTERVAL
        new_votes = query_qfdata(skip)
        all_votes.extend(new_votes)

    j = json.dumps(all_votes, indent=4)
    outpath = OUTDIR + "qfvotes.json"
    with open(outpath, "w") as outfile:
        outfile.write(j)



if __name__ == "__main__":
    batch_query()