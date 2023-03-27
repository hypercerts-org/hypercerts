from dotenv import load_dotenv
import json
import openai
import os
import pandas as pd
import time

from utils import create_project_filename, datify


# Set up OpenAI API client
load_dotenv()
openai.api_key = os.environ['OPENAI_API_KEY']


CONFIG        = json.load(open("config/config.json"))
GRAPH_DATA    = json.load(open(CONFIG["localPaths"]["graphData"]))
ALLOWLIST_DIR = CONFIG["localPaths"]["allowlistDirectory"]
DONORLIST_DIR = CONFIG["localPaths"]["donorlistDirectory"]
BUNDLES_DATA  = CONFIG["localPaths"]["bundleDataset"]
PROJECTS_DATA = CONFIG["localPaths"]["bundleProjectsDataset"]
SETTINGS      = json.load(open("config/gitcoin-settings.json"))
DEFAULT_DIMS  = SETTINGS["defaultDims"]

ROUND_ID = "0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0"
BUNDLE_IDS = [
    "0x0b84bfa1e358e2c7816e5244258c16e4d6d06930fb4cf20f2d714ce35d330308",
    "0x95adaaef6d0a11b862f47a236bbca9d93dcfe35d1ae044edc0223d5485e1bfbb",
    "0x89c4fbe0d97ba25cba17b36c837c27cb7b39c96ccc8b43a99df2dfaca9732763",
    "0x5b82b9d0cb3d0d14c8fe693502b197cfbc0f55115446632448549da20538c96c",
    "0x42c5410440da06b29d782ee691783aad21d76b0de61c1034432f816af89aa57f",
    "0xd716c3a7c353f0458ff8387fb435606934e25b631a83db017e5eb9a0022358f0",
    "0xedc8c2863195c102234eb522c94568c4aabd91d4eb2df52d2c4dc9f953e01295",
    "0xe8017af6c0a19b08c86e8ef94d9b3dadcbe8f55bc446d7359a6f294d68227b84",
    "0x52f41f0f49803ae47f13977a8a5dd1b170348e82e2d59303861efb83d1413b50",
    "0xf39a20c932f2445f48214e8726d305bac89d54b3c99940d601a168e2b8745014"
]
BUNDLE_MAPPING = {
    'Bundle: Agriculture': 'Agriculture',
    'Act Now Climate Change Bundle': 'Act Now Climate Change',
    'Bundle ⚡️♻️Renewable Energy': 'Renewable Energy',
    'Bundle: Climate Research Alpha Round': 'Climate Research',
    'Bundle: Oceans & Forests': 'Oceans & Forests',
    'Bundle #3: Verification Infrastructure (Impact Certs, Measurement, Reporting & Verification (MRV) and Oracles)': 'Verification Infrastructure',
    'Bundle: Carbon Markets': 'Carbon Markets',
    'Community Engagement - Bundle 6': 'Community Engagement',
    'Bundle: Emerging Economies and Indigenous Communities': 'Emerging Economies',
    'Bundle: Creative Works': 'Creative Works'
}
DEFAULT_URL = "https://grant-explorer.gitcoin.co/#/round/1/0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0"


def extract_projects(text_blob, max_tokens=1250):

    prompt = (f"Consider the following text:\n\n"
              f"---\n\n"
              f"{text_blob}\n\n"
              f"---\n\n"
              f"Convert the text into a JSON that lists the projects and has the following keys for each project:" 
              f"`project_name`, `twitter_handle`, `description`."
              f"Edit the `description` field to 2-3 sentences.")

    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=max_tokens,
            n=1,
            stop=None
        )
        
        data = response.choices[0].text

        data = data.replace("```json", "")
        data = data.replace("```", "")
        data = data.strip()

        json_data = json.loads(data)
        print(f"Retrieved {len(json_data)} projects.")
        return json_data    
    
    # most common exceptions are rate limiting or a mis-formatted JSON object
    except Exception as e:
        print(e)        
        time.sleep(30)
        return(extract_projects(text_blob))


