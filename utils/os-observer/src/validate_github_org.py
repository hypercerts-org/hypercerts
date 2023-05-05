from dotenv import load_dotenv
import os
import requests


def validate_github_org(owner):

    load_dotenv()    
    token = os.getenv('GITHUB_TOKEN')

    query = """
        query ($owner: String!) {
          organization(login: $owner) {
            repositories(first: 10) {
              nodes {
                name
                url
              }
            }
          }
        }    
    """
    headers = {'Authorization': f'token {token}'}
    variables = {'owner': owner}
    response = requests.post(
        'https://api.github.com/graphql', 
        json={'query': query, 'variables': variables}, 
        headers=headers
    )
    try:
        response_json = response.json()
        response.raise_for_status()
    except:
        print(f"Encountered error retrieving repos for https://github.com/{owner}.")
        print(f"Response JSON: {json.dumps(response.json(), indent=2)}")
        return False

    data = response_json['data'].get('organization')
    if data:
    	return True

    print(f"No valid organization / repositories found for https://github.com/{owner}")
    return False
