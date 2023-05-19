import csv
from dotenv import load_dotenv
import json
import os
import requests
import urllib.parse


PROJECTS          = json.load(open("data/projects-data.json"))
DESCRIPTIONS      = json.load(open("data/descriptions.json"))
WORK_SCOPES       = json.load(open("data/workscopes.json"))
CIDS              = json.load(open("data/cids.json"))

CONFIG            = json.load(open("config.json"))

# TODO: update dates
WORK_START        = "2023-01-16"
WORK_END          = "2023-04-25"


def url_parse(val):
    return urllib.parse.quote(val, safe='')


def safe_url_attr(name, value):
    parser = lambda k,v: url_parse(k) + '=' + url_parse(v)
    if isinstance(value, list):
        url_field = "&".join([parser(f"{name}[{i}]", x) for (i, x) in enumerate(value)])
    else:
        url_field = parser(name, value)
    return url_field


def create_url(project_id):

    project = PROJECTS.get(project_id) 

    # TODO: check for ENS
    address = project.get("address")
    hypercert = {
        "workScopes": WORK_SCOPES.get(project_id),
        "workTimeStart": WORK_START,
        "workTimeEnd": WORK_END,
        "impactScopes": ["all"],
        "impactTimeStart": WORK_START,
        "impactTimeEnd": "indefinite",
        "contributors": address,
        "rights": ["Public Display"]
    }
    
    # TODO: confirm all projects have valid images
    base = CONFIG['hostedCidBaseUrl']
    logo_uri = f"{base}{project.get('logoImg')}"
    banner_uri = f"{base}{CIDS['img']}/img/{project_id}.png"
    allowlist_uri = f"{base}{CIDS['allowlists']}/allowlists/{project_id}.csv"

    properties = [
        {
            "trait_type": "Funding Platform",
            "value": "Gitcoin Grants"
        },
        {
            "trait_type": "Funding Round",
            "value": "Beta Round"
        },
        # TODO: figure out how to make this render as an array value
        {
            "trait_type": "Matching Pool", 
            "value": ", ".join(project['fundingRounds'])
        }
    ]   
    
    params = dict(
        name = project['name'],
        **hypercert,
        description = DESCRIPTIONS.get(project_id),
        externalLink = project['externalLink'],        
        logoUrl = logo_uri,
        bannerUrl = banner_uri,
        allowlistUrl = allowlist_uri,        
        metadataProperties = json.dumps(properties),
        backgroundColor = project['backgroundColor'],
        backgroundVectorArt = project['backgroundVectorArt'],
    )
    params = "&".join([safe_url_attr(k,v) for (k,v) in params.items()])
    url = CONFIG['hypercertTestingUrl'] + params
    
    return url



def create_csv_export():

    csv_filename = "data/minting_urls.csv"
    with open(csv_filename, 'w') as f:
        writer = csv.writer(f)
        cols = ['id', 'name', 'mintingUrl']
        writer.writerow(cols)

        for project_id, project in PROJECTS.items():         
            url = create_url(project_id)
            writer.writerow([project_id, project['name'], url])

    f.close()        

    
if __name__ == "__main__":
    create_csv_export()