def extract_bundles():

    bundles = []
    for project_record in GRAPH_DATA:
        bundle_id = project_record["projectId"]
        round_id = project_record["roundId"]
        info = project_record["data"]["application"]["project"]
        bundle_name = info["title"]
        description = info["description"]        
        if bundle_id in BUNDLE_IDS and round_id == ROUND_ID:
            print(f"Getting project data for: {bundle_name}.")
            bundles.append(dict(
                            bundleId=bundle_id,
                            roundId=round_id,
                            bundleName=bundle_name,
                            bundleDescription=description,
                            projects=extract_projects(description)
                        ))
            time.sleep(10)
    
    out_file = open(BUNDLES_DATA, "w")
    json.dump(bundles, out_file, indent=4)                
    out_file.close()


def get_twitter_url(handle):
    if not isinstance(handle, str):
        return DEFAULT_URL
    handle = handle.strip()
    if " " in handle or "." in handle or len(handle) < 3:
        return DEFAULT_URL
    if handle[0] == '@': 
        handle = handle[1:]
    return f"https://twitter.com/{handle}"


def map_projects_to_bundles():
    bundles = json.load(open(BUNDLES_DATA))
    mapper = {}
    for b in bundles:
        bundle_name = b["bundleName"]
        for p in b["projects"]:
            project_name = p["project_name"]
            if project_name not in mapper.keys():
                mapper.update({
                    project_name: {
                        "bundles": [bundle_name],
                        "data": {
                            "title": project_name,
                            "description": p["description"],
                            "externalLink": get_twitter_url(p["twitter_handle"])
                        }
                    }   
                })
            else:
                mapper[project_name]["bundles"].append(bundle_name)

    return mapper


def create_project_allowlists(project, bundles_list):
    paths = [ALLOWLIST_DIR + create_project_filename(f) + ".csv" for f in bundles_list]
    df = (pd
            .concat([pd.read_csv(p) for p in paths], axis=0, ignore_index=True)
            .groupby('address')['price', 'fractions']
            .sum()
            .sort_values(by='fractions', ascending=False)
            .reset_index())
    df.index.name = 'index'
    df.to_csv(ALLOWLIST_DIR + create_project_filename(project) + ".csv")

    return dict(
        fractionsTotalSupply=round(df['fractions'].sum()),
        hypercertEligibleDonors=len(df)
    )


def build_bundle_hypercert(bundles_list):

    workscope = ",".join([BUNDLE_MAPPING[b] for b in bundles_list])
    return dict(
        workScopes = workscope,
        workTimeStart = datify(DEFAULT_DIMS["workTimeStart"]),
        workTimeEnd = datify(DEFAULT_DIMS["workTimeEnd"]),
        
        impactScopes = [DEFAULT_DIMS["impactScopes"]],
        impactTimeStart = datify(DEFAULT_DIMS["workTimeStart"]),
        impactTimeEnd = datify(DEFAULT_DIMS["impactTimeEnd"]),
        
        contributors = "",
        rights = [DEFAULT_DIMS["rights"]]
    )


def run_project_stats():

    projects_dict = map_projects_to_bundles()
    project_records = []
    for project, project_fields in projects_dict.items():
        bundles_list = project_fields["bundles"]
        allowlist_data = create_project_allowlists(project, bundles_list)
        hypercert_data = build_bundle_hypercert(bundles_list)

        project_records.append({                
            "title": project,
            "address": "",
            "roundId": ROUND_ID,
            "projectDescription": project_fields["data"]["description"],
            "projectWebsite": project_fields["data"]["externalLink"],
            **allowlist_data,
            "hypercertData": hypercert_data
        })
    out_file = open(PROJECTS_DATA, "w")
    json.dump(project_records, out_file, indent=4)                
    out_file.close()

if __name__ == "__main__":
    # run this to generate the initial JSON
    #extract_bundles()
    run_project_stats()