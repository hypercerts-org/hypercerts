from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import requests


def validate_github_user(username, start_date=None, end_date=None):

    if not isinstance(username, str):
        return None

    date_fmt = "%Y-%m-%dT%H:%M:%SZ"
    if not start_date and not end_date:
        start_date = (datetime.today() - timedelta(days=365)).strftime(date_fmt)
        end_date = datetime.today().strftime(date_fmt)

    query = """
        query ContributionsView($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
            }
          }
        }
    """

    load_dotenv()    
    token = os.getenv('GITHUB_TOKEN')
    headers = {'Authorization': f'token {token}'}
    variables = {
      "username": username,
      "from": start_date,
      "to": end_date
    }
    response = requests.post(
        'https://api.github.com/graphql', 
        json={'query': query, 'variables': variables}, 
        headers=headers
    )
    try:
        response_json = response.json()
        data = response_json['data']
        contributions = data['user']['contributionsCollection']
        return contributions
    except:
        print(f"Encountered error retrieving contributions for https://github.com/{username}.")
        print(response_json)
        return None


if __name__ == "__main__":
    # test case
    validate_github_user("ccerv1")        
