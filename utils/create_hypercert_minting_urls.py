import json
import os
import urllib.parse

from utils import create_project_filename, datify


with open("config.json") as config_file:
    CONFIG = json.load(config_file)

METADATA_URL = CONFIG["ipfs_cids"]["hypercert_metadata_base"]
METADATA_DIR = CONFIG["path_to_metadata_directory"]
OUT_FILENAME = CONFIG["path_to_minting_urls"]
MD_FILENAME  = CONFIG["path_to_project_urls_markdown"]
CID_HOST_URL = CONFIG["hosted_cid_base_url"]

with open(CONFIG["gitcoin_settings"]["path_to_project_list"]) as projects_file:
    PROJECTS_DB = json.load(projects_file)

MAXLEN_DESCR = 1400


def url_parse(val):
    return urllib.parse.quote(val, safe='')


def safe_url_attr(name, value):
    parser = lambda k,v: url_parse(k) + '=' + url_parse(v)
    if isinstance(value, set):
        url_field = "&".join([parser(f"{name}[{i}]", x) for (i, x) in enumerate(value)])
    else:
        url_field = parser(name, value)
    return url_field


def cid_to_url(cid_with_fname):
    return CID_HOST_URL + url_parse(cid_with_fname)


def create_url(metadata):
    
    base_url = CONFIG["hypercert_dapp_base_url"]
    params = dict(
        name = metadata['name'],
        description = metadata['description'][:MAXLEN_DESCR],

        externalLink = metadata['external_url'],
        logoUrl = metadata['hidden_properties']['project_icon'],
        bannerUrl = metadata['hidden_properties']['project_banner'],
        backgroundColor = metadata['hidden_properties']['bg_color'],
        backgroundVectorArt = metadata['hidden_properties']['vector'],

        workScopes = ",".join(metadata['hypercert']['work_scope']['value']),
        workTimeStart = datify(metadata['hypercert']['work_timeframe']['start_value']),
        workTimeEnd = datify(metadata['hypercert']['work_timeframe']['end_value']),
        
        impactScopes = set(metadata['hypercert']['impact_scope']['value']),
        #impactTimeStart = datify(metadata['hypercert']['impact_timeframe']['start_value']),
        impactTimeEnd = datify(metadata['hypercert']['impact_timeframe']['end_value']),
        
        contributors = ",".join(metadata['hypercert']['contributors']['value']),
        rights = set(metadata['hypercert']['rights']['value']),    
        allowlistUrl = cid_to_url(metadata['hidden_properties']['allowlist'])
    )
    
    params = "&".join([safe_url_attr(k,v) for (k,v) in params.items()])
    url = base_url + params
    return url


def create_markdown(metadata, minting_url, num_fractions):

    name = metadata['name']
    fname = create_project_filename(name)    
    metadata_json = cid_to_url(f"{METADATA_URL}/{fname}.json")
    allowlist_csv = cid_to_url(metadata['hidden_properties']['allowlist'])
    if len(metadata['description']) >= MAXLEN_DESCR:
        flag = f"Description length"
    else:
        flag = ""
    
    return "|".join([
        name,
        "∙".join([
            f"[Gitcoin Page]({metadata['hidden_properties']['gitcoin_grant_url']})",
            f"[Minting URL]({minting_url})",
        ]),
        f"[{num_fractions} fractions]({allowlist_csv})",
        flag
    ])


def create_urls():

    with open(MD_FILENAME, 'w') as f:
        for matching_pool, grants_list in PROJECTS_DB.items():
            f.write(f"# {matching_pool}\n")
            f.write("| Num | Project | Project Links | Fractions | Flags |\n")
            f.write("| --- | ------- | ------------- | --------- | ----- |\n")
            for i, grant in enumerate(grants_list):
                fname = METADATA_DIR + create_project_filename(grant['title']) + ".json"
                metadata = json.load(open(fname))
                url = create_url(metadata)
                markdown = create_markdown(metadata, url, grant['fractions'])
                num = str(i+1).zfill(2)
                f.write(f"{num}|{markdown}|\n")
            f.write("\n\n")
    f.close()

    
if __name__ == "__main__":
    create_urls()