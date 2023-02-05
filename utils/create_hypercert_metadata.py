from datetime import datetime
import json
import pandas as pd
import sys
from utils import build_scope, create_project_filename, datify, shorten_address


OUT_DIR = "metadata/"
with open("canonical_project_list.json", "r") as project_db:
    PROJECTS_DB = json.load(project_db)
with open("round_config.json") as round_config:
    ROUND_CONFIG = json.load(round_config)    

# IMPORTANT: make sure this is updated once the Gitcoin Round is locked
ALLOWLIST_BASE_URL = "ipfs://bafybeigcogqgin67mtssk5fhprxvvysk74lmki4i6eqk6iuurlvu4vzopm/"


def verify_project(project_round, project_title, project_address):
    """
    Verify if a project is active in a given Gitcoin Round
    """
    list_of_active_projects = PROJECTS_DB.get(project_round)
    if list_of_active_projects:
        for p in list_of_active_projects:
            if p['title'] == project_title and p['address'] == project_address:
                return True
    return False


def mapper(data, project_id):

    
    version          = "1.0.0"

    work_start_date  = 1663819200
    impact_end_date  = 0
    default_impact   = "all"
    default_image    = "ipfs://bafkreicchjbpbb2hfcg5mtmlz3zktf2wt5dnux2rzx33ta7b6bhrozlbgi"    

    app_data         = data['application']
    project_data     = app_data['project']
    answer_data      = app_data['answers']

    project_address  = app_data['recipient']
    project_name     = project_data['title']
    project_descr    = project_data['description']
    project_url      = project_data['website']

    project_date     = int(str(project_data.get('createdAt', '1673829248'))[:10])
    project_icon     = "ipfs://" + project_data.get('logoImg', 'bafkreiejljnf6xf6kwcvh3wjef5xa3n7gscdumrmurmt4otkozbx5524r4')
    project_banner   = "ipfs://" + project_data.get('bannerImg', 'bafkreigkmcufguhakp4nbucca6d2rt7nw7ourdnkqfbs2gvsue4j4ohsly')
    allowlist_url    = ALLOWLIST_BASE_URL + create_project_filename(project_name) + ".csv"

    funding_platform = "Gitcoin Grants"
    funding_round    = "Alpha Round"
    round_contract   = app_data['round']
    round_data       = ROUND_CONFIG[round_contract]
    matching_pool    = round_data['name']
    bg_color         = round_data['color']
    bg_vector        = round_data['vector']
    grant_page_url   = f"https://grant-explorer.gitcoin.co/#/round/1/{round_contract}/{project_id}-{round_contract}"

    # todo: link work scopes to pre-assigned values
    work_scope       = project_name[:35]

    if not verify_project(matching_pool, project_name, project_address):
        return None

    return {
        "name": project_name,
        "description": project_descr,
        "external_url": project_url,
        "image": project_icon,
        "version": version,           
        "properties": [
           {
                "trait_type": "Funding Platform", 
                "value": funding_platform
            },
            {
                "trait_type": "Funding Round", 
                "value": funding_round
            },
            {   
                "trait_type": "Matching Pool", 
                "value": matching_pool
            }
        ],
        "hypercert": {
            "impact_scope": build_scope(
                name="Impact Scope",
                include_list=[default_impact]
            ),
            "work_scope": build_scope(
                name="Work Scope",
                include_list=[work_scope]
            ),
            "work_timeframe": {
                "name": "Work Timeframe",
                "start_value": work_start_date,
                "end_value": project_date,
                "display_value": f"{datify(work_start_date)} → {datify(project_date)}"
            },
            "impact_timeframe": {
                "name": "Impact Timeframe",
                "start_value": project_date,
                "end_value": impact_end_date,
                "display_value": f"{datify(project_date)} → {datify(impact_end_date)}"
            },
            "contributors": {
                "name": "Contributors",
                "value": [project_address],
                "display_value": shorten_address(project_address)
            },
            "rights": build_scope(
                name="Rights",
                include_list=["Public Display"],
                exclude_list=["Transfers"]
            ),
        },
        "hidden_properties": {
            "allowlist": allowlist_url,
            "project_banner": project_banner,
            "project_icon": project_icon,
            "gitcoin_grant_url": grant_page_url,
            "bg_color": bg_color,
            "vector": bg_vector
        }
    }


def ingest_workscope_overrides(csv_path='csv/workscope_overrides.csv'):
    """
    Override default work scopes using cleaner ones prepared by the team
    Note: this is very brittle solution powered by a Notion DB!
    """
    override_data = pd.read_csv(csv_path)
    overrides = {}
    for _, row in override_data.iterrows():
        project = row['project']
        workscope = row['work_scope']
        if workscope != project:
            overrides.update({project:workscope})
    return overrides


def process_overrides(metadata, overrides):
    project_name = metadata['name']
    new_workscope = overrides.get(project_name)
    if new_workscope:
        print("Updating work scope for", project_name)
        metadata['hypercert']['work_scope'].update(
            {
                'value': [new_workscope],
                'display_value': new_workscope
            })


def get_metadata(data):
    if isinstance(data['ipfs_data'], str):
        ipfs_data = eval(data['ipfs_data'])
    else:
        ipfs_data = data['ipfs_data']
    project_id = data['project_id']    
    try:        
        return mapper(ipfs_data, project_id)
    except Exception as e:
        print(data)
        print(e)
        return None


def parse_csv(csv_path, out_dir):
    counter = 0
    df = pd.read_csv(csv_path)
    workscope_overrides_dict = ingest_workscope_overrides()
    for _, row in df.iterrows():        
        metadata = get_metadata(row)
        if metadata:
            process_overrides(metadata, workscope_overrides_dict)
            filename = create_project_filename(metadata['name'])
            out_path = f"{out_dir}/{filename}.json"
            out_file = open(out_path, "w")
            json.dump(metadata, out_file, indent=4)                
            out_file.close()
            counter += 1
    print(f"Created metadata for {counter} projects.")


if __name__ == "__main__":

    csv_path = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) == 3 else OUT_DIR
    parse_csv(csv_path, out_dir)