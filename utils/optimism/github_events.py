import argparse
from dotenv import load_dotenv
import json
import os
import requests


load_dotenv()
GITHUB_KEY      = os.environ['GITHUB_KEY']
OUTPATH_DIR     = "data/github/"
JSONDATA_PATH   = "data/optimism_project_data.json"
PROJECTS        = json.load(open(JSONDATA_PATH))
START_DATE      = "2022-07-01"
END_DATE        = "2023-03-01"


def fetch_github_events(repo_name, start_date, end_date):
    # Set up the GitHub API endpoint URL
    endpoint_url = f"https://api.github.com/repos/{repo_name}/events"

    # Set up the query parameters
    query_params = {
        'per_page': 100, # Maximum number of results per page
        'page': 1, # Start with the first page of results
        'since': start_date, # Only fetch events that occurred on or after this date
        'until': end_date # Only fetch events that occurred on or before this date
    }

    # Set up the authentication headers using your GitHub API key
    headers = {'Authorization': f'token {GITHUB_KEY}'}

    # Make a GET request to the GitHub API endpoint with the query parameters and authentication headers
    response = requests.get(endpoint_url, params=query_params, headers=headers)

    # Create a list to store the fetched events
    events = []

    # Loop through all the pages of results until there are no more pages left
    while response.ok:
        # Extract the JSON response data
        response_data = json.loads(response.text)

        # Add the events from the current page to the list
        events.extend(response_data)

        # If there are more pages, fetch the next page of results
        if 'next' in response.links:
            response = requests.get(response.links['next']['url'], headers=headers)
        else:
            break

    # Write the fetched events to a JSON file
    filename = f"{OUTPATH_DIR}{repo_name.replace('/', '_')}_events_{start_date}_{end_date}.json"
    with open(filename, "w") as json_file:
        json.dump(events, json_file, indent=4)

    print(f"Events fetched and written to file {filename}")
    return filename


if __name__ == "__main__":
    for project in PROJECTS:
        data = []
        for social_link in project.get("socials"):
            if "github" in social_link:
                filename = fetch_github_events(social_link, START_DATE, END_DATE)
                data.append(filename)
        project.update({"github_data": data})

    with open(JSONDATA_PATH, "w") as json_file:
        json.dump(PROJECTS, json_file, indent=4)
