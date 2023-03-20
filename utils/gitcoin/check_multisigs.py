import json
import pandas as pd


CONFIG        = json.load(open("config/config.json"))
QF_EXPORTS    = CONFIG["localPaths"]["qfData"]
MULTISIG_PATH = CONFIG["localPaths"]["duneMultisigsList"]
ETH_DAI_RATE  = 1500


def convert_token(token, amount):
    if token == 'ETH':
        return amount * ETH_DAI_RATE
    return amount

def ingest_qf_export(csv_path):
    
    df = pd.read_csv(csv_path)
    df = df[['source_wallet', 'token', 'amount']]
    df['address'] = df['source_wallet'].apply(lambda x: x.lower())
    df['usd'] = df.apply(lambda x: convert_token(x['token'], x['amount']), axis=1)    
    return df


def check_multisigs(paths):

    ms = pd.read_csv(MULTISIG_PATH)
    multisig_list = set(ms['address'].str.lower())

    df = pd.concat([ingest_qf_export(f) for f in paths], axis=0)
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
    check_multisigs(paths=QF_EXPORTS)


if __name__ == "__main__":
    main()       