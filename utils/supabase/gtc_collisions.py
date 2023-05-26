import json
import pandas as pd
import re

from claims_metadata_mapper import save_supabase_snapshot_to_csv


CSV_FILEPATH = "data/claimsData.csv"
OUTPATH = "data/gitcoinCollisionsData.json"
COLS = ['claimId', 'title', 'creatorAddress', 'date', 'totalUnits', 'properties', 'hypercert']


def tagger(x):
    search = lambda ss, s: re.search(ss, s, re.IGNORECASE)
    if isinstance(x['title'], str):
        if isinstance(x['properties'], str) and search("gitcoin", x['properties']):
            return True
    return False


def load_csv(path=CSV_FILEPATH):
    df = pd.read_csv(path, index_col='claimId', usecols=COLS)
    df['tag'] = df.apply(tagger, axis=1)
    df = df[df['tag'] == True]
    df.sort_values(by='date', inplace=True)
    return df


def check_collisions(df):
    collisions = []
    for i, (id1, row1) in enumerate(df.iterrows()):
        tag = row1['tag']
        for (id2, row2) in df.head(i).iterrows():
            if row1['creatorAddress'] == row2['creatorAddress']:
                creator = "same creator"
            else:                
                creator = f"by {row1['creatorAddress']} & {row2['creatorAddress']}"
            if row1['hypercert'] == row2['hypercert']:
                case = f'duplicate claim in hyperspace ({creator} creator)'
            elif row1['title'] == row2['title'] and row1['title'] != 'The name of your hypercert':
                case = f'duplicate title in hypercerts ({creator})'
            else:
                continue
            collisions.append({
                'id': id1,
                'collision': id2,                
                'creator': row1['creatorAddress'],
                'date': row1['date'],
                'title': row1['title'],
                'case': case
                #'details': eval(row1['hypercert'])
            })
                
    return collisions


def run_analysis():

    save_supabase_snapshot_to_csv()
    df = load_csv()
    collisions_data = check_collisions(df)
    with open(OUTPATH, 'w') as f:
        json.dump(collisions_data, f, indent=4)


if __name__ == "__main__":
    run_analysis()
