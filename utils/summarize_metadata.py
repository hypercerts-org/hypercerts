import os
import json

METADATA_DIR = "metadata/"

def dedup(arr):
    return list(dict.fromkeys(arr))

def summarize_metadata():
    work_scopes = []
    impact_scopes = []
    rights = []
    collections = []

    json_files = []
    for file in os.scandir(METADATA_DIR):
        with open(file, 'r') as f:
            json_files.append(json.loads(f.read()))

    for metadata in json_files:



        work_scopes.extend(metadata['properties']['work_scope']['value'])
        impact_scopes.extend(metadata['properties']['impact_scope']['value'])
        rights.extend(metadata['properties']['rights']['value'])
        collections.append(metadata['properties']['collection'])

    # work_scopes = dedup(work_scopes)
    # impact_scopes = dedup(impact_scopes)
    # rights = dedup(rights)
    # collections = dedup(collections)

    # print(len(json_files))
    # print(len(work_scopes))

    data = {
        "impact_scopes": impact_scopes,
        "rights": rights,
        "collections": collections,
        "work_scopes": work_scopes,
    }

    out_file = open('metadata_summary.json', "w")
    json.dump(data, out_file, indent=4)        
    out_file.close()

if __name__ == "__main__":
    summarize_metadata()