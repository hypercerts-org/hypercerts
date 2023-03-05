# Gitcoin-Helpers

Scripts which may be helpful when working with Gitcoin Data and Allo Protocol. Contributions welcome!

# Setup

1. Set environment variables in a `.env` file. You'll need the following API keys:

   - ALCHEMY_KEY
   - ETHERSCAN_KEY
   - CHAINALYSIS_API_KEY
   - THEGRAPH_API_KEY
   - OPTIMISM_ETHERSCAN_API_KEY

2. Check you have installed the necessary requirements in `requirements.txt`

3. Download the necessary Dune snapshots as CSV files and move them to the appopriate directory.

   - ETH Infra: https://dune.com/queries/1934656
   - Climate: https://dune.com/queries/1934689
   - OSS: https://dune.com/queries/1934969

4. Using the Dune datasets, configure `confg/projects-list.json` so there is an array containing the project title, address, and round details for each project.

   For example:

   ```
   {
       "title": "Otterscan",
       "address": "0xb7081Fd06E7039D198D10A8b72B824e60C1B1E16",
       "roundId": "0xe575282b376e3c9886779a841a2510f1dd8c2ce4",
       "roundName": "Ethereum Infrastructure"
   },
   {
       "title": "BuidlGuidl",
       "address": "0x97843608a00e2bbc75ab0c1911387e002565dede",
       "roundId": "0xe575282b376e3c9886779a841a2510f1dd8c2ce4",
       "roundName": "Ethereum Infrastructure"
   }
   ```

   Note that project "bundles" are stored in `bundles-list.json`.

5. Review the other files in `config/*.json` to ensure that all directories, filenames, and other settings are correct.

# Organization

- `/data/csv`: snapshots of on-chain data taken using Dune Analytics and exported as CSV files (requires paid API); also includes work-scope overrides
- `/data/allowlists`: CSV files containing the addresses donating to each Gitcoin Grant (one CSV per project) that are eligible for hypercerts fractions (1 DAI = 1 hypercert fractional unit); to be stored on IPFS
- `/data/donorlists`: CSV files containing the addresses donating to each Gitcoin Grant (one CSV per project)
- `/data/images`: cropped and resized banner images for hypercert artwork; to be stored on IPFS
- `/data`: local versions of project data from Round Manager graphs; exports of relevant project data

# Modules

## get_grants_data.py

This script queries The Graph API (using a Round ID and an API_KEY stored in `.env`) to gather data about all projects in a given round. It exports data on all the projects into a JSON file called `/data/graph-data.json`. Data is gathered from the mainnet subgraph and IPFS.

## allowlist.py

This script ingests a list of CSV files generated from Dune Analytics queries. It generates a unique allowlist (exported as a CSV file) for each project. An allowlist contains the following information:
| index | address | price | fractions |
| -------- | -------- | -------- | -------- |
| 0 | 0x... | 0.0 | 20 |
| 1 | 0x... | 0.0 | 15 |
| 99 | 0x... | 0.0 | 1 |

The queries used to generate the allowlists can be viewed here:

- ETH Infra: https://dune.com/queries/1934656
- Climate: https://dune.com/queries/1934689
- OSS: https://dune.com/queries/1934969

The `allowlist.py` module makes assumptions about how amounts donated to each project translate into hypercert fractions. The current assumptions award a fraction for every $1 donated using a `floor` function. For example:

- $5.60 donated --> 5 fractions
- $5.20 donated --> 5 fractions
- $0.52 donated --> 0 fractions

The `screen_allowlist.py` module utilizes the Chainalysis API to log and exclude any wallets that appear on sanctions lists.

After running these script, the allowlists should be stored on IPFS and the CID should be updated in `config.json`.

## serialize_project_data.py

This script creates a `canonical-project-data.json` by parsing the `graph-data.json` file with information about each project.

## serialize_address_data.py

This script updates `canonical-project-data.json` by adding on-chain informationa bout each wallet, including ENS names, Safe multisigs, 0xSplits, and ETH tokens on Optimism.

## serialize_hypercert_data.py

This script reads project data and default assumptions for the grants round to create hypercert metadata for each project. This script also updates `canonical-project-data.json`.

## process_images.py

This script creates a local copy of each project's banner image and resizes it to the hypercert required dimensions. After running this script, the updated images should be stored on IPFS and the CID should be updated in `config.json`.

## create_hypercert_minting_url.py

This script converts `canonical-project-data.json` to urls used for populating the hypercert minting form. It also exports several tables in markdown, CSV, and HTML format to facilitate operations in `data/project_urls.*`.

# Recommended workflow

1. Complete the setup instructions and download the necessary CSV snapshots from Dune Analytics
2. Review each of the config files, including `/config/projects-list.json` to ensure that all projects are correctly listed for each round
3. Run `get_grants_data.py` to pull all the grant data from the round
4. Run `allowlist.py` to generate (and sanction screen) the allowlists
5. Bulk upload the allowlist CSVs to a web3.storage; copy the CID
6. Update the `allowlistBaseUrl` property in `config.json` with the new CID base
7. Run `serialize_project_data.py`, then `serialize_address_data.py`, and finally `serialize_hypercert_data.py` to prepare a complete version of `canonical-project-data.json`
8. Run `process_images.py` to resize and crop the banner images
9. Bulk upload the images to a web3.storage; copy the CID
10. Update the `bannerImageBaseUrl` property in `config.json` with the new CID base
11. Run `python create_hypercert_minting_url.py`
12. View the complete URL sets and datasets in `/data/project_urls.*`
