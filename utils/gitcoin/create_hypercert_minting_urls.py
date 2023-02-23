import csv
import json
import os
import urllib.parse

from utils import create_project_filename


CONFIG          = json.load(open("config/config.json"))
SETTINGS        = json.load(open("config/gitcoin-settings.json"))
JSONDATA_PATH   = CONFIG["localPaths"]["canonicalDataset"]
PROJECTS_DB     = sorted(json.load(open(JSONDATA_PATH)), key=lambda d: d['roundName'])

EXPORTS_DIR     = CONFIG["localPaths"]["exportsDirectory"]
LOGO_IMG_BASE   = SETTINGS["resources"]["hostedCidBaseUrl"]
BACKUP_LOGO_CID = SETTINGS["defaultArt"]["icon"]
ALLOWLISTS_BASE = CONFIG["allowlistBaseUrl"]
BANNER_IMG_BASE = CONFIG["bannerImageBaseUrl"]
DAPP_BASE_URL   = CONFIG["hypercertCreateUrl"]
ERC1155_PROPS   = SETTINGS["properties"]

ROUNDS          = json.load(open("config/rounds-list.json"))
ROUND_MAPPINGS  = {r["roundId"]: r for r in ROUNDS}

MAXLEN_DESCR    = 500


def url_parse(val):
    return urllib.parse.quote(val, safe='')


def safe_url_attr(name, value):
    parser = lambda k,v: url_parse(k) + '=' + url_parse(v)
    if isinstance(value, list):
        url_field = "&".join([parser(f"{name}[{i}]", x) for (i, x) in enumerate(value)])
    else:
        url_field = parser(name, value)
    return url_field


def edit_description(text):
    if len(text) > MAXLEN_DESCR:
        text = "\n".join([
            f"** Your description was truncated because it exceeded {MAXLEN_DESCR} chars. **",
            "** Please review and provide a new description for your hypercert. **\n",
            text[:MAXLEN_DESCR]
        ])
    return text


def create_url(project):
    
    name = project['title']
    filename = create_project_filename(name)
    logo_cid = project["projectLogoCid"] if project["projectLogoCid"] else BACKUP_LOGO_CID
    round_id = project['roundId']
    round_data = ROUND_MAPPINGS[round_id]
    properties = ERC1155_PROPS.copy()
    {
      "trait_type": "Funding Round",
      "value": "Alpha Round"
    }
    properties.append({'trait_type': 'Matching Pool', 'value': project['roundName']})
    params = dict(
        name = name,
        **project['hypercertData'],
        description = edit_description(project['projectDescription']),
        externalLink = project["projectWebsite"],
        logoUrl = LOGO_IMG_BASE + logo_cid,
        bannerUrl = "".join([BANNER_IMG_BASE, filename, ".png"]),
        allowlistUrl = "".join([ALLOWLISTS_BASE, filename, ".csv"]),
        metadataProperties = json.dumps(properties),
        backgroundColor = round_data['backgroundColor'],
        backgroundVectorArt = round_data['backgroundVectorArt'],
    )
    params = "&".join([safe_url_attr(k,v) for (k,v) in params.items()])
    url = DAPP_BASE_URL + params
    
    return url


def create_markdown_row(project):

    name = project['title']
    filename = create_project_filename(name)    
    allowlist_csv = "".join([ALLOWLISTS_BASE, filename, ".csv"])
    minting_url = create_url(project)

    if len(project['projectDescription']) >= MAXLEN_DESCR:
        flag = f"Description length"
    else:
        flag = ""
    
    return "|".join([
        name.replace("|","∙"),
        f"[Hypercert]({minting_url})",
        f"{project['fractionsTotalSupply']}",
        flag
    ])


def create_markdown_export():

    md_filename = EXPORTS_DIR + "project_urls.md"
    with open(md_filename, 'w') as f:
        
        matching_pool = ""
        for project in PROJECTS_DB:
            if matching_pool != project['roundName']:                
                matching_pool = project['roundName']
                f.write(f"\n\n# {matching_pool}\n")
                f.write("| Project | Project Links | Fractions | Flags |\n")
                f.write("| ------- | ------------- | --------- | ----- |\n")
            
            markdown = create_markdown_row(project)
            f.write(f"|{markdown}|\n")
    
    f.close()


def create_csv_export():

    csv_filename = EXPORTS_DIR + "project_urls.csv"
    with open(csv_filename, 'w') as f:

        writer = csv.writer(f)
        cols = ['title', 'roundName', 'mintingUrl', 'address', 'ensName', 'addressType', 'optimismBalanceEth',               
                'fundingTotalDollars', 'donorsTotal', 'fractionsTotalSupply', 'hypercertEligibleDonors',
                'projectWebsite', 'projectTwitter', 'projectGithub', 'userGithub']
        writer.writerow(cols)

        for project in PROJECTS_DB:
            p = project.copy()
            p['mintingUrl'] = create_url(project)
            p['address'] = "https://etherscan.io/address/" + project['address']
            p['optimismBalanceEth'] = p['addressScan'].get("optimismBalanceEth")
            writer.writerow([p[c] for c in cols])

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
          <th>Round</th>
          <th>Project</th>
          <th>Logo</th>
          <th>Banner</th>
          <th>Hypercert URL</th>
          <th>Fractions</th>
          <th>Project Wallet Address</th>
          <th>Wallet Type</th>
        </tr>
      '''

    footer = "</table></body></html>"

    td = lambda row: f"<td>{row}</td>"
    body = []

    for project in PROJECTS_DB:
            
            grantName = project['title']
            filename = create_project_filename(grantName)
            grantPage = project['projectWebsite']            
            logo_cid = project["projectLogoCid"] if project["projectLogoCid"] else BACKUP_LOGO_CID
            logo = LOGO_IMG_BASE + logo_cid
            banner = "".join([BANNER_IMG_BASE, filename, ".png"])
            url = create_url(project)
            address = project['address']
            row = "\n".join([
                "<tr>",
                td(project['roundName']),
                td(f'<a href="{grantPage}">{grantName}</a>'),
                td(f'<img src="{logo}" width="40" height="40"'),
                td(f'<img src="{banner}" style="width: 320px; height: 214px; object-fit: cover; object-position: 100% 0;">'),
                td(f'<a href="{url}">Hypercert URL</a>'),
                td(project['fractionsTotalSupply']),
                td(f'<a href="https://etherscan.io/address/{address}">{address[:5]}...{address[-3:]}</a>'),
                td(project['addressType']),
                "</tr>"
            ])
            body.append(row)
    
    html = header + "\n".join(body) + footer
    html_filename = EXPORTS_DIR + "project_urls.html"
    with open(html_filename, "w") as f:
        f.write(html)


    
if __name__ == "__main__":
    create_markdown_export()
    create_csv_export()
    create_html_export()