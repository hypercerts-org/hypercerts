from dotenv import load_dotenv
import json
import os
from supabase import create_client, Client
import sys

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def fetch_col(table_name, col_name):
    data, _ = (supabase
        .table(table_name)
        .select(col_name)
        .execute())
    result = [x[col_name] for x in data[1]]
    return result


def insert_projects(json_path, table_name):
    with open(json_path, 'r') as f:
        projects_data = json.load(f)

    orgs = fetch_col(table_name, 'github_org')
    for project in projects_data:
        if project['github_org'] not in orgs:    
            data, count = (supabase
                .table(table_name)
                .insert(project)
                .execute())
            print(f"Successfully added {project['name']} to {table_name}")


if __name__ == "__main__":
    insert_projects("data/projects.json", "projects")
