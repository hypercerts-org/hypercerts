from datetime import datetime, timedelta
from dotenv import load_dotenv
import json
import os
import requests

from src.graphql_queries import QUERIES

# -------------- HELPER FUNCTIONS -------------- #

def find_dict_with_pageinfo(data):

    if isinstance(data, dict):
        for k, v in data.items():
            if v and 'pageInfo' in v:
                return data[k]
            else:
                result = find_dict_with_pageinfo(v)
                if result is not None:
                    return result
    return None


def flatten_dict(d):

    flattened_dict = {}
    for key, value in d.items():
        if isinstance(value, dict):
            inner_dict = flatten_dict(value)
            flattened_dict.update({f"{key}.{inner_key}": inner_value for inner_key, inner_value in inner_dict.items()})
        elif isinstance(value, list):
            flattened_dict.update({f"{key}.{i}": item for i, item in enumerate(value)})
        else:
            flattened_dict[key] = value
    return flattened_dict      

# -------------- QUERY CONSTRUCTORS -------------- #

def run_query_for_org(query_func, github_org, start_date, end_date):

    load_dotenv()    
    token = os.getenv('GITHUB_TOKEN')

    end_cursor = "null"
    has_next_page = True
    rate_limit_hit = False
    events = []
    while has_next_page:
        query_string = query_func(
            org=github_org, 
            first=100, 
            after=end_cursor, 
            since=start_date, 
            until=end_date
        )
        response = requests.post(
            'https://api.github.com/graphql', 
            json={'query': query_string}, 
            headers={'Authorization': f'token {token}'}
        )
        response_json = response.json()
        data = find_dict_with_pageinfo(response_json['data'])
        if not data:
            print(f"No items found for {github_org}.")
            break

        key = "edges" if "edges" in data.keys() else "nodes"
        events.extend(data[key])

        has_next_page = data['pageInfo']['hasNextPage']
        if has_next_page:
            end_cursor = data['pageInfo']['endCursor']
            end_cursor = f'"{end_cursor}"'

    if len(events) == 1000:
        rate_limit_hit = True
        print("Hit max limit of 1000 results. Retrying")
        return None, rate_limit_hit

    return events, rate_limit_hit
    

def paginate_query_for_org(query_func, github_org, start_date, end_date):

    date_fmt = "%Y-%m-%dT%H:%M:%SZ"
    to_date = lambda x: x.strftime(date_fmt)
    
    start_dt = datetime.strptime(start_date, date_fmt)
    max_dt = datetime.strptime(end_date, date_fmt) 
    delta_days = 180
    events = []
    while start_dt < max_dt:
        end_dt = start_dt + timedelta(days=delta_days)
        if end_dt > max_dt:
            end_dt = max_dt
        print("Attempting:", to_date(start_dt), to_date(end_dt))
        new_events, rate_limit_hit = run_query_for_org(query_func, github_org, to_date(start_dt), to_date(end_dt))
        if rate_limit_hit:
            delta_days //= 3
        else:
            events.extend(new_events)
            start_dt += timedelta(days=delta_days)

    return events


def execute_org_query(query_idx, github_org, start_date, end_date):

    query = QUERIES[query_idx]
    query_func = query['func']

    events, rate_limit_hit = run_query_for_org(query_func, github_org, start_date, end_date)
    if rate_limit_hit:
        events = paginate_query_for_org(query_func, github_org, start_date, end_date)

    print(f"Query {query['name']}: {len(events)} events found for `{github_org}`")

    records = []
    for event in events:
        details = flatten_dict(event)
        records.append({
            "timestamp": details[query['timestamp']],
            "data_source": "github",
            "event_type": query['name'],
            "contributor": details.get(query['contributor']),
            "details": details
        })
    return records


if __name__ == "__main__":

    #START, END = '2022-01-01T00:00:00Z', '2023-04-22T00:00:00Z'
    #test = execute_org_query(0, "NethermindEth", "2022-01-01T00:00:00Z", "2023-04-22T00:00:00Z")
    test = execute_org_query(0, "truffle-box", "2022-01-01T00:00:00Z", "2023-04-22T00:00:00Z")  
    