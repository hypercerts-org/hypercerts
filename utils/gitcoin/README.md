# Gitcoin-Helpers

Scripts which may be helpful when working with Gitcoin Data and Allo Protocol. Contributions welcome!

# Setup

1. Set environment variables in a `.env` file. You'll need the following API keys:

    - CHAINALYSIS_API_KEY
    - THEGRAPH_API_KEY
    - OPTIMISM_ETHERSCAN_API_KEY

2. Check you have installed the necessary requirements in `requirements.txt`

3. Download the necessary Dune snapshots as CSV files and move them to the appopriate directory.

    - ETH Infra: https://dune.com/queries/1934656
    - Climate: https://dune.com/queries/1934689
    - OSS: https://dune.com/queries/1934969
    - Safe Multisigs: https://dune.com/queries/1949707
    - OxSplits: https://dune.com/queries/1979620

4. Using the Dune datasets, configure `projects.json` so there is an array containing the project title and address for each grants round. For example:

    ```
    {
        "Ethereum Infrastructure": [
            {
                "title": "Otterscan",
                "address": "0xb7081Fd06E7039D198D10A8b72B824e60C1B1E16"
            },
            {
                "title": "BuidlGuidl",
                "address": "0x97843608a00e2bbc75ab0c1911387e002565dede"
            }
        ]
    }	
    ```

5. Review the `config.json` to ensure that all directories, filenames, and other settings are correct.

# Organization
- `/data/dune`: snapshots of on-chain data taken using Dune Analytics and exported as CSV files (requires paid API)
- `/data/allowlists`: CSV files containing the addresses donating to each Gitcoin Grant (one CSV per project); to be stored on IPFS
- `/data/metadata`: JSON files containing hypercert metatdata and minting parameters for each Gitcion Grant (one JSON per project)
- `/data/projects`: local versions of project data from Round Manager graphs; work-scope overrides; exports of relevant project data

# Modules

## get_grants_data.py
This script queries The Graph API (using a Round ID defined in `config.json` and an API_KEY stored in `.env`) to gather data about all projects in a given round. It exports data on all the projects in the round in a CSV file in the `/data/projects` directory. Data is gathered from the mainnet subgraph and IPFS.

## allowlist.py
This script ingests a list of CSV files generated from Dune Analytics queries. It generates a unique allowlist (exported as a CSV file) for each project. An allowlist contains the following information:
| index | address | price | fractions | 
| -------- | -------- | -------- | -------- | 
| 0     | 0x... | 0.0 | 20 |
| 1     | 0x... | 0.0 | 15 |
| 99    | 0x... | 0.0 | 1 |

The queries used to generate the allowlists can be viewed here:

- ETH Infra: https://dune.com/queries/1934656
- Climate: https://dune.com/queries/1934689
- OSS: https://dune.com/queries/1934969

The `allowlist.py` module makes assumptions about how amounts donated to each project translate into hypercert fractions. The current assumptions award a fraction for every $1 donated using a `floor` function. For example:

- $5.60 donated --> 5 fractions
- $5.20 donated --> 5 fractions
- $0.52 donated --> 0 fractions

The allowlist module also utilizes the Chainanlysis API to log and exclude any wallets that appear on sanctions lists.

## serialize_project_stats.py
This script creates a `canonical_project_data.json` by updating the `projects.json` file with information about each project wallet. It looks for Safe multisigs, 0xSplits, and ETH tokens on Optimism. The updated JSON structure looks like:
```
{
    "Ethereum Infrastructure": [
        {
            "title": "Otterscan",
            "address": "0xb7081Fd06E7039D198D10A8b72B824e60C1B1E16",
            "type": "wallet",
            "multisig": false,
            "optimism": 0.0,
            "fractions": 3734
        }
    ]
}
```

## create_hypercerts_metadata.py
This script takes as arguments:
1. The path of a csv file created by `get_grants_data.py` 
2. A directory for exporting hypercerts metadata (as a json), eg, `../metadata/myround`
It tranforms the data in the csv file into a metadata file (ready for uploading on IPFS) that stores all required hypercerts properties

## create_hypercert_minting_url.py
This script converts hypercerts metadata exported by `create_hypercerts_metadata.py` to urls used for populating the hypercert minting form.

# Recommended workflow

1. Run `get_grants_data.py` to pull all the grant data from the round
2. Review `canonical_project_list.json` to ensure that all projects are correctly listed for each round
3. Review the projects and workscopes on the Notion page; download the CSV of workscopes to override
4. Review the Dune queries to make sure that there is a query for all projects; if OK, then download the CSV versions of the queries
5. Run `allowlist.py` to generate an allowlist csv for each project (this requires having an API key to run sanctions checks on wallets)
6. Bulk upload the allowlist CSVs to a nft.storage; copy the CID
7. Update the `ALLOWLIST_BASE_URL` field's CID in `create_hypercerts_metadata.py`; then execute the script
8. Bulk upload the allowlist JSONs to a nft.storage; copy the CID
9. Update the `METADATA_URL` amd run `create_hypercert_minting_url.py`
