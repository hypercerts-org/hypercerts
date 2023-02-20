import csv
import json
import os
import urllib.parse

from utils import create_project_filename, datify


with open("config.json") as config_file:
    CONFIG = json.load(config_file)

METADATA_DIR = CONFIG["path_to_metadata_directory"]
MD_FILENAME  = CONFIG["path_to_project_urls_markdown"]
CSV_FILENAME = MD_FILENAME.replace(".md", ".csv")
CID_HOST_URL = CONFIG["hosted_cid_base_url"]

RESIZED_BANNER_URL = CONFIG["gitcoin_settings"]["resized_banner_base_url"]

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
    name = metadata['name']
    params = dict(
        name = name,
        description = metadata['description'][:MAXLEN_DESCR],

        externalLink = metadata['external_url'],
        logoUrl = metadata['hidden_properties']['project_icon'],
        bannerUrl = "".join([RESIZED_BANNER_URL, create_project_filename(name), ".png"]),
        backgroundColor = metadata['hidden_properties']['bg_color'],
        backgroundVectorArt = metadata['hidden_properties']['vector'],
        metadataProperties = json.dumps(metadata['properties']),

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


def create_markdown_row(grant_data, hypercert_metadata, minting_url):

    name = grant_data['title']
    fname = create_project_filename(name)    
    allowlist_csv = cid_to_url(hypercert_metadata['hidden_properties']['allowlist'])
    if len(hypercert_metadata['description']) >= MAXLEN_DESCR:
        flag = f"Description length"
    else:
        flag = ""
    
    return "|".join([
        name.replace("|","∙"),
        "∙".join([
            f"[Gitcoin]({grant_data['projectGrantPage']})",
            f"[Hypercert]({minting_url})",
        ]),
        f"[{grant_data['fractionsTotalSupply']}]({allowlist_csv})",
        flag
    ])


def create_markdown_export():

    with open(MD_FILENAME, 'w') as f:
        for matching_pool, grants_list in PROJECTS_DB.items():
            f.write(f"# {matching_pool}\n")
            f.write("| Num | Project | Project Links | Fractions | Flags |\n")
            f.write("| --- | ------- | ------------- | --------- | ----- |\n")
            for i, grant in enumerate(grants_list):
                fname = METADATA_DIR + create_project_filename(grant['title']) + ".json"
                metadata = json.load(open(fname))
                url = create_url(metadata)
                markdown = create_markdown_row(grant, metadata, url)
                num = str(i+1).zfill(2)
                f.write(f"{num}|{markdown}|\n")
            f.write("\n\n")
    f.close()


def create_csv_export():
    with open(CSV_FILENAME, 'w') as f:
        writer = csv.writer(f)
        writer.writerow(["Num", "Round", "Project", "Gitcoin Page", "Hypercert URL", "Fractions", 
                         "Project Wallet Address",  "Wallet Type", "Has Optimism?", "OpETH Balance"])
        for round_num, (matching_pool, grants_list) in enumerate(PROJECTS_DB.items()):
            for i, grant in enumerate(grants_list):
                num = round((round_num+1) + ((i+1)/100),2)
                fname = METADATA_DIR + create_project_filename(grant['title']) + ".json"
                metadata = json.load(open(fname))
                url = create_url(metadata)
                writer.writerow([
                    num,
                    matching_pool,
                    grant['title'].replace(",", ""),
                    grant['projectGrantPage'],
                    url,
                    grant['fractionsTotalSupply'],
                    f"https://etherscan.io/address/{grant['address']}",
                    grant['addressType'],
                    grant['optimismAddressFound'],
                    grant['optimismBalanceEth']
                ])
    f.close()           


def create_html_export():

    header = '''
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th, td {
        padding: 5px;
    }
    th {
        text-align: left;
    }
    </style>
    </head>
    <body>
    <table>
        <tr>
          <th>Num</th>
          <th>Round</th>
          <th>Project</th>
          <th>Logo</th>
          <th>Banner</th>
          <th>Hypercert URL</th>
          <th>Fractions</th>
          <th>Project Wallet Address</th>
          <th>Wallet Type</th>
          <th>OpETH Balance</th>
        </tr>
      '''

    footer = "</table></body></html>"

    td = lambda row: f"<td>{row}</td>"
    body = []

    for round_num, (matching_pool, grants_list) in enumerate(PROJECTS_DB.items()):
        for i, grant in enumerate(grants_list):
            num = round((round_num+1) + ((i+1)/100),2)
            fname = METADATA_DIR + create_project_filename(grant['title']) + ".json"
            metadata = json.load(open(fname))
            
            grantName = grant['title']
            grantPage = grant['projectGrantPage']
            url = create_url(metadata)
            logo = grant['projectLogoUrl']
            banner = grant['projectBannerUrl']
            address = grant['address']
            row = "\n".join([
                "<tr>",
                td(num),
                td(matching_pool),
                td(f'<a href="{grantPage}">{grantName}</a>'),
                td(f'<img src="{logo}" width="40" height="40"'),
                td(f'<img src="{banner}" style="width: 320px; height: 214px; object-fit: cover; object-position: 100% 0;">'),
                td(f'<a href="{url}">Hypercert URL</a>'),
                td(grant['fractionsTotalSupply']),
                td(f'<a href="https://etherscan.io/address/{address}">{address[:5]}...{address[-3:]}</a>'),
                td(grant['addressType']),
                td(grant['optimismBalanceEth']),
                "</tr>"
            ])
            body.append(row)
    html = header + "\n".join(body) + footer

    with open("data/projects/project_urls.html", "w") as f:
        f.write(html)


    
if __name__ == "__main__":
    create_markdown_export()
    create_csv_export()
    create_html_export()