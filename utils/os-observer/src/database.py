from dotenv import load_dotenv
import json
import os
import pandas as pd
from supabase import create_client, Client
import sys

from github_events import execute_org_query
from zerion_scraper import convert_csvs_to_records

# -------------- DATABASE SETUP -------------- #

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

projects_table = 'projects'
wallets_table = 'wallets'
events_table = 'events'

# -------------- HELPER FUNCTIONS -------------- #

def fetch_col(table_name, col_name):
    data, _ = (supabase
        .table(table_name)
        .select(col_name)
        .execute())
    result = [x[col_name] for x in data[1]]
    return result


def insert_wallet(wallet_data):
    data, count = (supabase
        .table(wallets_table)
        .insert(wallet_data)
        .execute())    
    print(f"Successfully added {wallet_data['address']} to the wallets table.")
    return data[1][0]


def insert_project(project_data):
    data, count = (supabase
        .table(projects_table)
        .insert(project_data)
        .execute())
    print(f"Successfully added {project_data['name']} to the projects table.")
    return data[1][0]


def bulk_insert_events(records):
    data, count = (supabase
        .table(events_table)
        .insert(records)
        .execute())
    return data    


def batch_bulk_insert_events(records, batch_size):
    batches = [
        records[i:i + batch_size] 
        for i in range(0, len(records), batch_size)
    ]
    for event_batch in batches:
        bulk_insert_events(event_batch)


def check_if_events_exist(project_id, event_type):
    data, count = (supabase
        .table(events_table)
        .select("id, event_type")
        .eq("project_id", project_id)
        .eq("event_type", event_type)                
        .execute())
    return len(data[1]) > 0

# -------------- DB INSERT SCRIPTS -------------- #

def insert_projects_and_wallets_from_json(json_path):
    with open(json_path, 'r') as f:
        projects_data = json.load(f)

    existing_orgs = fetch_col(projects_table, 'github_org')
    existing_wallets = fetch_col(wallets_table, 'address')

    for project in projects_data:
        if project['github_org'] not in existing_orgs: 
            project_wallets = project.pop('wallets')
            project_data = insert_project(project)
            project_id = project_data['id']
            existing_orgs.append(project_data['github_org'])

            for wallet in project_wallets:
                if wallet['address'] not in existing_wallets:
                    wallet.update({'project_id': project_id})
                    wallet_data = insert_wallet(wallet)
                    existing_wallets.append(wallet_data['address'])


def insert_project_github_events(query_num, project_id, github_org):

    start, end = '2021-01-01T00:00:00Z', '2023-04-30T00:00:00Z'
    events = execute_org_query(query_num, github_org, start, end)
    for event in events:
        event.update({"project_id": project_id, "amount": 1})

    batch_bulk_insert_events(events, 2000)
    print(f"Successfully added {len(events)} events for project {github_org}")          


def insert_all_events():

    data, count = (supabase
        .table(projects_table)
        .select('id', 'github_org')
        .execute())

    projects = data[1]
    for query_num, query_type in enumerate(["merged PR", "issue", "created PR"]):
        for project in projects:            
            if check_if_events_exist(project['id'], query_type):
                continue
            print("\n***", project['github_org'], "***")
            insert_project_github_events(query_num, project['id'], project['github_org'])


def insert_zerion_transactions():

    records = convert_csvs_to_records()

    batch_size = 1000
    batches = [
        records[i:i + batch_size] 
        for i in range(0, len(records), batch_size)
    ]

    for batch in batches:
        data, count = (supabase
            .table("events")
            .insert(batch)
            .execute())


if __name__ == "__main__":

    #insert_projects_and_wallets_from_json("data/projects.json")
    #insert_all_events()
    #insert_zerion_transactions()
