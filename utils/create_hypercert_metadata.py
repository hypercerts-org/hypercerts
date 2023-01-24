from datetime import datetime
import json
import pandas as pd
import sys
from utils import datify

OUT_DIR = "metadata/"

def mapper(data):

    round_mapping = {
        "0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0": {
            "name": "Climate Solutions",
            "color": "0AAD72"
        },
        "0xd95a1969c41112cee9a2c931e849bcef36a16f4c": {
            "name" : "Open Source Software",
            "color": "00A9B7"
        },
        "0xe575282b376e3c9886779a841a2510f1dd8c2ce4": {
            "name": "Ethereum Infrastructure",
            "color": "FCB53B"
        }
    }

    work_start_date  = 1663819200
    impact_end_date  = 0
    collection       = "Gitcoin Alpha Round"
    allowlist        = "ipfs://bafkreiaxdog4clqiitnarc4rrzpgdlcjsg6k2nr2n2t4thwklccza34ubi"
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
    project_github   = project_data.get('projectGithub')
    project_twitter  = project_data.get('projectTwitter')

    project_funding  = answer_data[1].get('answer')
    project_teamsize = answer_data[2].get('answer')

    round_contract   = app_data['round']
    round_name       = round_mapping[round_contract]['name']
    #bg_color         = round_mapping[round_contract]['color']

    return {
        "name": project_name,
        "description": project_descr,
        "external_url": project_url,
        "image": default_image,        
        #"background_color": bg_color,    
        "properties": {
            "impact_scope": {
                "name": "Impact Scope",
                "value": [round_name],
                "display_value": round_name
            },
            "work_scope": {
                "name": "Work Scope",
                "value": [project_name],
                "display_value": project_name
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
                "value": project_address,
                "display_value": project_address
            },
            "rights": {
                "name": "Rights",
                "value": ["public-display", "-transfers"],
                "display_value": "Public display"
            },
        },
        "hidden_properties": {
            "version": "1.0.0",
            "collection": collection,
            "icon": project_icon,
            "banner": project_banner,
            "allowlist": allowlist
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