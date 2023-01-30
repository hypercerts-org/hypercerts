# Gitcoin-Helpers

Starting to collect little scripts which may be helpful when working with Gitcoin Data and Protocol. Contributions welcome!

# Modules

## get_grants_data.py
This script takes a round ID and API_KEY (your API_KEY for querying TheGraph protocol) as input and returns data on the projects in the round, primarily the projects title and payout_address. Data is gathered from the mainnet subgraph and IPFS. The output comes in two forms: a csv file and a SQL file. The SQL file can be used to start a Dune Query.

## create_hypercerts_metadata.py
This script takes as arguments:
1. The path of a csv file created by `get_grants_data.py` 
2. A directory for exporting hypercerts metadata (as a json), eg, `../metadata/myround`
It tranforms the data in the csv file into a metadata file (ready for uploading on IPFS) that stores all required hypercerts properties

## create_hypercert_minting_url.py
This script converts hypercerts metadata exported by `create_hypercerts_metadata.py` to urls used for populating the hypercert minting form at `https://hypercerts.vercel.app/hypercerts/create`
This script has option arguments:
1. The path to the metadata directory (deftaults to `metadata`)
2. The name out the output file (defaults to `minting_urls.txt`)

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

# Recommended workflow

1. Run `get_grants_data.py` to pull all the grant data from the round
2. Review `canonical_project_list.json` to ensure that all projects are correctly listed for each round
3. Review the projects and workscopes on the Notion page; download the CSV of workscopes to override
4. Review the Dune queries to make sure that there is a query for all projects; if OK, then download the CSV versions of the queries
5. Run `allowlist.py` to generate an allowlist csv for each project
6. Bulk upload the allowlist CSVs to a nft.storage; copy the CID
7. Update the `ALLOWLIST_BASE_URL` field's CID in `create_hypercerts_metadata.py`; then execute the script
8. Run `create_hypercert_minting_url.py`