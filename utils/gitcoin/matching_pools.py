import json
import pandas as pd


CONFIG        = json.load(open("config/config.json"))
PAYOUT_DF     = pd.read_csv(CONFIG["localPaths"]["payoutData"], index_col=0)
PROJECTS_DB   = json.load(open(CONFIG["localPaths"]["canonicalDataset"]))
ROUND_DATA    = json.load(open("config/rounds-list.json"))
OUTPATH       = CONFIG["localPaths"]["payoutExports"]


def get_donors(round_name):
    for round_data in ROUND_DATA:
        if round_data["roundName"] == round_name:
            return round_data["matchPoolDonors"]


def clean_usd(val):
    val = val.replace("$","")
    val = val.replace(",","")
    return float(val)


def get_payout(project):
    data = []
    grant_id = "-".join([project["projectId"], project["roundId"]])
    payout_data = PAYOUT_DF.loc[grant_id]
    payout_amount = clean_usd(payout_data["match_amount_dai"])
    donor_list = get_donors(project["roundName"])
    for matching_pool_donor in donor_list:
        for donor_address, donor_share in matching_pool_donor.items():
            data.append({
                'donor': donor_address.lower(),
                'title': project["title"],
                'usd': payout_amount * donor_share
            })
    return data


def assign_payouts():
    payouts = []
    for project in PROJECTS_DB:
        try:
            result = get_payout(project)
            payouts.extend(result)
        except:
            print(project["title"], project["projectId"])
        
    df = pd.DataFrame(payouts)
    df.to_csv(OUTPATH)
    print(df.head())
    print("Successfully exported to:", OUTPATH)


def reconcile_data():
    for grant_id, project_data in PAYOUT_DF.iterrows():
        match = False
        for project in PROJECTS_DB:
            project_grant_id = "-".join([project["projectId"], project["roundId"]])
            if project_grant_id == grant_id:
                match = True
        if not match:
            print(grant_id, project_data['title'])



if __name__ == "__main__":
    assign_payouts()       
    #reconcile_data()