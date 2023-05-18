import json
import pandas as pd


CONFIG         = json.load(open("config/config.json"))
QF_EXPORTS     = CONFIG["localPaths"]["qfData"]
MULTISIG_PATH  = CONFIG["localPaths"]["duneMultisigsList"]
MULTISIG_DUMP  = CONFIG["localPaths"]["multisigTransactionExport"]
MULTISIG_MAP   = json.load(open(CONFIG["localPaths"]["multisigMapping"]))
PROJECTS       = json.load(open("config/projects-list.json"))

ETH_DAI_RATE   = 1586 # close on January 31


def convert_token(token, amount):
    if token == 'ETH':
        return amount * ETH_DAI_RATE
    return amount


def ingest_qf_export(csv_path):
    
    # need to determine which round the project belongs to since there may
    # be some wallet addresses shared by "unique" projects in multiple rounds
    if "oss" in csv_path:
        this_round = "Open Source Software"
    elif "climate" in csv_path:
        this_round = "Climate Solutions"
    else:
        this_round = "Ethereum Infrastructure"

    project_mapper = {
        x["address"].lower(): x["title"] 
        for x in PROJECTS
        if x["roundName"] == this_round
    }

    df = pd.read_csv(csv_path)
    df.rename(columns={'source_wallet': 'address'}, inplace=True)
    df['address'] = df['address'].apply(lambda x: x.lower())
    df['usd'] = df.apply(lambda x: convert_token(x['token'], x['amount']), axis=1)
    df['title'] = df['destination_wallet'].str.lower().map(project_mapper)

    gdf = (df
            .groupby(['address', 'title'])['usd'].sum()
            .reset_index()
            .set_index('address'))

    return gdf


def split_multisigs(multisig_df):
    data = []
    for m in MULTISIG_MAP:
        current_address = m["address"].lower()
        mapping = m["mapping"]
        mdf = multisig_df[multisig_df["address"] == current_address]
        for _, donation in mdf.iterrows():
            for (new_address, share_of_donation) in mapping.items():
                data.append({
                    "donor": new_address.lower(),
                    "title": donation["title"],
                    "usd": donation["usd"] * share_of_donation
                })
    new_df = pd.DataFrame(data).set_index("donor")
    return new_df


def check_multisigs(paths):

    df = pd.concat([ingest_qf_export(f) for f in paths], axis=0)

    ms = pd.read_csv(MULTISIG_PATH)
    multisig_list = set(ms['address'].str.lower())
    dff = df[df.index.isin(multisig_list)]

    print("Multisig analysis:")
    print(
        len(dff),
        "wallets | ",
        len(dff) / len(df) * 100,
        "pct of all wallets"
    )
    print(
        "USD",
        dff['usd'].sum(),
        "donated | ",
        dff['usd'].sum() / df['usd'].sum() * 100,
        "pct of all donations"
    )
    
    split_df = split_multisigs(dff.reset_index())
    split_df.to_csv(MULTISIG_DUMP)



def main():
    check_multisigs(paths=QF_EXPORTS)


if __name__ == "__main__":
    main()       