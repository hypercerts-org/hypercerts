from datetime import datetime
import json
import requests
import pandas as pd
import sys

# Gitcoin Round Manager subgraph ID on The Graph
SUBGRAPH = "BQXTJRLZi7NWGq5AXzQQxvYNa5i1HmqALEJwy3gGJHCr"
ROUNDS = {
    'climate': '0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0', 
    'oss': '0xd95a1969c41112cee9a2c931e849bcef36a16f4c', 
    'eth_infra': '0xe575282b376e3c9886779a841a2510f1dd8c2ce4'
}

# Get the Round Data by Querying TheGraph 
def get_round_data(round_id, api_key):
    # URL with the endpoint of the round manager subgraph for mainnet 
    url = f"https://gateway.thegraph.com/api/{api_key}/subgraphs/id/{SUBGRAPH}"

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
    #Query TheGraph API for the round's data by POST request
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
    url = f"https://cloudflare-ipfs.com/ipfs/{cid}"
    
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


def dataframe_to_sql(df, file_path):
    # Create the template for the SQL query
    template = """WITH grantees AS (
    SELECT title, address, status FROM (VALUES {}) x (title, address, status)
    )
    SELECT * FROM grantees;
    """
    # Create a list to store the values
    values_list = []
    # Iterate through the DataFrame
    for _, row in df.iterrows():
        # Check for missing values in the specified columns
        if not row[['title', 'recipient', 'status']].isnull().any():
            # If there are no missing values, add the row to the values list
            # replace single quotes with double quotes in title column
            title = row["title"].replace("'", "''")
            # Replace the first character of recipient with '\' and save it under the column named address
            address = '\\' + row["recipient"][1:]
            values_list.append("('{}', '{}' ::bytea, '{}')".format(title, address, row["status"]))

    # Create the values string
    values = ", ".join(values_list)
    # Write the query to the file
    with open(file_path, "w") as f:
        f.write(template.format(values))


def main(round_name, api_key):
    #Get the current time
    current_time = datetime.now().strftime("%Y_%m_%d-%H_%M_%S")

    #Pull the Data from TheGraph and save it to a dataframe
    round_id = ROUNDS.get(round_name)
    df = get_round_data(round_id, api_key)

    # Add IPFS data with the grantees name and address 
    df['ipfs_data'] = df['pointer'].apply(retrieve_ipfs_file)
    df['recipient'] = df['ipfs_data'].apply(lambda x: x["application"]["recipient"])
    df['title'] = df['ipfs_data'].apply(lambda x: x["application"]["project"]["title"])
   
    #Construct names for files that will be saved
    csv_file_name = '{}_{}_data.csv'.format(current_time, round_name)
    sql_file_name = '{}_{}_data.sql'.format(current_time, round_name) 

    # Save The Data 
    df.to_csv(csv_file_name, index=False)
    dataframe_to_sql(df, sql_file_name)


if __name__ == "__main__":

    if len(sys.argv) == 3:
        round_name = sys.argv[2].lower()
        if not ROUNDS.get(round_name):
            print("Please enter a valid round name.")
            print("Options are:", list(ROUNDS.keys()))
        else:
            api_key  = sys.argv[1]
            main(round_name, api_key)
            print("\n\nDone!")        
    else:
        print("Enter API key followed by a Round ID")

