import json
import sys
import urllib.parse
import os
import json

from utils import create_project_filename, datify


# REMEMBER TO UPDATE THIS ONCE A NEW ALLOWLIST IS GENERATED
METADATA_URL = "ipfs://bafybeifup7umb3ybxgdpyuieamgfhralogwrvncocsxi2zfej53qp3yn5a/"

METADATA_DIR = "metadata"
OUT_FILENAME = 'minting_urls.txt'
MD_FILENAME  = 'project_urls.md'


def safe_url_attr(name, value):
    return urllib.parse.quote(name, safe='') + '=' + urllib.parse.quote(value, safe='') + '&'


def parse_url(cid_with_fname):
        url_base = "https://nftstorage.link/ipfs/"
        cid_with_fname = cid_with_fname.replace("ipfs://", "")
        cid_with_fname = urllib.parse.quote(cid_with_fname)
        return url_base + cid_with_fname


def create_url(metadata):
    url = 'https://hypercerts.vercel.app/hypercerts/create?'

    url += safe_url_attr('description', metadata['description'])
    url += safe_url_attr('name', metadata['name'])
    url += safe_url_attr('externalLink', metadata['external_url'])

    url += safe_url_attr('logoUrl', parse_url(metadata['hidden_properties']['project_icon']))
    url += safe_url_attr('bannerUrl', parse_url(metadata['hidden_properties']['project_banner']))
    url += safe_url_attr('backgroundColor', metadata['hidden_properties']['bg_color'])
    url += safe_url_attr('backgroundVectorArt', metadata['hidden_properties']['vector'])

    work_time_start = datify(metadata['hypercert']['work_timeframe']['start_value'])
    url += safe_url_attr('workTimeStart', work_time_start)

    work_time_end = datify(metadata['hypercert']['work_timeframe']['end_value'])
    url += safe_url_attr('workTimeEnd', work_time_end)

    impact_time_start = datify(metadata['hypercert']['impact_timeframe']['start_value'])
    url += safe_url_attr('impactTimeStart', impact_time_start)

    impact_time_end = datify(metadata['hypercert']['impact_timeframe']['end_value']).lower()
    url += safe_url_attr('impactTimeEnd', impact_time_end)

    for idx, right in enumerate(metadata['hypercert']['rights']['value']):
        url += safe_url_attr(f"rights[{idx}]", right)
    
    for idx, work_scope in enumerate(metadata['hypercert']['work_scope']['value']):
        url += safe_url_attr(f"workScopes[{idx}]", work_scope)

    for idx, impact_scope in enumerate(metadata['hypercert']['impact_scope']['value']):
        url += safe_url_attr(f"impactScopes[{idx}]", impact_scope)

    for idx, contributor in enumerate(metadata['hypercert']['contributors']['value']):
        url += safe_url_attr(f"contributors[{idx}]", contributor)

    allowlist_url = metadata['hidden_properties']['allowlist']
    url += safe_url_attr('allowlistUrl', allowlist_url)
    
    url += safe_url_attr('fractions', "100000")

    return url


def create_markdown(metadata, minting_url):

    name = metadata['name']
    fname = create_project_filename(name)    
    metadata_json = parse_url(f"{METADATA_URL}{fname}.json")
    allowlist_csv = parse_url(metadata['hidden_properties']['allowlist'])
    
    return "\n".join([
        f"## {name}",
        f"- Gitcoin [Grant]({metadata['hidden_properties']['gitcoin_grant_url']})",
        f"- Auto-generated [metadata]({metadata_json})",
        f"- Allowlist [CSV file]({allowlist_csv})",
        f"- Custom hypercert minting [url]({minting_url})",
        "",
        "***"
    ])


def create_urls(metadata_dir, out_filename):
    grants_metadata = []
    files = [f for f in os.scandir(metadata_dir) if f.name[-5:] == ".json"]
    for file in files:
        with open(file, 'r') as f:
            grants_metadata.append(json.loads(f.read()))

    urls = []
    for metadata in grants_metadata:
        url = create_url(metadata)
        urls.append(url) 

    with open(out_filename, 'w') as f:
        for url in urls:
            f.write(f"{url}\n")

    with open(MD_FILENAME, 'w') as f:
        docstrings = []
        for metadata, url in zip(grants_metadata, urls):
            docstrings.append(create_markdown(metadata, url))
        f.write("\n".join(docstrings))

    

if __name__ == "__main__":
    metadata_dir = sys.argv[1] if len(sys.argv) == 2 else METADATA_DIR
    out_filename = sys.argv[2] if len(sys.argv) == 3 else OUT_FILENAME

    create_urls(metadata_dir, out_filename)