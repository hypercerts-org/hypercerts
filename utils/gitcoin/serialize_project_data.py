import json
import pandas as pd
from utils import create_project_filename


CONFIG        = json.load(open("config/config.json"))
GRAPH_DATA    = json.load(open(CONFIG["localPaths"]["graphData"]))
ALLOWLIST_DIR = CONFIG["localPaths"]["allowlistDirectory"]
DONORLIST_DIR = CONFIG["localPaths"]["donorlistDirectory"]
OUTPATH       = CONFIG["localPaths"]["canonicalDataset"]
PROJECTS      = json.load(open("config/projects-list.json"))
SETTINGS      = json.load(open("config/gitcoin-settings.json"))


def serialize_donor_stats(project_name):

    fname = create_project_filename(project_name) + ".csv"
    donorlist_df = pd.read_csv(DONORLIST_DIR + fname)
    allowlist_df = pd.read_csv(ALLOWLIST_DIR + fname)
    
    return dict(
        fundingTotalDollars=round(donorlist_df['usd'].sum()),
        donorsTotal=len(donorlist_df),
        fractionsTotalSupply=round(allowlist_df['fractions'].sum()),
        hypercertEligibleDonors=len(allowlist_df)
    )


def serialize_project_info(project_record):
    
    info = project_record["data"]["application"]["project"]

    return dict(
        projectDescription=info.get('description'),
        projectWebsite=info.get('website'),
        projectLogoCid=info.get('logoImg'),
        projectBannerCid=info.get('bannerImg'),
        projectTwitter=info.get('projectTwitter'),
        projectGithub=info.get('projectGithub'),
        userGithub=info.get('userGithub')
    )
    
    
def find_project_record(project_dict):
    for record in GRAPH_DATA:
        if all([
            record["roundId"] == project_dict["roundId"],
            record["data"]["application"]["project"]["title"] == project_dict["title"],
            record["data"]["application"]["recipient"] == project_dict["address"]
            ]):
            return record


def run_project_stats():

    project_records = []
    for project_dict in PROJECTS:
        record = find_project_record(project_dict)
        if record:
            project_dict.update(serialize_project_info(record))
            project_dict.update(serialize_donor_stats(project_dict["title"]))
            project_records.append(project_dict)
        else:
            print("Record not found for project:", project_title["title"])

    
    out_file = open(OUTPATH, "w")
    json.dump(project_records, out_file, indent=4)                
    out_file.close()
    print(f"Serialized data for {len(project_records)} projects")


if __name__ == "__main__":
    run_project_stats()