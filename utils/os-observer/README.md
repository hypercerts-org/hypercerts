# Create projects and events data for Open Source Observer

# Setup

1. Set environment variables in a `.env` file. You'll need API access credentials for Alchemy, Etherscan, Github, and Supabase.

2. Install the requirements in the `requirements.txt` file.

`$ pip install -r requirements.txt`

# Adding projects

Projects must be stored in a JSON with the following fields:

- name
- description
- github_org

A database of projects can be initialized with the following command:

`$ python src/database.py`

# Fetching Github events for a project

`command goes here`

# Linking a wallet address to a project

A wallet address can be linked to a project with the following command:

`command goes here`
