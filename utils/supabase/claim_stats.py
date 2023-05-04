import json
import pandas as pd
import re


CSV_FILEPATH = "data/claimsData.csv"
OUTPATH = "data/collisionsData.json"
COLS = ['claimId', 'title', 'creatorAddress', 'date', 'totalUnits', 'properties', 'hypercert']


def tagger(x):

    search = lambda ss, s: re.search(ss, s, re.IGNORECASE)
    if isinstance(x['properties'], str):
        if search("gitcoin", x['properties']):
            return "1. Gitcoin"
    if search("givegratitude", x['title']):
        return "2. GiveGratitude.io"
    if search("zuzalu", x['title']) or search("zuzalu", x['hypercert']):
        return "3. Zuzalu"
    if x['totalUnits'] != 10000:
        return "4. Other Community Generated"
    return "5. Random (No Collection, No Allowlist)"
    

def load_csv(path=CSV_FILEPATH):
    df = pd.read_csv(path, index_col='claimId', usecols=COLS)
    df['tag'] = df.apply(tagger, axis=1)
    df.sort_values(by='date', inplace=True)
    return df


def check_collisions(df):
    collision_list = [False]
    collisions = []
    for i, (id1, row1) in enumerate(df.iterrows()):
        collision = False
        if i == 0:
            continue
        for (id2, row2) in df.head(i).iterrows():
            creator = "same" if (row1['creatorAddress'] == row2['creatorAddress']) else "diff"
            if row1['hypercert'] == row2['hypercert']:
                collisions.append({
                    'id': id1, 
                    'collision': id2, 
                    'case': f'duplicate claim in hyperspace ({creator} creator)',
                    'details': row1['hypercert']
                })         
                collision = True
            elif row1['title'] == row2['title']:
                if row1['title'] != 'The name of your hypercert':
                    collisions.append({
                        'id': id1, 
                        'collision': id2, 
                        'case': f'duplicate title in hypercerts ({creator} creator)',
                        'details': f"Title is {row1['title']}"
                    })
                collision = True
        collision_list.append(collision)

    return collision_list, collisions


def run_analysis():
    df = load_csv()
    collision_list, collisions_data = check_collisions(df)
    df['collisions'] = collision_list

    pdf = df.pivot_table(index='tag', columns='collisions', values='date', aggfunc='count')
    print(pdf)
    with open(OUTPATH, 'w') as f:
        json.dump(collisions_data, f, indent=4)


if __name__ == "__main__":
    run_analysis()
