# Gitcoin Beta Round

Scripts which may be helpful when working with Gitcoin Data and Allo Protocol. Contributions welcome!

# Setup

1. Set environment variables in a `.env` file. You may need the following API keys:

   - ALCHEMY_KEY
   - ETHERSCAN_KEY
   - OPTIMISM_ETHERSCAN_API_KEY
   - OPENAI_API_KEY
   - WEB3_STORAGE_TOKEN

2. Check you have installed the necessary requirements in `requirements.txt` and for web3.storage (npm)

3. Reviewing settings in `config.json`

# Funding Round Set-up

To initialize the data, you will need to gather information about the Funding Rounds:

1. In `get_grants_data.py`, run the `get_funding_rounds` module from the `main` function

2. This will extract data from Gitcoin's allo protocol and create a file called `data/funding-round-data.json`

3. Open the file and modify any of the styling for hypercert background colors and vector art. 

```
  {
    "roundId": "0xdf22a2C8F6BA9376fF17EE13E6154B784ee92094",
    "roundName": "Ethereum Infrastructure",
    "backgroundColor": "blue",         // YOU MAY EDIT THIS
    "backgroundVectorArt": "contours"  // YOU MAY EDIT THIS
  }
```
4. Comment out `get_funding_rounds` in the `main` function so it doesn't overwrite your new settings

# Generating Hypercerts

1. Double check settings in `config.json`

2. From the command line, execute `bash workflow.sh`. This will do the following:

   - Gather data for all projects
   - Prepare allowlists for all projects (stored as CSV files locally in `data/allowlists/`)
   - Extract and resize banner images for all projects (stored as PNG files locally in `data/img/`)
   - Use GPT to generate a 2-3 sentence description and <30 character work scope for each project (stored as JSON files locally in `data/`)
   - Upload allowlists and banner images to web3.storage (the CIDs are stored locally in `data/cids.json`)
   - Create a custom hypercert minting link for each project (a table with each project and its minting link is stored locally in `data/projects.csv`
