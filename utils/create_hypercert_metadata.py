from datetime import datetime
import json
import pandas as pd
import sys
from utils import datify, shorten_address


OUT_DIR = "metadata/"

def mapper(data):

    round_mapping = {
        "0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0": "Climate Solutions",
        "0xd95a1969c41112cee9a2c931e849bcef36a16f4c": "Open Source Software",
        "0xe575282b376e3c9886779a841a2510f1dd8c2ce4": "Ethereum Infrastructure"
    }

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

    funding_platform = "Gitcoin Grants"
    funding_round    = "Alpha Round"
    round_contract   = app_data['round']
    matching_pool    = round_mapping[round_contract]

    # todo: link work scopes to pre-assigned values
    work_scope       = project_name[:35]

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
            "impact_scope": {
                "name": "Impact Scope",
                "value": [default_impact],
                "display_value": default_impact.title()
            },
            "work_scope": {
                "name": "Work Scope",
                "value": [work_scope],
                "display_value": work_scope.title()
            },
            "work_timeframe": {
                "name": "Work Timeframe",
                "value": [work_start_date, project_date],
                "display_value": f"{datify(work_start_date)} → {datify(project_date)}"
            },
            "impact_timeframe": {
                "name": "Impact Timeframe",
                "value": [project_date, impact_end_date],
                "display_value": f"{datify(project_date)} → {datify(impact_end_date)}"
            },
            "contributors": {
                "name": "Contributors",
                "value": [project_address],
                "display_value": shorten_address(project_address)
            },
            "rights": {
                "name": "Rights",
                "value": ["public display", "-transfers"],
                "display_value": "Public display"
            },
        }
    }


def get_metadata(data):
    try:
        return mapper(data)
    except Exception as e:
        print(data)
        print(e)
        return None


def parse_csv(csv_path, out_dir):
    df = pd.read_csv(csv_path)

    for _, row in df.iterrows():
        project_name = row['title']
        metadata = get_metadata(eval(row['ipfs_data']))
        
        filename = project_name.replace("/","-")
        filename = filename if filename[0] != '.' else filename[1:]
        out_path = f"{out_dir}/{filename}.json"
        out_file = open(out_path, "w")
        json.dump(metadata, out_file, indent=4)
                
        out_file.close()


if __name__ == "__main__":

    csv_path = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) == 3 else OUT_DIR
    parse_csv(csv_path, out_dir)