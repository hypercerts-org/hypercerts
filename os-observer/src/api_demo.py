from collections import Counter
from datetime import date
from dotenv import load_dotenv
import json
import os
import random

from supabase import create_client, Client


# ---------------------- DATABASE SETUP -------------------------------------- #

def supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return create_client(url, key)

supabase = supabase_client()


#----------------------- GLOBALS ----------------------------------------------#

PROJECT_LIST = [
    "ffc69c6c-dbd1-4077-9dc7-1b8be4a7315e",
    "f5a2f3d4-5052-4f21-9017-a1d0ae8cb943",
    # "e4b43fa9-b807-45f4-93dd-0c523ade875f",
    # "4c6b108c-0c75-49e9-8371-8b5613fe1973",
    # "bc695037-a1d1-400e-b495-18097bb0c66b",
     "de43bcbb-612a-4ed7-b493-244a7c6483ff",
    # "478a9fad-0453-4f16-aa40-4aea390f8462",
    # "f2727f30-1c71-4611-9c4e-917d22b546ba",
    # "beb3c122-a747-4328-8435-19d6e770609f",
    # "37c6e041-ecf3-45d6-ab26-339c1efcbb25",
    # "7a697c14-9953-4b09-8572-452fbe7e0d1c",
    # "f16842de-4118-4d92-921f-075c6dedca1e",
    # "c6789276-497a-451d-a8b5-17e684251eb6",
    # "f7370593-7f26-43ee-bce8-da1badf58f8b"
]

DEFAULT_START_DATE = date(2023, 1, 1)
DEFAULT_END_DATE   = date(2023, 5, 26)


#----------------------- DATA FETCHES ------------------------------------------#

def get_project_mapping():

    response = (supabase
                    .table('projects')
                    .select('id, name, github_org, description')
                    .order('name')
                    .execute())
    
    mapping = {
        project['id']: {
            'name': project['name'],
            'github': project['github_org'],
            'description': project['description']
        }
        for project in response.data
        if project['id'] in PROJECT_LIST
    }
    mapping = dict(sorted(mapping.items(), key=lambda x: x[1]['name'].lower()))

    return mapping

PROJECT_MAPPING = get_project_mapping()


def get_events_from_project(project_id, start_date, end_date):

    response = (supabase
                   .table('events')
                   .select('*')
                   .eq('project_id', project_id)
                   .gte('event_time', start_date)
                   .lte('event_time', end_date)
                   .execute())

    return response.data


def analyze_events(events, min_contribs=1):
    
    project = PROJECT_MAPPING.get(events[0]['project_id'])
    github_org = project.get('github')

    github_events = []
    onchain_events = []
    for e in events:
        source = e['details']['source']
        if source == 'github':
            github_events.append({                                
                'github_org': github_org,
                'repo': e['details']['data']['repository.name'],
                'contributor': e['contributor'],
                'event_type': e['event_type'],
                'amount': e['amount'],
                'timestamp': e['event_time']
            })
        elif source == 'zerion':
            onchain_events.append({
                'event_type': e['event_type'],
                'buy_address': e['details']['data']['Buy Currency Address'],
                'sell_address': e['details']['data']['Sell Currency Address'],
                'amount': e['amount'],
                'timestamp': e['event_time']
            })
        else:
            continue

    if min_contribs > 1:
        contrib_counts = Counter([e['contributor'] for e in github_events])
        github_events = [
            e for e in github_events
            if contrib_counts[e['contributor']] > min_contribs
        ]

    return {
        'project': project,
        'github_events': github_events,
        'onchain_events': onchain_events
    }


#----------------------- ANALYSIS ----------------------------------------------#


def generate_kpis(events_dict):

    project = events_dict['project']
    github_org = project.get('github')
    project_name = project.get('name')

    git_events = events_dict['github_events']
    contrib_counts = Counter([e['contributor'] for e in git_events])
    repo_counts = Counter(e['repo'] for e in git_events)
    event_counts = Counter(e['event_type'] for e in git_events)
    events_string = ", ".join([f"{k}s - {v}" for k,v in event_counts.items()])
    
    first_date = min([e['timestamp'] for e in git_events])
    last_date = max([e['timestamp'] for e in git_events])

    income = sum([
        e['amount'] for e in events_dict['onchain_events']
        if e['event_type'] == "funds received"
    ])
    num_users = random.randint(1000,20000)

    return {
        "project": {
            "name": project_name,
            "status": "verified",
            "start_period": first_date,
            "end_period": last_date,
            "smart_contracts_monitored": random.randint(1,10),
            "project_wallets_monitored": random.randint(1,5)
        },
        "metrics": {
            "github_contributors_count": len(contrib_counts),
            "github_contributions_count": len(git_events),
            "github_active_repos_count": len(repo_counts),
            "onchain_income": f"${income:,.0f}",
            "contract_interactions_count": random.randint(20,65000),
            "unique_onchain_users": num_users,
            "active_onchain_users": int(num_users * random.uniform(.05,.5))
        }
    }
    

def sample_api_call(project_ids=PROJECT_LIST):

    data = []
    for project_id in project_ids:
        events = get_events_from_project(project_id, DEFAULT_START_DATE, DEFAULT_END_DATE)
        events_dict = analyze_events(events)
        kpis = generate_kpis(events_dict)
        data.append(kpis)

    result = {
        "success": True,
        "message": "query excecuted successfully",
        "data": data
    }

    pretty_result = json.dumps(result, indent=2)
    print(pretty_result)

    return result

if __name__ == '__main__':
    sample_api_call()
