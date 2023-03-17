import json
import pandas as pd


CONFIG   = json.load(open("config/config.json"))
DUNE_EXPORTS = CONFIG["localPaths"]["duneSnapshots"]
MULTISIG_PATH = CONFIG["localPaths"]["duneMultisigsList"]


def ingest_dune_export(csv_path):
    
    df = pd.read_csv(csv_path)
    df['address'] = df['donor'].apply(lambda x: "0"+x[1:].lower())
    df.drop(columns=['donor'], inplace=True)
    
    return df


def check_multisigs(paths):

    df = pd.concat([ingest_dune_export(f) for f in paths], axis=0)
    ms = pd.read_csv(MULTISIG_PATH)
    multisig_list = set(ms['address'].str.lower())
    df['multisig'] = df['address'].apply(lambda x: x in multisig_list)
    
    dff = (df[df['multisig'] == True]
            .groupby('address')
            .sum('usd')
            .sort_values(by='usd'))

    print("Multisig analysis:")
    print(
        len(dff),
        "wallets | ",
        len(dff) / len(df['address'].unique()) * 100,
        "pct of all wallets"
    )
    print(
        "USD",
        dff['usd'].sum(),
        "donated | ",
        dff['usd'].sum() / df['usd'].sum() * 100,
        "pct of all donations"
    )
    print("\nTop multisigs:")
    print(dff.head())



def main():
    check_multisigs(paths=DUNE_EXPORTS)


if __name__ == "__main__":
    main()       