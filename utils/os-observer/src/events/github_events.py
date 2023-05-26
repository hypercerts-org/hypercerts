from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging
import os
import requests

from events.graphql_queries import QUERIES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='logging.log'
)

# -------------- HELPER FUNCTIONS -------------- #

date_fmt = "%Y-%m-%dT%H:%M:%SZ"

def to_date(date):
    return date.strftime(date_fmt)


def find_dict_with_pageinfo(data):
    if isinstance(data, dict):
        for k, v in data.items():
            if v and 'pageInfo' in v:
                return data[k]
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
    github_token = os.getenv('GITHUB_TOKEN')

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
            headers={'Authorization': f'token {github_token}'}
        )
        response_json = response.json()        
        data = find_dict_with_pageinfo(response_json.get('data'))
        if not data:
            logging.info(f"No items found for {github_org}.")
            break

        key = data.get('edges') and "edges" or "nodes"
        events.extend(data.get(key, []))

        has_next_page = data['pageInfo']['hasNextPage']
        if has_next_page:
            end_cursor = data['pageInfo']['endCursor']
            # cursor must be passed in quotes
            end_cursor = f'"{end_cursor}"' 

    if len(events) == 1000:
        rate_limit_hit = True
        logging.warning("Hit max limit of 1000 results. Retrying")

    return events, rate_limit_hit


def paginate_query_for_org(query_func, github_org, start_date, end_date):
    start_dt = datetime.strptime(start_date, date_fmt)
    max_dt = datetime.strptime(end_date, date_fmt)
    delta_days = 180
    events = []

    while start_dt < max_dt:
        end_dt = start_dt + timedelta(days=delta_days)
        if end_dt > max_dt:
            end_dt = max_dt
        logging.info("Attempting: %s - %s", to_date(start_dt), to_date(end_dt))
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

    logging.info("Query %s: %d events found for `%s`", query['name'], len(events), github_org)

    records = []
    for event in events:
        details = {
            "source": "github",
            "data": flatten_dict(event)
        }
        timestamp = details['data'].get(query.get('timestamp'))
        contributor = details['data'].get(query.get('contributor'))
        record = {
            "event_time": timestamp or None,
            "event_type": query['name'],
            "contributor": contributor or None,
            "amount": 1,
            "details": details
        }
        records.append(record)
    return records


if __name__ == "__main__":
    test = execute_org_query(0, "gitcoinco", "2022-01-01T00:00:00Z", "2023-04-22T00:00:00Z")
