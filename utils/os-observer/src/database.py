from dotenv import load_dotenv
import json
import logging
import os
import pandas as pd
from supabase import create_client, Client
import sys

from validate_github_org import validate_github_org
from validate_eth_address import get_address_data

from events.github_events import execute_org_query
from events.zerion_scraper import convert_csvs_to_records
from events.funding_rounds import get_transfers


START, END = '2021-01-01T00:00:00Z', '2023-04-30T00:00:00Z'
QUERIES = ["merged PR", "issue", "created PR"]


PROJECTS_TABLE = 'projects'
WALLETS_TABLE = 'wallets'
EVENTS_TABLE = 'events'
FUNDING_TABLE = 'funding'

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='logging.log'
)


# -------------- DATABASE SETUP -------------- #

def supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return create_client(url, key)

supabase = supabase_client()

# -------------- DATABASE OPS ---------------- #


def select_all(table):
    response = (supabase
        .table(table)
        .select('*')
        .execute())
    return response.data


def select_all_project_events(project_id, event_type):
    response = (supabase
        .table(EVENTS_TABLE)
        .select('*')
        .eq('project_id', project_id)
        .eq('event_type', event_type)
        .execute())
    return response.data


def select_col(table, col):
    response = (supabase
        .table(table)
        .select(col)
        .execute())
    lst = [x[col] for x in response.data]
    return lst


def select_row(table, row_id):
    response = (supabase
        .table(table)
        .select('*')
        .eq('id', row_id)
        .execute())
    if response.data:
        return response.data[0]


def insert(table, records):
    response = (supabase
        .table(table)
        .insert(records)
        .execute())
    return response.data


def bulk_insert(table, records, lim=2000):
    for i in range(0, len(records), lim):
        insert(table, records[i:i + lim])


# -------------- DB INSERT SCRIPTS -------------- #


def insert_project(project):

    name = project['name']
    github_org = project['github_org']
    description = project.get('description')

    record = dict(
        name=name, 
        github_org=github_org, 
        description=description
    )
    
    response = (supabase
        .table(PROJECTS_TABLE)
        .select('id, name, github_org')
        .ilike('name', f'%{name}%')
        .execute())

    if response.data:
        logging.info(f"DUPLICATE PROJECT: {record} -> {response.data}")
        return response.data

    response = (supabase
        .table(PROJECTS_TABLE)
        .select('id, name, github_org')
        .ilike('github_org', f'%{github_org}%')
        .execute())

    if response.data:
        logging.info(f"DUPLICATE PROJECT: {record} -> {response.data}")
        return response.data
    
    return insert(PROJECTS_TABLE, record)


def insert_wallet(wallet_data):

    address = wallet_data['address']

    response = (supabase
        .table(WALLETS_TABLE)
        .select('id, project_id')
        .ilike('address', f'%{address}%')
        .execute())

    if response.data:
        logging.info(f"DUPLICATE WALLET: {address} -> {response.data}")
        return response.data

    return insert(WALLETS_TABLE, wallet_data)


def insert_grant_funding(funding_id):

    funding_data = select_row(FUNDING_TABLE, funding_id)
    if not funding_data:
        return

    grant = {
            "chain": funding_data['chain'],
            "address": funding_data['address'],
            "token": [funding_data['token']],
            "action": "tokentx"
    }
    transfers_data = get_transfers(grant)

    if not transfers_data:
        return

    wallet_mapping = {
        w['address'].lower():w['id']
        for w in select_all(WALLETS_TABLE)
    }

    events_data = []
    for event in transfers_data:
        addr = event['details'].get('to')
        if addr:
            project_id = wallet_mapping.get(addr.lower())
            if project_id:
                event.update({'project_id': project_id})
                event['details'].update({'funding_id': funding_id})
                events_data.append(event)

    return insert(EVENTS_TABLE, events_data)


# -------------- POPULATE DB SCRIPTS------------- #


def populate_from_json(json_path):
    
    with open(json_path, 'r') as f:
        projects_data = json.load(f)

    for project in projects_data:
        if not validate_github_org(project['github_org']):
            logging.info(f"INVALID GITHUB: {project['github_org']}")
            continue
        results = insert_project(project)
        project_id = results[0]['id']
        for address in project['wallets']:
            address_data = get_address_data(address)            
            if not address_data:
                logging.info(f"INVALID WALLET: {address}")
                continue
            address_data.update({'project_id': project_id})
            insert_wallet(address_data)


def insert_project_github_events(query_num, project_id, start_date, end_date):

    project_data = select_row(PROJECTS_TABLE, project_id)
    github_org = project_data['github_org']

    events = execute_org_query(query_num, github_org, start_date, end_date)
    for event in events:
        event.update({"project_id": project_id})

    bulk_insert(EVENTS_TABLE, events)
    logging.info(f"Successfully added {len(events)} events for project {github_org}")


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


# -------------- MAIN SCRIPT -------------------- #

def populate_db():

    # populate projects and wallet addresses
    populate_from_json("data/op-rpgf2/projects.json")
    populate_from_json("data/gitcoin-allo/allo.json")

    # populate github events
    start, end = '2018-01-01T00:00:00Z', '2023-05-25T00:00:00Z'
    project_ids = select_col(PROJECTS_TABLE, 'id')
    for query_num, query_name in enumerate(QUERIES):
        for pid in project_ids:            
            existing_entries = select_all_project_events(pid, query_name)
            if len(existing_entries):
                logging.info(f"\nSkipping `{pid}` for project id: {pid}")
            else:
                logging.info(f"\nAdding `{pid}` for project id: {pid}")
                insert_project_github_events(query_num, pid, start, end)



if __name__ == "__main__":
    

    populate_db()
                
    #insert_project_github_events(query_num, pid, start, end)

    
    #start, end = '2022-01-01T00:00:00Z', '2023-05-24T00:00:00Z'
    #insert_project_github_events(1, 1, start, end)
    #insert_zerion_transactions()
    #insert_grant_funding(15)